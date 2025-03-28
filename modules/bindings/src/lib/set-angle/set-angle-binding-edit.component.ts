import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { PortModeName } from 'rxpoweredup';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, Subscription, mergeWith, of, startWith, switchMap, take } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { ControlSchemeBindingType, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-components';
import { HubMotorPositionFacadeService, SetAngleBindingInputAction } from '@app/store';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent, MotorPositionAdjustmentComponent } from '@app/shared-control-schemes';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import {
    BINDING_EDIT_COMMON_SELECTORS as BINDING_EDIT_SELECTORS,
    BindingControlOutputEndStateComponent,
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectControllerComponentData,
    BindingControlSpeedInputComponent,
    BindingEditSectionComponent,
    BindingEditSectionsContainerComponent
} from '../common';
import { SetAngleBindingForm } from './set-angle-binding-form';
import { SetAngleBindingL10nService } from './set-angle-binding-l10n.service';

@Component({
    standalone: true,
    selector: 'lib-cs-set-angle-binding-edit',
    templateUrl: './set-angle-binding-edit.component.html',
    styleUrl: './set-angle-binding-edit.component.scss',
    imports: [
        BindingControlOutputEndStateComponent,
        BindingControlSelectControllerComponent,
        BindingEditSectionComponent,
        TranslocoPipe,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatDividerModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        ToggleControlComponent,
        HideOnSmallScreenDirective,
        BindingEditSectionsContainerComponent,
        ValidationMessagesDirective,
        BindingControlSpeedInputComponent,
        BindingControlPowerInputComponent,
        MotorPositionAdjustmentComponent,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetAngleBindingEditComponent implements IBindingsDetailsEditComponent<SetAngleBindingForm>, OnDestroy {
    public readonly bindingType = ControlSchemeBindingType.SetAngle;

    private _form?: SetAngleBindingForm;

    private _canRequestPortValue$: Observable<boolean> = of(false);

    private _canSetPortValue$: Observable<boolean> = of(false);

    private _setAngleControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.SetAngle> | null = null;

    private portRequestSubscription?: Subscription;

    private setMotorPositionSubscription?: Subscription;

    constructor(
        private readonly cdRef: ChangeDetectorRef,
        private readonly store: Store,
        private readonly hubFacade: HubMotorPositionFacadeService,
        private readonly l10nService: SetAngleBindingL10nService
    ) {
    }

    public get form(): SetAngleBindingForm | undefined {
        return this._form;
    }

    public get canRequestPortValue$(): Observable<boolean> {
        return this._canRequestPortValue$;
    }

    public get canSetPortValue$(): Observable<boolean> {
        return this._canSetPortValue$;
    }

    public get setAngleControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.SetAngle> | null {
        return this._setAngleControlBindingComponentData;
    }

    public setForm(
        form: SetAngleBindingForm
    ): void {
        if (form !== this._form) {
            this._form = form;

            this._setAngleControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.SetAngle,
                inputFormGroup: form.controls.inputs.controls[SetAngleBindingInputAction.SetAngle],
                inputAction: SetAngleBindingInputAction.SetAngle,
                inputName$: this.l10nService.getBasicInputName(SetAngleBindingInputAction.SetAngle),
                supportedInputPipes: []
            };

            const hubAndPortChanges = form.controls.hubId.valueChanges.pipe(
                mergeWith(form.controls.portId.valueChanges),
                startWith(null),
            );

            this._canRequestPortValue$ = hubAndPortChanges.pipe(
                switchMap(() => {
                    if (form.controls.hubId.value === null || form.controls.portId.value === null) {
                        return of(false);
                    }
                    return this.store.select(BINDING_EDIT_SELECTORS.canRequestPortValue({
                        hubId: form.controls.hubId.value,
                        portId: form.controls.portId.value,
                        portModeName: PortModeName.position
                    }));
                })
            );

            this._canSetPortValue$ = hubAndPortChanges.pipe(
                mergeWith(form.controls.angle.valueChanges, form.controls.speed.valueChanges, form.controls.power.valueChanges),
                startWith(null),
                switchMap(() => {
                    if (form.controls.hubId.value === null ||
                        form.controls.portId.value === null ||
                        form.controls.angle.invalid ||
                        form.controls.speed.invalid ||
                        form.controls.power.invalid
                    ) {
                        return of(false);
                    }
                    return this.store.select(BINDING_EDIT_SELECTORS.canSetPortValue({
                        hubId: form.controls.hubId.value,
                        portId: form.controls.portId.value,
                        portModeName: PortModeName.position
                    }));
                })
            );
            this.cdRef.detectChanges();
        }
    }

    public onSetMotorPosition(): void {
        this.setMotorPositionSubscription?.unsubscribe();
        const form = this._form;
        if (!form) {
            return;
        }
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        const angle = form.controls.angle.value;
        if (hubId === null || portId === null || angle === null) {
            return;
        }
        this.setMotorPositionSubscription = this.hubFacade.setMotorPosition(hubId, portId, angle).subscribe();
    }

    public onMotorPositionRequest(): void {
        const form = this._form;
        if (!form) {
            return;
        }
        form.controls.angle.markAsTouched();
        this.portRequestSubscription?.unsubscribe();
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            return;
        }
        this.portRequestSubscription = this.hubFacade.getMotorAbsolutePosition(hubId, portId).pipe(
            take(1),
        ).subscribe((position: number) => {
            form.controls.angle.setValue(position);
            form.controls.angle.markAsDirty();
            form.updateValueAndValidity();
        });
    }

    public ngOnDestroy(): void {
        this.portRequestSubscription?.unsubscribe();
        this.setMotorPositionSubscription?.unsubscribe();
    }
}
