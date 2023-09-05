import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PushPipe } from '@ngrx/component';
import { Observable, Subscription, of, startWith, switchMap } from 'rxjs';
import { ControlSchemeInput, ControllerInputModel } from '@app/store';
import { HideOnSmallScreenDirective, ValidationMessagesDirective } from '@app/shared';

import { WaitForControllerInputDialogComponent } from '../wait-for-controller-input-dialog';
import { FullControllerInputNamePipe, FullControllerInputNameService, InputFormGroup, OptionalInputFormGroup } from '../../common';

@Component({
    standalone: true,
    selector: 'app-controller-select',
    templateUrl: './binding-control-select-controller.component.html',
    styleUrls: [ './binding-control-select-controller.component.scss' ],
    imports: [
        NgIf,
        MatDialogModule,
        MatButtonModule,
        TranslocoModule,
        MatInputModule,
        MatIconModule,
        HideOnSmallScreenDirective,
        FullControllerInputNamePipe,
        PushPipe,
        ValidationMessagesDirective,
        ReactiveFormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectControllerComponent implements OnDestroy {
    @Input() public title = '';

    private _syntheticInputControl?: FormControl;

    private _inputFormGroup?: InputFormGroup | OptionalInputFormGroup;

    private syntheticInputUpdateSubscription?: Subscription;

    constructor(
        private readonly dialog: MatDialog,
        private readonly cd: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
        private readonly fullControllerInputNameService: FullControllerInputNameService
    ) {
    }

    @Input()
    public set inputFormGroup(
        formGroup: InputFormGroup | OptionalInputFormGroup | undefined
    ) {
        this._inputFormGroup = formGroup;
        if (!formGroup) {
            this._syntheticInputControl = undefined;
            this.syntheticInputUpdateSubscription?.unsubscribe();
            return;
        }

        // here goes dirty hack: we create a synthetic control to display the full controller input name and display validation errors
        const isRequired = formGroup.controls.controllerId.hasValidator(Validators.required);
        this._syntheticInputControl = this.formBuilder.control<string>('', {
            validators: isRequired ? [ Validators.required ] : [],
        });
        this.syntheticInputUpdateSubscription = (formGroup.controls.controllerId.valueChanges as Observable<string | null>).pipe(
            startWith(null),
            switchMap(() => {
                const data = this.inputFormGroup?.getRawValue();
                if (!data || !data.inputId) {
                    return of('');
                }
                return this.fullControllerInputNameService.getFullControllerInputNameData({
                    inputId: data.inputId,
                    buttonId: data.buttonId ?? undefined,
                    portId: data.portId ?? undefined,
                    inputType: data.inputType,
                    controllerId: data.controllerId ?? ''
                }).name$;
            }),
        ).subscribe((controllerName) => {
            if (!this._syntheticInputControl) {
                return;
            }
            this._syntheticInputControl.setValue(controllerName);
        });
    }

    public get inputFormGroup(): InputFormGroup | OptionalInputFormGroup | undefined {
        return this._inputFormGroup;
    }

    public get syntheticInputControl(): FormControl | undefined {
        return this._syntheticInputControl;
    }

    public get isRequired(): boolean {
        return this.inputFormGroup?.controls.controllerId.hasValidator(Validators.required) ?? false;
    }

    public get controllerData(): ControlSchemeInput | undefined {
        return this.inputFormGroup?.getRawValue() as ControlSchemeInput | undefined;
    }

    public get isControllerAssigned(): boolean {
        return !!this.inputFormGroup?.controls.controllerId.value;
    }

    public ngOnDestroy(): void {
        this.syntheticInputUpdateSubscription?.unsubscribe();
    }

    public onUnbind(): void {
        if (!this.inputFormGroup) {
            return;
        }
        this.inputFormGroup.reset();
        this.inputFormGroup.markAsDirty();
        this.inputFormGroup.markAsTouched();
        this.inputFormGroup.updateValueAndValidity();
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
            if (!result || !this.inputFormGroup) {
                return;
            }
            this.inputFormGroup.patchValue(result);
            this.inputFormGroup.markAsDirty();
            this.inputFormGroup.markAsTouched();
            this.inputFormGroup.updateValueAndValidity();
            this.cd.detectChanges();
        });
    }
}
