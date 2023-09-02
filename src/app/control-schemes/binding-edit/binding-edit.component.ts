import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { Observable, Subscription, combineLatestWith, distinctUntilChanged, map, mergeWith, of, pairwise, startWith, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { PushPipe } from '@ngrx/component';
import { concatLatestFrom } from '@ngrx/effects';
import { ControlSchemeBindingType } from '@app/shared';
import { AttachedIoModel, ControlSchemeBinding } from '@app/store';

import { ControlSchemeFormBuilderService, ControlSchemeFormMapperService } from '../common/forms';
import { RenderBindingDetailsEditDirective } from './render-binding-details-edit.directive';
import { BindingControlSelectOperationModeComponent } from './control-select-operation-mode';
import { BindingControlSelectHubComponent } from './control-select-hub';
import { BindingControlSelectIoComponent } from './control-select-io';
import { ControlSchemeBindingForm } from '../common';
import { BINDING_EDIT_SELECTORS, HubWithConnectionState } from './binding-edit.selectors';

@Component({
    standalone: true,
    selector: 'app-binding-edit',
    templateUrl: './binding-edit.component.html',
    styleUrls: [ './binding-edit.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        BindingControlSelectOperationModeComponent,
        BindingControlSelectHubComponent,
        PushPipe,
        BindingControlSelectIoComponent,
        RenderBindingDetailsEditDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'appBindingEdit'
})
export class BindingEditComponent implements OnDestroy {
    public readonly canSave$: Observable<boolean>;

    public readonly hubsWithConnectionState$: Observable<HubWithConnectionState[]>;

    public readonly availableIos$: Observable<AttachedIoModel[]>;

    public readonly availableBindingTypes$: Observable<ControlSchemeBindingType[]>;

    protected readonly form: ControlSchemeBindingForm;

    private readonly formUpdateSubscription: Subscription;

    constructor(
        private readonly formBuilder: ControlSchemeFormBuilderService,
        private readonly formMapper: ControlSchemeFormMapperService,
        private readonly store: Store,
        private readonly cdRef: ChangeDetectorRef
    ) {
        this.form = this.formBuilder.createBindingForm();
        this.canSave$ = this.form.statusChanges.pipe(
            startWith(null),
            map(() => {
                const isOpModeDirty = this.form.controls.bindingType.dirty;
                const isOpModeValid = this.form.controls.bindingType.valid;
                const isBindingFormDirty = this.form.controls[this.form.controls.bindingType.value].dirty;
                const isBindingFormValid = this.form.controls[this.form.controls.bindingType.value].valid;
                return (isOpModeDirty || isBindingFormDirty) && isOpModeValid && isBindingFormValid;
            })
        );

        this.hubsWithConnectionState$ = this.store.select(BINDING_EDIT_SELECTORS.selectHubsWithConnectionState);

        const selectedHubId$ = this.form.controls.bindingType.valueChanges.pipe(
            startWith(this.form.controls.bindingType.value),
            switchMap((operationMode) => this.form.controls[operationMode].controls.hubId.valueChanges.pipe(
                startWith(this.form.controls[this.form.controls.bindingType.value].controls.hubId.value)
            )),
            distinctUntilChanged()
        );

        this.availableIos$ = selectedHubId$.pipe(
            switchMap((hubId) => hubId ? this.store.select(BINDING_EDIT_SELECTORS.selectHubControllableIos(hubId)) : of([]))
        );

        const selectedPortId$ = this.form.controls.bindingType.valueChanges.pipe(
            startWith(this.form.controls.bindingType.value),
            switchMap((operationMode) => this.form.controls[operationMode].controls.portId.valueChanges.pipe(
                startWith(this.form.controls[this.form.controls.bindingType.value].controls.portId.value)
            )),
            distinctUntilChanged()
        );

        this.availableBindingTypes$ = selectedHubId$.pipe(
            combineLatestWith(selectedPortId$),
            switchMap(([ hubId, portId ]) => this.store.select(BINDING_EDIT_SELECTORS.selectAvailableBindingTypes({ hubId, portId })))
        );

        this.formUpdateSubscription = new Subscription();
        this.formUpdateSubscription.add(
            this.form.controls[this.form.controls.bindingType.value].controls.hubId.valueChanges.pipe(
                concatLatestFrom(() => this.availableIos$),
            ).subscribe(([ hubId, availableIos ]) => {
                const currentPortId = this.form.controls[this.form.controls.bindingType.value].controls.portId.value;
                if (!availableIos.find((io) => io.hubId === hubId && io.portId === currentPortId)) {
                    const firstAvailableIo = availableIos[0];
                    if (firstAvailableIo) {
                        this.form.controls[this.form.controls.bindingType.value].controls.portId.setValue(firstAvailableIo.portId);
                    }
                }
            })
        );
        this.formUpdateSubscription.add(
            this.form.controls[this.form.controls.bindingType.value].controls.portId.valueChanges.pipe(
                mergeWith(this.form.controls[this.form.controls.bindingType.value].controls.hubId.valueChanges),
                concatLatestFrom(() => this.availableBindingTypes$),
            ).subscribe(([ , availableBindingTypes ]) => {
                const currentBindingType = this.form.controls.bindingType.value;
                if (!availableBindingTypes.includes(currentBindingType)) {
                    const firstAvailableBindingType = availableBindingTypes[0];
                    if (firstAvailableBindingType) {
                        this.form.controls.bindingType.setValue(firstAvailableBindingType);
                    }
                }
            })
        );
        this.formUpdateSubscription.add(
            this.form.controls.bindingType.valueChanges.pipe(
                pairwise(),
            ).subscribe(([ prevOpMode, nextOpMode ]) => {
                const prevOpModeHubId = this.form.controls[prevOpMode].controls.hubId.value;
                const prevOpModePortId = this.form.controls[prevOpMode].controls.portId.value;
                this.form.controls[nextOpMode].controls.hubId.setValue(prevOpModeHubId);
                this.form.controls[nextOpMode].controls.portId.setValue(prevOpModePortId);
            })
        );
    }

    @Input()
    public set binding(
        binding: Partial<ControlSchemeBinding> | undefined
    ) {
        if (binding && binding.operationMode !== undefined) {
            this.formBuilder.patchForm(this.form, binding);
            this.cdRef.detectChanges();
        }
    }

    @Input()
    public set bindingType(
        operationMode: ControlSchemeBindingType | undefined
    ) {
        if (operationMode !== undefined) {
            this.form.controls.bindingType.setValue(operationMode);
        }
    }

    public ngOnDestroy(): void {
        this.formUpdateSubscription.unsubscribe();
    }

    public getValue(): ControlSchemeBinding {
        return this.formMapper.mapToModel(this.form);
    }
}
