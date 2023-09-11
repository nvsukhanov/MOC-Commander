import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS, PortModeName } from 'rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { Observable, Subscription, mergeWith, of, startWith, switchMap, take } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { concatLatestFrom } from '@ngrx/effects';
import { ControlSchemeBindingType, HideOnSmallScreenDirective, SliderControlComponent, ToggleControlComponent, ValidationMessagesDirective } from '@app/shared';
import { ATTACHED_IO_PROPS_SELECTORS, ControlSchemeInputAction, HubFacadeService } from '@app/store';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import {
    BindingControlOutputEndStateComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectHubComponent,
    BindingControlSelectIoComponent
} from '../../controls';
import { BindingEditSectionComponent } from '../section';
import { BINDING_EDIT_SELECTORS } from '../binding-edit.selectors';
import { BindingEditSectionsContainerComponent } from '../sections-container';
import { SetAngleBindingForm } from '../../forms';
import { ControlSchemeInputActionToL10nKeyPipe } from '../../control-scheme-input-action-to-l10n-key.pipe';

@Component({
    standalone: true,
    selector: 'app-binding-set-angle-edit',
    templateUrl: './binding-set-angle-edit.component.html',
    styleUrls: [ './binding-set-angle-edit.component.scss' ],
    imports: [
        NgIf,
        SliderControlComponent,
        BindingControlOutputEndStateComponent,
        BindingControlSelectControllerComponent,
        BindingEditSectionComponent,
        TranslocoModule,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatDividerModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        ToggleControlComponent,
        HideOnSmallScreenDirective,
        PushPipe,
        ControlSchemeInputActionToL10nKeyPipe,
        BindingEditSectionsContainerComponent,
        ValidationMessagesDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSetAngleEditComponent implements IBindingsDetailsEditComponent<SetAngleBindingForm>, OnDestroy {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    public readonly bindingType = ControlSchemeBindingType.SetAngle;

    private _form?: SetAngleBindingForm;

    private _canRequestPortValue$: Observable<boolean> = of(false);

    private portRequestSubscription?: Subscription;

    constructor(
        private readonly cdRef: ChangeDetectorRef,
        private readonly store: Store,
        private readonly hubFacade: HubFacadeService
    ) {
    }

    public get form(): SetAngleBindingForm | undefined {
        return this._form;
    }

    public get canRequestPortValue$(): Observable<boolean> {
        return this._canRequestPortValue$;
    }

    public setForm(
        form: SetAngleBindingForm
    ): void {
        if (form !== this._form) {
            this._form = form;
            this._canRequestPortValue$ = form.controls.hubId.valueChanges.pipe(
                mergeWith(form.controls.portId.valueChanges),
                startWith(null),
                switchMap(() => {
                    if (!form.controls.hubId.value || !form.controls.portId.value) {
                        return of(false);
                    }
                    return this.store.select(BINDING_EDIT_SELECTORS.canRequestPortValue({
                        hubId: form.controls.hubId.value,
                        portId: form.controls.portId.value,
                        portModeName: PortModeName.position
                    }));
                })
            );
            this.cdRef.detectChanges();
        }
    }

    public onMotorPositionRequest(): void {
        const form = this._form;
        if (!form) {
            return;
        }
        this.portRequestSubscription?.unsubscribe();
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            return;
        }
        this.portRequestSubscription = this.hubFacade.getMotorAbsolutePosition(hubId, portId).pipe(
            take(1),
            concatLatestFrom(() => this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectMotorEncoderOffset({ hubId, portId })))
        ).subscribe(([ position, encoderOffset ]: [ number, number ]) => {
            form.controls.angle.setValue(position + encoderOffset);
            form.controls.angle.markAsDirty();
        });
    }

    public ngOnDestroy(): void {
        this.portRequestSubscription?.unsubscribe();
    }
}
