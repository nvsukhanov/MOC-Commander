import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { Subject, Subscription, combineLatestWith, filter, finalize, map, merge, startWith, switchMap, take, takeUntil, tap } from 'rxjs';
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ConfirmDialogService, FeatureToolbarService, IScrollContainer, SCROLL_CONTAINER, ScreenSizeObserverService, WINDOW } from '@app/shared';
import { ControlSchemeBindingInputComponent } from '../binding-input';
import { ControlSchemeBindingOutputComponent } from '../binding-output';
import { ControlSchemeFormBuilderService } from './control-scheme-form-builder.service';
import { BindingForm, EditSchemeForm } from '../types';
import { ControlSchemeBindingConfigurationComponent } from '../binding-config';
import {
    CONTROLLERS_ACTIONS,
    CONTROLLER_INPUT_SELECTORS,
    CONTROL_SCHEME_ACTIONS,
    CONTROL_SCHEME_CONFIGURATION_ACTIONS,
    CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    ControlScheme,
    ControllerInput,
    ControllerInputType,
    HUB_ATTACHED_IO_SELECTORS,
    HUB_IO_CONTROL_METHODS,
    HubWithSynchronizableIOs,
    hubAttachedIosIdFn
} from '../../../store';
import { CreateVirtualPortConfigurationDialogComponent, CreateVirtualPortDialogResult } from '../../create-virtual-port-dialog';
import { VirtualPortsListComponent } from '../virtual-ports-list';

export type BindingFormResult = ReturnType<EditSchemeForm['getRawValue']>;

