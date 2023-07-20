import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ControllerInputType, HubIoOperationMode } from '@app/shared';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ControllerInputModel } from '@app/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { MatInputModule } from '@angular/material/input';

import { FullControllerInputNameComponent } from '../../../../../shared';
import { IWaitingForInputDialogData, WaitForControllerInputDialogComponent } from './wait-for-controller-input-dialog';

@Component({
    standalone: true,
    selector: 'app-controller-select[operationMode][controllerIdFormControl][inputIdFormControl][inputTypeControl][title]',
    templateUrl: './controller-select.component.html',
    styleUrls: [ './controller-select.component.scss' ],
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
export class ControllerSelectComponent {
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
                this.controllerIdFormControl.setValue(result.controllerId);
                this.inputIdFormControl.setValue(result.inputId);
                this.inputTypeControl.setValue(result.inputType);
                this.cd.markForCheck();
            }
        });
    }
}
