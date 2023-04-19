import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AttachedIO, HUB_ATTACHED_IO_SELECTORS, HUBS_SELECTORS } from '../../store';
import { MatSelectModule } from '@angular/material/select';
import { LetModule, PushModule } from '@ngrx/component';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map, Observable, of, shareReplay, startWith, Subscription, switchMap } from 'rxjs';
import { IOType } from '../../lego-hub';
import { ControlSchemeBindingInputControl } from '../control-scheme-binding-input/control-scheme-binding-input.component';
import { TranslocoModule } from '@ngneat/transloco';
import { IoTypeToL10nKeyPipe } from '../../mappings/io-type-to-l10n-key.pipe';
import { HubIoOperationMode } from '../../store/hub-io-operation-mode';
import { IoOperationTypeToL10nKeyPipe } from '../../mappings';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

export type ControlSchemeBindingOutputControl = FormGroup<{
    hubId: FormControl<string | null>,
    portId: FormControl<number | null>,
    operationMode: FormControl<HubIoOperationMode | null>,
}>

@Component({
    standalone: true,
    selector: 'app-control-scheme-binding-output',
    templateUrl: './control-scheme-binding-output.component.html',
    styleUrls: [ './control-scheme-binding-output.component.scss' ],
    imports: [
        MatSelectModule,
        LetModule,
        PushModule,
        NgForOf,
        ReactiveFormsModule,
        NgIf,
        TranslocoModule,
        IoTypeToL10nKeyPipe,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        IoOperationTypeToL10nKeyPipe,
        MatCardModule,
        MatListModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeBindingOutputComponent {
    public readonly hubsList$ = this.store.select(HUBS_SELECTORS.selectHubs);

    private _formGroup?: ControlSchemeBindingOutputControl;

    private _availableIOs$: Observable<AttachedIO[]> = of([]);

    private _ioType$: Observable<IOType | null> = of(null);

    private _availableIOOperationModes$: Observable<HubIoOperationMode[]> = of([]);

    private selectedPortChangeTrackingSubscription?: Subscription;

    constructor(
        private readonly store: Store
    ) {
    }

    @Input()
    public set formGroup(formGroup: FormGroup<{
        input: ControlSchemeBindingInputControl,
        output: ControlSchemeBindingOutputControl
    }>) {
        this.selectedPortChangeTrackingSubscription?.unsubscribe();
        const inputGroup = formGroup.controls.input;
        const outputGroup = formGroup.controls.output;
        this._formGroup = outputGroup;

        this._ioType$ = combineLatest([
            outputGroup.controls.hubId.valueChanges.pipe(startWith(outputGroup.controls.hubId.value)),
            outputGroup.controls.portId.valueChanges.pipe(startWith(outputGroup.controls.portId.value)),
        ]).pipe(
            switchMap(([ hubId, portId ]) => {
                if (hubId === null || portId === null) {
                    return of(null);
                }
                return this.store.select(HUB_ATTACHED_IO_SELECTORS.selectIOAtPort(hubId, portId));
            }),
            map((io) => io?.ioType ?? null)
        );

        this._availableIOs$ = combineLatest([
            outputGroup.controls.hubId.valueChanges.pipe(startWith(outputGroup.controls.hubId.value)),
            inputGroup.controls.gamepadInputMethod.valueChanges.pipe(startWith(inputGroup.controls.gamepadInputMethod.value))
        ]).pipe(
            switchMap(([ hubId, gamepadInputMethod ]) => {
                if (hubId === null) {
                    return of([]);
                }
                return this.store.select(HUB_ATTACHED_IO_SELECTORS.selectIOsControllableByMethod(hubId, gamepadInputMethod));
            }),
            map((ios) => ios.map((io) => io.ioConfig))
        );

        this._availableIOOperationModes$ = combineLatest([
            outputGroup.controls.hubId.valueChanges.pipe(startWith(outputGroup.controls.hubId.value)),
            outputGroup.controls.portId.valueChanges.pipe(startWith(outputGroup.controls.portId.value)),
            inputGroup.controls.gamepadInputMethod.valueChanges.pipe(startWith(inputGroup.controls.gamepadInputMethod.value))
        ]).pipe(
            switchMap(([ hubId, portId, gamepadInputMethod ]) => {
                if (hubId === null || portId === null) {
                    return of([]);
                }
                return this.store.select(HUB_ATTACHED_IO_SELECTORS.selectHubIOOperationModes(hubId, portId, gamepadInputMethod));
            }),
            shareReplay({ bufferSize: 1, refCount: true })
        );

        this.selectedPortChangeTrackingSubscription = outputGroup.controls.portId.valueChanges.subscribe(() => {
            outputGroup.controls.operationMode.setValue(null);
        });
    }

    public get formControl(): ControlSchemeBindingOutputControl | undefined {
        return this._formGroup;
    }

    public get ioType$(): Observable<IOType | null> {
        return this._ioType$;
    }

    public get availableIOs$(): Observable<AttachedIO[]> {
        return this._availableIOs$;
    }

    public get availableIOOperationModes$(): Observable<HubIoOperationMode[]> {
        return this._availableIOOperationModes$;
    }
}