@Component({
    standalone: true,
    selector: 'app-control-scheme-edit-form',
    templateUrl: './control-scheme-edit-form.component.html',
    styleUrls: [ './control-scheme-edit-form.component.scss' ],
    imports: [
        MatCardModule,
        MatButtonModule,
        NgIf,
        PushPipe,
        TranslocoModule,
        NgForOf,
        JsonPipe,
        ControlSchemeBindingInputComponent,
        ControlSchemeBindingOutputComponent,
        MatExpansionModule,
        MatInputModule,
        ReactiveFormsModule,
        ControlSchemeBindingConfigurationComponent,
        MatDividerModule,
        MatIconModule,
        RouterLink,
        MatDialogModule,
        VirtualPortsListComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditFormComponent implements OnInit, OnDestroy {
    @Output() public readonly save = new EventEmitter<BindingFormResult>();

    @Output() public readonly cancel = new EventEmitter<void>();

    public readonly form = this.controlSchemeFormFactoryService.createEditSchemeForm(
        this.window.crypto.randomUUID(),
        this.translocoService.translate('controlScheme.newSchemeDefaultName')
    );

    public readonly canAddBinding$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canAddBinding);

    public readonly hubsWithSynchronizableIOs$ = this.store.select(CONTROL_SCHEME_SELECTORS.selectHubsWithSynchronizableIOs).pipe(
        combineLatestWith(this.form.controls.virtualPorts.valueChanges.pipe(startWith(null))),
        map(([ hubs ]) => this.getRemainingSynchronizableIOs(hubs)),
    );

    private readonly onDestroy$ = new Subject<void>();

    private _isSmallScreen = false;

    private sub?: Subscription;

    constructor(
        private readonly store: Store,
        @Inject(WINDOW) private readonly window: Window,
        private readonly controlSchemeFormFactoryService: ControlSchemeFormBuilderService,
        private readonly cdRef: ChangeDetectorRef,
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly actions: Actions,
        private readonly featureToolbarService: FeatureToolbarService,
        @Inject(SCROLL_CONTAINER) private readonly scrollContainer: IScrollContainer,
        private readonly translocoService: TranslocoService,
        private readonly dialog: MatDialog,
        private readonly confirmDialogService: ConfirmDialogService
    ) {
    }

    @ViewChild('controlsTemplate', { static: true, read: TemplateRef })
    public set controlsTemplate(controls: TemplateRef<unknown> | null) {
        if (controls) {
            this.featureToolbarService.setControls(controls);
        } else {
            this.featureToolbarService.clearConfig();
        }
    }

    public get isSmallScreen(): boolean {
        return this._isSmallScreen;
    }

    @Input()
    public set scheme(scheme: ControlScheme) {
        this.form.reset();
        this.form.patchValue(scheme);
        scheme.virtualPorts.forEach((virtualPort) => {
            const virtualPortForm = this.controlSchemeFormFactoryService.createVirtualPortsForm(virtualPort);
            this.form.controls.virtualPorts.push(virtualPortForm);
        });
        scheme.bindings.forEach(binding => {
            const binging = this.controlSchemeFormFactoryService.createBindingForm(
                binding.id,
                binding.input.controllerId,
                binding.input.inputId,
                binding.input.inputType,
                binding.output.hubId,
                binding.output.portId,
                binding.output.operationMode,
                binding.output
            );
            this.form.controls.bindings.push(binging);
        });
        this.form.markAsPristine();
    }

    public ngOnInit(): void {
        this.sub = this.screenSizeObserverService.isSmallScreen$.subscribe((isSmallScreen) => {
            this._isSmallScreen = isSmallScreen;
            this.cdRef.markForCheck();
        });
        this.store.dispatch(CONTROLLERS_ACTIONS.waitForConnect());
    }

    public onSave(): void {
        this.save.emit(this.form.getRawValue());
    }

    public onCancel(): void {
        this.cancel.emit();
    }

    public ngOnDestroy(): void {
        this.featureToolbarService.clearConfig();
        this.sub?.unsubscribe();
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.confirmDialogService.hide(this);
    }

    public addBinding(): void {
        this.startInputCapture();
        this.store.select(CONTROLLER_INPUT_SELECTORS.selectFirst).pipe(
            takeUntil(this.onDestroy$),
            takeUntil(this.actions.pipe(ofType(CONTROL_SCHEME_CONFIGURATION_ACTIONS.stopListening))),
            filter((input): input is ControllerInput => !!input),
            concatLatestFrom((input) => this.store.select(HUB_ATTACHED_IO_SELECTORS.selectFirstIOControllableByInputType(input.inputType))),
            map(([ input, ios ]) => ({ input, ios })),
            take(1),
            finalize(() => this.stopInputCapture())
        ).subscribe({
            next: ({ input, ios }) => {
                const io = ios[0];
                if (!io) {
                    this.store.dispatch(CONTROL_SCHEME_ACTIONS.noIOForInputFound());
                    return;
                }
                const binging = this.controlSchemeFormFactoryService.createBindingForm(
                    this.window.crypto.randomUUID(),
                    input.controllerId,
                    input.inputId,
                    input.inputType,
                    ios[0].ioConfig.hubId,
                    ios[0].ioConfig.portId,
                    ios[0].operationModes[0]
                );
                this.form.controls.bindings.push(binging);
                this.cdRef.detectChanges();
                this.scrollContainer.scrollToBottom();
            }
        });
    }

    public rebindInput(
        binding: BindingForm
    ): void {
        const ioOperationMode = binding.controls.output.controls.operationMode.value;
        const applicableInputTypes = new Set(Object.keys(HUB_IO_CONTROL_METHODS).filter((inputType) => {
            return HUB_IO_CONTROL_METHODS[inputType as ControllerInputType][ioOperationMode] !== undefined;
        }));

        this.startInputCapture();
        this.store.select(CONTROLLER_INPUT_SELECTORS.selectFirst).pipe(
            takeUntil(this.onDestroy$),
            takeUntil(this.actions.pipe(ofType(CONTROL_SCHEME_CONFIGURATION_ACTIONS.stopListening))),
            filter((input): input is ControllerInput => !!input),
            take(1),
            finalize(() => this.stopInputCapture())
        ).subscribe((input) => {
            if (!applicableInputTypes.has(input.inputType)) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.inputRebindTypeMismatch());
                return;
            }
            binding.controls.input.patchValue({
                controllerId: input.controllerId,
                inputId: input.inputId,
                inputType: input.inputType
            });
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.inputRebindSuccess());
            this.cdRef.detectChanges();
        });
    }

    public addVirtualPort(): void {
        this.hubsWithSynchronizableIOs$.pipe(
            take(1),
            switchMap((hubsWithSynchronizableIOs) => {
                const dialogRef = this.dialog.open(CreateVirtualPortConfigurationDialogComponent, {
                    data: this.getRemainingSynchronizableIOs(hubsWithSynchronizableIOs)
                });
                return merge(
                    dialogRef.afterClosed().pipe(map(() => undefined)),
                    dialogRef.componentInstance.confirm.pipe(
                        tap((data: CreateVirtualPortDialogResult) => dialogRef.close(data))
                    )
                );
            }),
            take(1)
        ).subscribe((data: CreateVirtualPortDialogResult | undefined) => {
            if (data) {
                this.form.controls.virtualPorts.push(
                    this.controlSchemeFormFactoryService.createVirtualPortsForm(data)
                );
                this.cdRef.detectChanges();
            }
        });
    }

    public deleteVirtualPort(
        index: number
    ): void {
        this.confirmDialogService.show(
            this.translocoService.selectTranslate('controlScheme.virtualPortDeleteConfirmationTitle'),
            this
        ).subscribe((isConfirmed) => {
            if (isConfirmed) {
                this.form.controls.virtualPorts.removeAt(index);
                this.cdRef.markForCheck();
            }
        });
    }

    public removeBindingIndex(index: number): void {
        this.form.controls.bindings.removeAt(index);
        this.cdRef.markForCheck();
    }

    public cancelAddBinging(): void {
        this.stopInputCapture();
    }

    private startInputCapture(): void {
        this.store.dispatch(CONTROL_SCHEME_CONFIGURATION_ACTIONS.startListening());
    }

    private stopInputCapture(): void {
        this.store.dispatch(CONTROL_SCHEME_CONFIGURATION_ACTIONS.stopListening());
    }

    private getRemainingSynchronizableIOs(
        allHubsWithSynchronizableIOs: HubWithSynchronizableIOs[],
    ): HubWithSynchronizableIOs[] {
        const hubPortsParticipatingInVirtualPorts = new Set<string>();
        this.form.controls.virtualPorts.value.forEach((virtualPortsForm) => {
            if (virtualPortsForm.hubId === undefined || virtualPortsForm.portIdA === undefined || virtualPortsForm.portIdB === undefined) {
                return;
            }
            const hubPortIdA = hubAttachedIosIdFn({ hubId: virtualPortsForm.hubId, portId: virtualPortsForm.portIdA });
            const hubPortIdB = hubAttachedIosIdFn({ hubId: virtualPortsForm.hubId, portId: virtualPortsForm.portIdB });
            hubPortsParticipatingInVirtualPorts.add(hubPortIdA);
            hubPortsParticipatingInVirtualPorts.add(hubPortIdB);
        });

        return allHubsWithSynchronizableIOs.map((hubWithSynchronizableIOs) => {
            const remainingIOs = hubWithSynchronizableIOs.synchronizableIOs.filter((io) => {
                return !hubPortsParticipatingInVirtualPorts.has(hubAttachedIosIdFn(io));
            });
            return {
                ...hubWithSynchronizableIOs,
                synchronizableIOs: remainingIOs
            };
        }).filter((hubWithSynchronizableIOs) => {
            return hubWithSynchronizableIOs.synchronizableIOs.length > 0;
        });
    }
}
