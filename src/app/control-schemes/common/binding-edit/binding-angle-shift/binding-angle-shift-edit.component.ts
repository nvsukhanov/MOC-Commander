import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { PortModeName } from 'rxpoweredup';
import { Observable, Subscription, mergeWith, of, startWith, switchMap, take } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, HideOnSmallScreenDirective, ToggleControlComponent, ValidationMessagesDirective } from '@app/shared';
import { ControlSchemeInputAction, HubFacadeService } from '@app/store';

import {
    BindingControlOutputEndStateComponent,
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectHubComponent,
    BindingControlSelectIoComponent,
    BindingControlSelectLoopingModeComponent,
    BindingControlSpeedInputComponent
} from '../../controls';
import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingEditSectionComponent } from '../section';
import { BINDING_EDIT_SELECTORS } from '../binding-edit.selectors';
import { BindingEditSectionsContainerComponent } from '../sections-container';
import { ControlSchemeInputActionToL10nKeyPipe } from '../../control-scheme-input-action-to-l10n-key.pipe';
import { AngleShiftBindingForm, CommonFormControlsBuilderService } from '../../forms';

@Component({
    standalone: true,
    selector: 'app-binding-angle-shift-edit',
    templateUrl: './binding-angle-shift-edit.component.html',
    styleUrls: [ './binding-angle-shift-edit.component.scss' ],
    imports: [
        BindingControlSelectControllerComponent,
        MatButtonModule,
        MatIconModule,
        NgForOf,
        NgIf,
        ToggleControlComponent,
        TranslocoModule,
        BindingControlOutputEndStateComponent,
        PushPipe,
        ControlSchemeInputActionToL10nKeyPipe,
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
        BindingControlPowerInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingAngleShiftEditComponent implements IBindingsDetailsEditComponent<AngleShiftBindingForm>, OnDestroy {
    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    public readonly bindingType = ControlSchemeBindingType.AngleShift;

    private _form?: AngleShiftBindingForm;

    private _canRequestPortValue$: Observable<boolean> = of(false);

    private portRequestSubscription?: Subscription;

    constructor(
        private readonly commonFormControlBuilder: CommonFormControlsBuilderService,
        private readonly store: Store,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly hubFacade: HubFacadeService
    ) {
    }

    public get form(): AngleShiftBindingForm | undefined {
        return this._form;
    }

    public get canRequestPortValue$(): Observable<boolean> {
        return this._canRequestPortValue$;
    }

    public ngOnDestroy(): void {
        this.portRequestSubscription?.unsubscribe();
    }

    public setForm(
        form: AngleShiftBindingForm
    ): void {
        this._form = form;
        this.portRequestSubscription?.unsubscribe();
        this._canRequestPortValue$ = form.controls.hubId.valueChanges.pipe(
            mergeWith(form.controls.portId.valueChanges),
            startWith(null),
            switchMap(() => {
                if (form.controls.hubId.value === null || form.controls.portId.value === null) {
                    return of(false);
                }
                return this.store.select(BINDING_EDIT_SELECTORS.canRequestPortValue({
                    hubId: form.controls.hubId.value,
                    portId: form.controls.portId.value,
                    portModeName: PortModeName.absolutePosition
                }));
            })
        );
        this.changeDetectorRef.detectChanges();
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
        this.changeDetectorRef.detectChanges(); // somehow this is needed to update the view
    }

    public addPrevAngleLevel(): void {
        if (!this.form) {
            return;
        }
        this.form.controls.angles.push(
            this.commonFormControlBuilder.angleControl(0)
        );
        this.form.controls.angles.markAsDirty();
        this.changeDetectorRef.detectChanges(); // somehow this is needed to update the view
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
        this.changeDetectorRef.detectChanges(); // somehow this is needed to update the view
    }
}
