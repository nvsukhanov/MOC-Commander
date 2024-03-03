import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PushPipe } from '@ngrx/component';
import { Observable, Subscription, of, startWith, switchMap } from 'rxjs';
import { ControlSchemeBindingType, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective } from '@app/shared-ui';
import { ControlSchemeBindingInputs, ControlSchemeInputAction, ControllerInputModel, InputDirection } from '@app/store';
import { FullControllerInputNamePipe, WaitForControllerInputDialogComponent } from '@app/shared-control-schemes';
import { ControllerInputType } from '@app/controller-profiles';

import { InputFormGroup, OptionalInputFormGroup } from '../../input-form-group';
import { BINDING_CONTROLLER_NAME_RESOLVER, IBindingControllerNameResolver } from '../../../i-binding-controller-name-resolver';
import { ControlSchemeInputActionToL10nKeyPipe } from '../../control-scheme-input-action-to-l10n-key.pipe';

export type BindingControlSelectControllerComponentData<T extends ControlSchemeBindingType> = {
    bindingType: T;
    inputFormGroup?: InputFormGroup | OptionalInputFormGroup;
    inputAction?: keyof ControlSchemeBindingInputs<T>;
};

@Component({
    standalone: true,
    selector: 'lib-cs-binding-control-select-controller',
    templateUrl: './binding-control-select-controller.component.html',
    styleUrls: [ './binding-control-select-controller.component.scss' ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        TranslocoPipe,
        MatInputModule,
        MatIconModule,
        HideOnSmallScreenDirective,
        FullControllerInputNamePipe,
        PushPipe,
        ValidationMessagesDirective,
        ReactiveFormsModule,
        ControlSchemeInputActionToL10nKeyPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectControllerComponent<T extends ControlSchemeBindingType> implements OnDestroy, OnChanges {
    @Input() public data?: BindingControlSelectControllerComponentData<T>;

    private _syntheticInputControl?: FormControl;

    private syntheticInputUpdateSubscription?: Subscription;

    constructor(
        private readonly dialog: MatDialog,
        private readonly cd: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
        @Inject(BINDING_CONTROLLER_NAME_RESOLVER) private readonly controllerInputNameResolver: IBindingControllerNameResolver<T>,
    ) {
    }

    public get inputAction(): ControlSchemeInputAction | undefined {
        return this.data?.inputAction as ControlSchemeInputAction | undefined;
    }

    public get syntheticInputControl(): FormControl | undefined {
        return this._syntheticInputControl;
    }

    public get isControllerAssigned(): boolean {
        return !!this.data?.inputFormGroup?.controls.controllerId.value;
    }

    public ngOnChanges(): void {
        if (!this.data?.inputFormGroup || this.data?.inputAction === undefined) {
            this._syntheticInputControl = undefined;
            this.syntheticInputUpdateSubscription?.unsubscribe();
            return;
        }

        // here goes dirty hack: we create a synthetic control to display the full controller input name and display validation errors
        const isRequired = this.data.inputFormGroup.controls.controllerId.hasValidator(Validators.required);
        this._syntheticInputControl = this.formBuilder.control<string>('', {
            validators: isRequired ? [ Validators.required ] : [],
        });
        this.syntheticInputUpdateSubscription = (this.data.inputFormGroup.valueChanges as Observable<unknown>).pipe(
            startWith(null),
            switchMap(() => {
                const formData = this.data?.inputFormGroup?.getRawValue();
                if (!formData || !formData.inputId || this.data?.inputAction === undefined) {
                    return of('');
                }
                return this.controllerInputNameResolver.resolveControllerNameFor(
                    this.data?.inputAction,
                    {
                        inputId: formData.inputId,
                        buttonId: formData.buttonId ?? undefined,
                        portId: formData.portId ?? undefined,
                        inputType: formData.inputType,
                        controllerId: formData.controllerId ?? '',
                        inputDirection: formData.inputDirection ?? InputDirection.Positive,
                    }
                )?.name$ ?? of('');
            }),
        ).subscribe((controllerName) => {
            if (!this._syntheticInputControl) {
                return;
            }
            this._syntheticInputControl.setValue(controllerName);
        });
    }

    public ngOnDestroy(): void {
        this.syntheticInputUpdateSubscription?.unsubscribe();
    }

    public onUnbind(): void {
        if (!this.data?.inputFormGroup) {
            return;
        }
        this.data.inputFormGroup.reset();
        this.data.inputFormGroup.markAsDirty();
        this.data.inputFormGroup.markAsTouched();
        this.data.inputFormGroup.updateValueAndValidity();
        this.cd.detectChanges();
    }

    public onBind(): void {
        const dialog = this.dialog.open<WaitForControllerInputDialogComponent, undefined, ControllerInputModel>(
            WaitForControllerInputDialogComponent,
            {
                disableClose: true,
                hasBackdrop: true
            }
        );
        dialog.afterClosed().subscribe((result) => {
            if (!result || !this.data?.inputFormGroup) {
                return;
            }
            this.updateFormWithControllerInput(this.data.inputFormGroup, result);
            this.cd.detectChanges();
        });
    }

    private updateFormWithControllerInput(
        formGroup: InputFormGroup | OptionalInputFormGroup,
        result: ControllerInputModel
    ): void {
        formGroup.controls.controllerId.setValue(result.controllerId);
        formGroup.controls.inputId.setValue(result.inputId);
        formGroup.controls.inputType.setValue(result.inputType);
        formGroup.controls.inputDirection.setValue(result.value < 0 ? InputDirection.Negative : InputDirection.Positive);
        if (result.inputType === ControllerInputType.ButtonGroup) {
            formGroup.controls.buttonId.setValue(result.buttonId ?? null);
            formGroup.controls.portId.setValue(result.portId ?? null);
        }
        formGroup.markAsDirty();
        formGroup.markAsTouched();
        formGroup.updateValueAndValidity();
    }
}
