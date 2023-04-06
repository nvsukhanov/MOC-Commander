import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IIoPortRenderer, IIoPortRendererConfig } from '../../i-io-port-renderer';
import { IOType, MotorProfile, PortOperationCompletionInformation, PortOperationStartupInformation } from '../../../../lego-hub';
import { JsonPipe, NgIf } from '@angular/common';
import { IState, MOTOR_OPERATIONS_ACTIONS } from '../../../../store';
import { Store } from '@ngrx/store';

@Component({
    standalone: true,
    selector: 'app-io-motor',
    templateUrl: './io-motor.component.html',
    styleUrls: [ './io-motor.component.scss' ],
    imports: [
        NgIf,
        JsonPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IoMotorComponent implements IIoPortRenderer {
    public readonly ioType = IOType.largeTechnicMotor;

    private _config?: IIoPortRendererConfig;

    constructor(
        private readonly cdRef: ChangeDetectorRef,
        private readonly store: Store<IState>  // TODO: remove from here
    ) {
    }

    public get config(): IIoPortRendererConfig | undefined {
        return this._config;
    }

    public onStart(): void {
        if (this._config) {
            this.store.dispatch(MOTOR_OPERATIONS_ACTIONS.startMotorRotation({
                portId: this._config.portId,
                speed: 100,
                profile: MotorProfile.dontUseProfiles,
                startupMode: PortOperationStartupInformation.executeImmediately,
                completionMode: PortOperationCompletionInformation.commandFeedback
            }));
        }
    }

    public setConfig(config: IIoPortRendererConfig): void {
        this._config = config;
        this.cdRef.markForCheck();
    }
}
