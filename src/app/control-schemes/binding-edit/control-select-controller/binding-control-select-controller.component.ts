import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { MatInputModule } from '@angular/material/input';
import { ControllerInputModel } from '@app/store';
import { ControllerInputType, HubIoOperationMode } from '@app/shared';

import { IWaitingForInputDialogData, WaitForControllerInputDialogComponent } from '../wait-for-controller-input-dialog';
import { FullControllerInputNameComponent } from '../../full-controller-input-name';

@Component({
    standalone: true,
    selector: 'app-controller-select[operationMode][controllerIdFormControl][inputIdFormControl][inputTypeControl][title]',
    templateUrl: './binding-control-select-controller.component.html',
    styleUrls: [ './binding-control-select-controller.component.scss' ],
    imports: [
        NgIf,
        MatDialogModule,
        FullControllerInputNameComponent,
        MatButtonModule,
        MatIconModule,
        TranslocoModule,
        MatInputModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectControllerComponent {
    @Input() public operationMode?: HubIoOperationMode;

    @Input() public controllerIdFormControl?: FormControl<string>;

    @Input() public inputIdFormControl?: FormControl<string>;

    @Input() public inputTypeControl?: FormControl<ControllerInputType>;

    @Input() public title = '';

    constructor(
        private readonly dialog: MatDialog,
        private readonly cd: ChangeDetectorRef
    ) {
    }

    public onBind(): void {
        if (this.operationMode === undefined) {
            return;
        }
        const dialog = this.dialog.open<WaitForControllerInputDialogComponent, IWaitingForInputDialogData, ControllerInputModel>(
            WaitForControllerInputDialogComponent,
            {
                disableClose: true,
                hasBackdrop: true,
                data: {
                    forOperationMode: this.operationMode,
                }
            }
        );
        dialog.afterClosed().subscribe((result) => {
            if (result && this.controllerIdFormControl && this.inputIdFormControl && this.inputTypeControl) {
                if (this.controllerIdFormControl.value !== result.controllerId) {
                    this.controllerIdFormControl.markAsTouched();
                    this.controllerIdFormControl.markAsDirty();
                    this.controllerIdFormControl.setValue(result.controllerId);
                }
                if (this.inputIdFormControl.value !== result.inputId) {
                    this.inputIdFormControl.markAsTouched();
                    this.inputIdFormControl.markAsDirty();
                    this.inputIdFormControl.setValue(result.inputId);
                }
                if (this.inputTypeControl.value !== result.inputType) {
                    this.inputTypeControl.markAsTouched();
                    this.inputTypeControl.markAsDirty();
                    this.inputTypeControl.setValue(result.inputType);
                }
                this.cd.detectChanges();
            }
        });
    }
}
