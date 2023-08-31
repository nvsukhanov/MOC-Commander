import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, combineLatestWith, finalize, map, of, take } from 'rxjs';
import { concatLatestFrom } from '@ngrx/effects';
import { PortModeName } from 'rxpoweredup';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { PushPipe } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';
import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS, ATTACHED_IO_PROPS_SELECTORS, HubFacadeService } from '@app/store';

@Component({
    standalone: true,
    selector: 'app-binding-control-read-motor-position[controlTitle][portId][hubId][portModeName]',
    templateUrl: './binding-control-read-motor-position.component.html',
    styleUrls: [ './binding-control-read-motor-position.component.scss' ],
    imports: [
        MatIconModule,
        PushPipe,
        MatButtonModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlReadMotorPositionComponent implements OnDestroy {
    @Input() public portId?: number;

    @Input() public hubId?: string;

    @Input() public controlTitle?: string;

    @Input() public portModeName?: PortModeName.position | PortModeName.absolutePosition;

    @Output() public readonly aposChange = new EventEmitter<number>();

    @Output() public readonly isQueryingPortChange = new EventEmitter<boolean>();

    private _disabled$ = new BehaviorSubject<boolean>(false);

    private isQueryingPort = new BehaviorSubject<boolean>(false);

    private readAposSubscription?: Subscription;

    constructor(
        private readonly store: Store,
        private readonly hubFacadeService: HubFacadeService
    ) {
    }

    @Input()
    public set disabled(value: boolean) {
        this._disabled$.next(value);
    }

    public get canReadAposFromMotor$(): Observable<boolean> {
        if (this.hubId === undefined || this.portId === undefined || this._disabled$.value) {
            return of(false);
        }
        const hubId = this.hubId;
        const portId = this.portId;
        return this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectById({ hubId, portId })).pipe(
            concatLatestFrom(() => this.store.select(ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortHastInputModeForPortModeName({
                hubId,
                portId,
                portModeName: PortModeName.absolutePosition
            }))),
            combineLatestWith(this.isQueryingPort, this._disabled$),
            map(([ [ props, hasAbsolutePositionMode ], isQueryingPort, disabled ]) => {
                return !isQueryingPort && hasAbsolutePositionMode && !!props && !disabled;
            }),
        );
    }

    public ngOnDestroy(): void {
        this.readAposSubscription?.unsubscribe();
        this.markPortAsFree();
    }

    public readAposFromMotor(): void {
        if (this.hubId === undefined || this.portId === undefined || this.isQueryingPort.value) {
            return;
        }

        this.readAposSubscription?.unsubscribe();
        this.markPortAsBusy();
        this.readAposSubscription = this.readPosition().pipe(
            take(1),
            finalize(() => this.markPortAsFree())
        ).subscribe((apos) => {
            this.aposChange.next(apos);
        });
    }

    private markPortAsBusy(): void {
        if (!this.isQueryingPort.value) {
            this.isQueryingPort.next(true);
            this.isQueryingPortChange.next(true);
        }
    }

    private markPortAsFree(): void {
        if (this.isQueryingPort.value) {
            this.isQueryingPort.next(false);
            this.isQueryingPortChange.next(false);
        }
    }

    private readPosition(): Observable<number> {
        if (this.hubId === undefined || this.portId === undefined) {
            return of(0);
        }
        if (this.portModeName === PortModeName.position) {
            return this.hubFacadeService.getMotorPosition(
                this.hubId,
                this.portId
            );
        } else if (this.portModeName === PortModeName.absolutePosition) {
            return this.hubFacadeService.getMotorAbsolutePosition(
                this.hubId,
                this.portId
            );
        }
        return of(0);
    }
}
