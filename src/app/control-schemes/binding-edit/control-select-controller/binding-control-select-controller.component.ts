import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Validators } from '@angular/forms';
import { PushPipe } from '@ngrx/component';
import { ControlSchemeInput, ControllerInputModel } from '@app/store';
import { HideOnSmallScreenDirective } from '@app/shared';

import { WaitForControllerInputDialogComponent } from '../wait-for-controller-input-dialog';
import { FullControllerInputNamePipe, InputFormGroup, OptionalInputFormGroup } from '../../common';

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
        PushPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectControllerComponent {
    @Input() public title = '';

    private _inputFormGroup?: InputFormGroup | OptionalInputFormGroup;

    constructor(
        private readonly dialog: MatDialog,
        private readonly cd: ChangeDetectorRef
    ) {
    }

    @Input()
    public set inputFormGroup(v: InputFormGroup | OptionalInputFormGroup | undefined) {
        this._inputFormGroup = v;
    }

    public get inputFormGroup(): InputFormGroup | OptionalInputFormGroup | undefined {
        return this._inputFormGroup;
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
