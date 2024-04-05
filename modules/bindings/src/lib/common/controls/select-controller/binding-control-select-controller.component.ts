import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription, filter, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatBadge } from '@angular/material/badge';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ControlSchemeBindingType, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective } from '@app/shared-components';
import {
    CONTROLLER_SETTINGS_SELECTORS,
    ControlSchemeBindingInputs,
    ControllerInputModel,
    ControllerSettingsModel,
    InputDirection,
    InputPipeType,
    transformControllerInputValue
} from '@app/store';
import {
    BINDING_CONTROLLER_INPUT_NAME_RESOLVER,
    BindingControllerInputNamePipe,
    IBindingControllerInputNameResolver,
    WaitForControllerInputDialogComponent
} from '@app/shared-control-schemes';
import { ControllerInputType } from '@app/controller-profiles';

import { InputFormGroup, OptionalInputFormGroup } from '../../input-form-group';
import { IInputSettingsDialogData, IInputSettingsDialogResult, InputSettingsDialogComponent } from './input-settings-dialog';
import { CommonBindingsFormControlsBuilderService } from '../../common-bindings-form-controls-builder.service';
import { filterInputPipeTypesByInputType } from '../../filter-input-pipe-types-by-input-type';

export type BindingControlSelectControllerComponentData<T extends ControlSchemeBindingType> = {
    bindingType: T;
    inputFormGroup?: InputFormGroup | OptionalInputFormGroup;
    inputAction?: keyof ControlSchemeBindingInputs<T>;
    inputName$: Observable<string>;
    supportedInputPipes: ReadonlyArray<InputPipeType>;
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
        BindingControllerInputNamePipe,
        ValidationMessagesDirective,
        ReactiveFormsModule,
        AsyncPipe,
        MatBadge
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectControllerComponent<T extends ControlSchemeBindingType> implements OnDestroy, OnChanges {
    @Input() public data: BindingControlSelectControllerComponentData<T> | null = null;

    private _syntheticInputControl?: FormControl;

    private syntheticInputUpdateSubscription?: Subscription;

    constructor(
        private readonly dialog: MatDialog,
        private readonly cd: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
        @Inject(BINDING_CONTROLLER_INPUT_NAME_RESOLVER) private readonly controllerInputNameResolver: IBindingControllerInputNameResolver,
        private readonly commonFormBuilder: CommonBindingsFormControlsBuilderService,
        private readonly store: Store
    ) {
    }

    public get syntheticInputControl(): FormControl | undefined {
        return this._syntheticInputControl;
    }

    public get isControllerAssigned(): boolean {
        return !!this.data?.inputFormGroup?.controls.controllerId.value;
    }

    public get supportedInputPipes(): InputPipeType[] {
        const inputType = this.data?.inputFormGroup?.controls.inputType.value;
        if (inputType === undefined) {
            return [];
        }
        return filterInputPipeTypesByInputType(inputType, this.data?.supportedInputPipes ?? []);
    }

    public get areSettingsVisible(): boolean {
        return this.isControllerAssigned && !!this.supportedInputPipes.length;
    }

    public get arePipesConfigured(): boolean {
        const currentPipes = this.data?.inputFormGroup?.controls.inputPipes.value;
        if (!currentPipes) {
            return false;
        }
        return currentPipes.length > 0;
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
            validators: isRequired ? [ Validators.required ] : []
        });
        this.syntheticInputUpdateSubscription = (this.data.inputFormGroup.valueChanges as Observable<unknown>).pipe(
            startWith(null),
            switchMap(() => {
                const formData = this.data?.inputFormGroup?.getRawValue();
                if (!formData || !formData.inputId || this.data?.inputAction === undefined) {
                    return of('');
                }
                return this.controllerInputNameResolver.getControllerInputName(
                    this.data.bindingType,
                    this.data?.inputAction,
                    {
                        inputId: formData.inputId,
                        buttonId: formData.buttonId ?? undefined,
                        portId: formData.portId ?? undefined,
                        inputType: formData.inputType,
                        controllerId: formData.controllerId ?? '',
                        inputDirection: formData.inputDirection ?? InputDirection.Positive,
                        inputPipes: formData.inputPipes ?? []
                    }
                );
            })
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

    public onShowSettings(): void {
        this.dialog.open<InputSettingsDialogComponent, IInputSettingsDialogData, IInputSettingsDialogResult>(
            InputSettingsDialogComponent,
            {
                data: {
                    supportedInputPipes: this.supportedInputPipes,
                    currentInputPipeConfigs: this.data?.inputFormGroup?.controls.inputPipes.value ?? []
                }
            }
        ).afterClosed().subscribe((r) => {
            if (r) {
                const control = this.data?.inputFormGroup?.controls.inputPipes;
                if (control) {
                    this.commonFormBuilder.patchInputPipes(control, r.inputPipes);
                    control.markAsDirty();
                    control.updateValueAndValidity();
                }
            }
        });
    }

    public onBind(): void {
        const dialog = this.dialog.open<WaitForControllerInputDialogComponent, undefined, ControllerInputModel>(
            WaitForControllerInputDialogComponent,
            {
                disableClose: true,
                hasBackdrop: true
            }
        );
        dialog.afterClosed().pipe(
            filter((r): r is ControllerInputModel => !!r),
            concatLatestFrom((input) => this.store.select(CONTROLLER_SETTINGS_SELECTORS.selectByControllerId(input.controllerId)))
        ).subscribe(([input, settings]) => {
            if (!input || !settings || !this.data?.inputFormGroup) {
                return;
            }
            this.updateFormWithControllerInput(this.data.inputFormGroup, input, settings);
            this.cd.detectChanges();
        });
    }

    private updateFormWithControllerInput(
        formGroup: InputFormGroup | OptionalInputFormGroup,
        input: ControllerInputModel,
        settings: ControllerSettingsModel
    ): void {
        const value = transformControllerInputValue(input, settings);
        formGroup.controls.controllerId.setValue(input.controllerId);
        formGroup.controls.inputId.setValue(input.inputId);
        formGroup.controls.inputType.setValue(input.inputType);
        formGroup.controls.inputDirection.setValue(value < 0 ? InputDirection.Negative : InputDirection.Positive);
        if (input.inputType === ControllerInputType.ButtonGroup) {
            formGroup.controls.buttonId.setValue(input.buttonId ?? null);
            formGroup.controls.portId.setValue(input.portId ?? null);
        }
        formGroup.markAsDirty();
        formGroup.markAsTouched();
        formGroup.updateValueAndValidity();
    }
}
