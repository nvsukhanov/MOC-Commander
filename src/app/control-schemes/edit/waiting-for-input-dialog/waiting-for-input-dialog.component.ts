import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@ngneat/transloco';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription, filter, map, of, take } from 'rxjs';
import { concatLatestFrom } from '@ngrx/effects';

import { CONTROLLER_INPUT_ACTIONS, CONTROLLER_INPUT_SELECTORS, CONTROL_SCHEME_ACTIONS, ControllerInputModel } from '../../../store';
import { CONTROL_SCHEME_EDIT_SELECTORS } from '../control-scheme-edit.selectors';

@Component({
    standalone: true,
    selector: 'app-waiting-for-input-dialog',
    templateUrl: './waiting-for-input-dialog.component.html',
    styleUrls: [ './waiting-for-input-dialog.component.scss' ],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule,
        TranslocoModule,
        MatDialogModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaitingForInputDialogComponent implements OnInit, OnDestroy {
    private readonly subscriptions = new Subscription();

    constructor(
        private readonly dialog: MatDialogRef<WaitingForInputDialogComponent>,
        private readonly store: Store
    ) {
    }

    public ngOnInit(): void {
        this.startInputCapture();
        this.subscriptions.add(
            this.store.select(CONTROLLER_INPUT_SELECTORS.selectFirst).pipe(
                filter((input): input is ControllerInputModel => !!input),
                concatLatestFrom((input?: ControllerInputModel) => {
                    return input
                           ? this.store.select(CONTROL_SCHEME_EDIT_SELECTORS.selectFirstIoControllableByInputType(input.inputType))
                           : of(null);
                }),
                map(([ input, io ]) => {
                    if (!input) {
                        return null;
                    }
                    if (!io) {
                        this.store.dispatch(CONTROL_SCHEME_ACTIONS.noIOForInputFound());
                        return null;
                    }
                    return { input, ioWithModes: io };
                }),
                take(1)
            ).subscribe((input) => {
                this.dialog.close(input);
            })
        );
    }

    public ngOnDestroy(): void {
        this.stopInputCapture();
        this.subscriptions.unsubscribe();
    }

    public onCancel(): void {
        this.dialog.close();
    }

    private startInputCapture(): void {
        this.store.dispatch(CONTROLLER_INPUT_ACTIONS.requestInputCapture());
    }

    private stopInputCapture(): void {
        this.store.dispatch(CONTROLLER_INPUT_ACTIONS.releaseInputCapture());
    }
}
