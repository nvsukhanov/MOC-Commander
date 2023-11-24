import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PushPipe } from '@ngrx/component';
import { Observable, Subscription, of, startWith, switchMap } from 'rxjs';
import { HideOnSmallScreenDirective, ValidationMessagesDirective } from '@app/shared-misc';
import { ControllerInputModel } from '@app/store';

import { WaitForControllerInputDialogComponent } from '../../wait-for-controller-input-dialog';
import { FullControllerInputNamePipe, FullControllerInputNameService } from '../../full-controller-input-name';
import { InputFormGroup, OptionalInputFormGroup } from '../../forms';

@Component({
    standalone: true,
    selector: 'app-binding-control-select-controller',
    templateUrl: './binding-control-select-controller.component.html',
    styleUrls: [ './binding-control-select-controller.component.scss' ],
    imports: [
        NgIf,
        MatDialogModule,
        MatButtonModule,
        TranslocoPipe,
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
        this.syntheticInputUpdateSubscription = (formGroup.valueChanges as Observable<unknown>).pipe(
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
