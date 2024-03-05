import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@ngneat/transloco';
import { PortModeName } from 'rxpoweredup';
import { Observable, Subscription, mergeWith, of, startWith, switchMap, take } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { ControlSchemeBindingType, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-ui';
import { GearboxControlInputAction, HubMotorPositionFacadeService } from '@app/store';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent, MotorPositionAdjustmentComponent } from '@app/shared-control-schemes';

import {
    BINDING_EDIT_COMMON_SELECTORS,
    BindingControlOutputEndStateComponent,
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectControllerComponentData,
    BindingControlSelectLoopingModeComponent,
    BindingControlSpeedInputComponent,
    BindingEditSectionComponent,
    BindingEditSectionsContainerComponent,
    CommonBindingsFormControlsBuilderService
} from '../common';
import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { GearboxControlBindingForm } from './gearbox-binding-form';
import { CanSetGearboxPortPositionPipe } from './can-set-gearbox-port-position.pipe';
import { GearboxL10nService } from './gearbox-l10n.service';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-gearbox-control-edit',
    templateUrl: './binding-gearbox-control-edit.component.html',
    styleUrls: [ './binding-gearbox-control-edit.component.scss' ],
    imports: [
        BindingControlSelectControllerComponent,
        MatButtonModule,
        MatIconModule,
        ToggleControlComponent,
        TranslocoPipe,
        BindingControlOutputEndStateComponent,
        BindingControlSelectLoopingModeComponent,
        BindingEditSectionComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatDividerModule,
        HideOnSmallScreenDirective,
        MatInputModule,
        ReactiveFormsModule,
        BindingEditSectionsContainerComponent,
        ValidationMessagesDirective,
        BindingControlSpeedInputComponent,
        BindingControlPowerInputComponent,
        CanSetGearboxPortPositionPipe,
        MotorPositionAdjustmentComponent,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingGearboxControlEditComponent implements IBindingsDetailsEditComponent<GearboxControlBindingForm>, OnDestroy {
    public readonly bindingType = ControlSchemeBindingType.GearboxControl;

    private _form?: GearboxControlBindingForm;

    private _canRequestPortValue$: Observable<boolean> = of(false);

    private _nextLevelControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null = null;

    private _prevLevelControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null = null;

    private _resetControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null = null;

    private portRequestSubscription?: Subscription;

    private setMotorPositionSubscription?: Subscription;

    constructor(
        private readonly commonFormControlBuilder: CommonBindingsFormControlsBuilderService,
        private readonly store: Store,
        private readonly hubFacade: HubMotorPositionFacadeService,
        private readonly l10nService: GearboxL10nService
    ) {
    }

    public get form(): GearboxControlBindingForm | undefined {
        return this._form;
    }

    public get canRequestPortValue$(): Observable<boolean> {
        return this._canRequestPortValue$;
    }

    public get nextLevelControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null {
        return this._nextLevelControlBindingComponentData;
    }

    public get prevLevelControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null {
        return this._prevLevelControlBindingComponentData;
    }

    public get resetControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null {
        return this._resetControlBindingComponentData;
    }

    public ngOnDestroy(): void {
        this.portRequestSubscription?.unsubscribe();
        this.setMotorPositionSubscription?.unsubscribe();
    }

    public setForm(
        form: GearboxControlBindingForm
    ): void {
        this._form = form;
        this._nextLevelControlBindingComponentData = {
            bindingType: ControlSchemeBindingType.GearboxControl,
            inputFormGroup: form.controls.inputs.controls[GearboxControlInputAction.NextGear],
            inputAction: GearboxControlInputAction.NextGear,
            inputName$: this.l10nService.getBindingInputName(GearboxControlInputAction.NextGear)
        };

        this._prevLevelControlBindingComponentData = {
            bindingType: ControlSchemeBindingType.GearboxControl,
            inputFormGroup: form.controls.inputs.controls[GearboxControlInputAction.PrevGear],
            inputAction: GearboxControlInputAction.PrevGear,
            inputName$: this.l10nService.getBindingInputName(GearboxControlInputAction.PrevGear)
        };

        this._resetControlBindingComponentData = {
            bindingType: ControlSchemeBindingType.GearboxControl,
            inputFormGroup: form.controls.inputs.controls[GearboxControlInputAction.Reset],
            inputAction: GearboxControlInputAction.Reset,
            inputName$: this.l10nService.getBindingInputName(GearboxControlInputAction.Reset)
        };

        this.portRequestSubscription?.unsubscribe();
        this._canRequestPortValue$ = form.controls.hubId.valueChanges.pipe(
            mergeWith(form.controls.portId.valueChanges),
            startWith(null),
            switchMap(() => {
                if (form.controls.hubId.value === null || form.controls.portId.value === null) {
                    return of(false);
                }
                return this.store.select(BINDING_EDIT_COMMON_SELECTORS.canRequestPortValue({
                    hubId: form.controls.hubId.value,
                    portId: form.controls.portId.value,
                    portModeName: PortModeName.absolutePosition
                }));
            })
        );
    }

    public onSetMotorPosition(
        levelIndex: number
    ): void {
        this.setMotorPositionSubscription?.unsubscribe();
        const form = this._form;
        if (!form) {
            return;
        }
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        const angle = form.controls.angles.controls[levelIndex].value;
        if (hubId === null || portId === null || angle === null) {
            return;
        }
        this.setMotorPositionSubscription = this.hubFacade.setMotorPosition(hubId, portId, angle).subscribe();
    }

    public onPortAbsolutePositionRequest(
        levelIndex: number
    ): void {
        this.portRequestSubscription?.unsubscribe();
        if (!this.form || this.form.controls.hubId.value === null || this.form.controls.portId.value === null) {
            return;
        }
        const control = this.form.controls.angles.at(levelIndex);
        if (!control) {
            return;
        }
        control.markAsTouched();
        this.portRequestSubscription = this.hubFacade.getMotorAbsolutePosition(
            this.form.controls.hubId.value,
            this.form.controls.portId.value
        ).pipe(
            take(1)
        ).subscribe((position) => {
            if (control.value !== position) {
                control.setValue(position);
                control.markAsDirty();
                control.updateValueAndValidity();
            }
        });
    }

    public addNextAngleLevel(): void {
        if (!this.form) {
            return;
        }
        this.form.controls.angles.insert(
            0,
            this.commonFormControlBuilder.angleControl(0)
        );
        this.form.controls.initialLevelIndex.setValue(
            this.form.controls.initialLevelIndex.value + 1
        );
        this.form.controls.angles.markAsDirty();
        this.form.controls.initialLevelIndex.markAsDirty();
        this.form.updateValueAndValidity();
    }

    public addPrevAngleLevel(): void {
        if (!this.form) {
            return;
        }
        this.form.controls.angles.push(
            this.commonFormControlBuilder.angleControl(0)
        );
        this.form.controls.angles.markAsDirty();
        this.form.updateValueAndValidity();
    }

    public removeAngleLevel(
        index: number
    ): void {
        if (!this.form) {
            return;
        }
        this.form.controls.angles.removeAt(index);
        if (index < this.form.controls.initialLevelIndex.value) {
            this.form.controls.initialLevelIndex.setValue(
                this.form.controls.initialLevelIndex.value - 1
            );
        }
        this.form.controls.angles.markAsDirty();
        this.form.controls.initialLevelIndex.markAsDirty();
        this.form.updateValueAndValidity();
    }
}
