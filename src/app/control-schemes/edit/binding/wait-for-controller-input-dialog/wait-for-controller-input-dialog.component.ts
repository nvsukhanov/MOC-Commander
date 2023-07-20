import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@ngneat/transloco';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { CONTROLLER_INPUT_ACTIONS, CONTROLLER_INPUT_SELECTORS, ControllerInputModel } from '@app/store';
import { HubIoOperationMode } from '@app/shared';
import { DIALOG_DATA } from '@angular/cdk/dialog';

import { getIoOperationModesForControllerInputType } from './get-io-operation-modes-for-controller-input-type';

export interface IWaitingForInputDialogData {
    readonly forOperationMode: HubIoOperationMode;
}

@Component({
    standalone: true,
    selector: 'app-waiting-for-input-dialog',
    templateUrl: './wait-for-controller-input-dialog.component.html',
    styleUrls: [ './wait-for-controller-input-dialog.component.scss' ],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule,
        TranslocoModule,
        MatDialogModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaitForControllerInputDialogComponent implements OnInit, OnDestroy {
    private readonly subscriptions = new Subscription();

    constructor(
        private readonly dialogRef: MatDialogRef<ControllerInputModel | null>,
        @Inject(DIALOG_DATA) private data: IWaitingForInputDialogData,
        private readonly store: Store
    ) {
    }

    public ngOnInit(): void {
        this.startInputCapture();
        this.subscriptions.add(
            this.store.select(CONTROLLER_INPUT_SELECTORS.selectFirst).pipe(
                filter((input): input is ControllerInputModel => !!input),
                filter(({ inputType }) => {
                    return getIoOperationModesForControllerInputType(inputType).includes(this.data.forOperationMode);
                }),
            ).subscribe((input) => {
                this.dialogRef.close(input);
            })
        );
    }

    public ngOnDestroy(): void {
        this.stopInputCapture();
        this.subscriptions.unsubscribe();
    }

    public onCancel(): void {
        this.dialogRef.close(null);
    }

    private startInputCapture(): void {
        this.store.dispatch(CONTROLLER_INPUT_ACTIONS.requestInputCapture());
    }

    private stopInputCapture(): void {
        this.store.dispatch(CONTROLLER_INPUT_ACTIONS.releaseInputCapture());
    }
}
