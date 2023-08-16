import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { MatInputModule } from '@angular/material/input';
import { ControlSchemeInput, ControllerInputModel } from '@app/store';
import { HubIoOperationMode, ToFormGroup } from '@app/shared';

import { IWaitingForInputDialogData, WaitForControllerInputDialogComponent } from '../wait-for-controller-input-dialog';
import { FullControllerInputNameComponent } from '../../full-controller-input-name';

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
        MatIconModule,
        TranslocoModule,
        MatInputModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectControllerComponent {
    @Input() public operationMode?: HubIoOperationMode;

    @Input() public inputFormGroup?: ToFormGroup<ControlSchemeInput>;

    @Input() public title = '';

    constructor(
        private readonly dialog: MatDialog,
        private readonly cd: ChangeDetectorRef
    ) {
    }

    public get controllerData(): ControlSchemeInput | undefined {
        return this.inputFormGroup?.getRawValue();
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
