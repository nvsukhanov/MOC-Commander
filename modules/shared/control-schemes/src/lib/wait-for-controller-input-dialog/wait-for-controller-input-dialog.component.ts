import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatestWith, filter, map, of, switchMap } from 'rxjs';
import { LetDirective } from '@ngrx/component';
import { CONTROLLER_INPUT_ACTIONS, CONTROLLER_INPUT_SELECTORS, ControllerInputModel, ControllerProfilesFacadeService } from '@app/store';

import { WAIT_FOR_CONTROLLER_INPUT_DIALOG_SELECTORS } from './wait-for-controller-input-dialog.selectors';

@Component({
    standalone: true,
    selector: 'lib-cs-wait-for-controller-input-dialog',
    templateUrl: './wait-for-controller-input-dialog.component.html',
    styleUrls: [ './wait-for-controller-input-dialog.component.scss' ],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule,
        TranslocoPipe,
        MatDialogModule,
        LetDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaitForControllerInputDialogComponent implements OnInit, OnDestroy {
    public readonly controllerNames$: Observable<string[]>;

    private readonly subscriptions = new Subscription();

    constructor(
        private readonly dialogRef: MatDialogRef<ControllerInputModel | null>,
        private readonly store: Store,
        private readonly controllerProfilesFacadeService: ControllerProfilesFacadeService
    ) {
        this.controllerNames$ = this.store.select(WAIT_FOR_CONTROLLER_INPUT_DIALOG_SELECTORS.selectConnectedControllers).pipe(
            map((controllerModels) => controllerModels.map((c) => this.controllerProfilesFacadeService.getByControllerModel(c).name$)),
            switchMap((names) => {
                if (names.length === 0) {
                    return of([]);
                } else if (names.length === 1) {
                    return names[0].pipe(
                        map((name) => [ name ])
                    );
                } else {
                    return names[0].pipe(
                        combineLatestWith(...names.slice(1)),
                    );
                }
            })
        );
    }

    public ngOnInit(): void {
        this.startInputCapture();
        this.subscriptions.add(
            this.store.select(CONTROLLER_INPUT_SELECTORS.selectFirst).pipe(
                filter((input): input is ControllerInputModel => !!input),
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
