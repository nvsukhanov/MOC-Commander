import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription, concatWith, delay, last, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { MOTOR_LIMITS, MotorServoEndState, PortModeName } from 'rxpoweredup';
import { AsyncPipe } from '@angular/common';
import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS, ATTACHED_IO_PROPS_SELECTORS, HubStorageService } from '@app/store';
import { MotorPositionAdjustmentControlsComponent } from '@app/shared-ui';

@Component({
    standalone: true,
    selector: 'lib-cs-motor-position-adjustment',
    templateUrl: './motor-position-adjustment.component.html',
    styleUrls: [ './motor-position-adjustment.component.scss' ],
    imports: [
        MotorPositionAdjustmentControlsComponent,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotorPositionAdjustmentComponent implements OnChanges, OnDestroy {
    @Input() public hubId: string | null = null;

    @Input() public portId: number | null = null;

    @Input() public power: number = MOTOR_LIMITS.maxPower;

    @Input() public speed: number = MOTOR_LIMITS.maxSpeed;

    private _canExecuteStep$: Observable<boolean> = of(false);

    private _canGoToZero$: Observable<boolean> = of(false);

    private subscription?: Subscription;

    constructor(
        private readonly store: Store,
        private readonly hubStorageService: HubStorageService
    ) {
    }

    public get canExecuteStep$(): Observable<boolean> {
        return this._canExecuteStep$;
    }

    public get canGoToZero$(): Observable<boolean> {
        return this._canGoToZero$;
    }

    public ngOnChanges(): void {
        if (this.hubId === null || this.portId === null) {
            this._canExecuteStep$ = of(false);
            this._canGoToZero$ = of(false);
            return;
        }
        this._canExecuteStep$ = this.store.select(ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectIoCanOperateOutputPortModeName({
            hubId: this.hubId,
            portId: this.portId,
            portModeName: PortModeName.position
        }));
        this._canGoToZero$ = this.store.select(ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectIoCanOperateOutputPortModeName({
            hubId: this.hubId,
            portId: this.portId,
            portModeName: PortModeName.absolutePosition
        }));
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    public onExecuteStep(
        stepDegrees: number
    ): void {
        if (this.hubId === null || this.portId === null) {
            return;
        }
        this.subscription?.unsubscribe();
        const hub = this.hubStorageService.get(this.hubId);
        this.subscription = hub.motors.rotateByDegree(
            this.portId,
            stepDegrees,
            {
                speed: this.speed,
                power: this.power,
                endState: MotorServoEndState.hold
            }
        ).pipe(
            last(),
            delay(500),
            concatWith(hub.motors.startSpeed(this.portId, 0, { power: 0 })),
        ).subscribe();
    }

    public onGoToZero(): void {
        if (this.hubId === null || this.portId === null) {
            return;
        }
        this.subscription?.unsubscribe();
        this.subscription = this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectMotorEncoderOffset({ hubId: this.hubId, portId: this.portId })).pipe(
            take(1),
            switchMap((motorEncoderOffset) => {
                if (this.hubId === null || this.portId === null) {
                    return of();
                }
                const hub = this.hubStorageService.get(this.hubId);
                return hub.motors.goToPosition(this.portId, -motorEncoderOffset, {
                    speed: this.speed,
                    power: this.power,
                    endState: MotorServoEndState.hold
                }).pipe(
                    last(),
                    delay(500),
                    concatWith(hub.motors.startSpeed(this.portId, 0, { power: 0 }))
                );
            })
        ).subscribe();
    }
}
