import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ControlSchemeInput, ControllerInputModel } from '@app/store';
import { ControllerInputType } from '@app/shared';

import { IWaitingForInputDialogData, WaitForControllerInputDialogComponent } from '../wait-for-controller-input-dialog';
import { FullControllerInputNameComponent } from '../../full-controller-input-name';
import { InputFormGroup, OptionalInputFormGroup } from '../types';

@Component({
    standalone: true,
    selector: 'app-controller-select',
    templateUrl: './binding-control-select-controller.component.html',
    styleUrls: [ './binding-control-select-controller.component.scss' ],
    imports: [
        NgIf,
        MatDialogModule,
        FullControllerInputNameComponent,
        MatButtonModule,
        TranslocoModule,
        MatInputModule,
        MatIconModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectControllerComponent {
    @Input() public inputFormGroup?: InputFormGroup | OptionalInputFormGroup;

    @Input() public title = '';

    @Input() public acceptableInputTypes: ControllerInputType[] = [];

    constructor(
        private readonly dialog: MatDialog,
        private readonly cd: ChangeDetectorRef
    ) {
    }

    public get controllerData(): ControlSchemeInput | undefined {
        return this.inputFormGroup?.getRawValue() as ControlSchemeInput | undefined; // TODO: fix hack
    }

    public onBind(): void {
        const dialog = this.dialog.open<WaitForControllerInputDialogComponent, IWaitingForInputDialogData, ControllerInputModel>(
            WaitForControllerInputDialogComponent,
            {
                disableClose: true,
                hasBackdrop: true,
                data: {
                    acceptableInputTypes: this.acceptableInputTypes,
                }
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
