import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IoPortRendererBase } from '../../io-port-renderer';
import { MotorProfile, PortModeName, PortOperationCompletionInformation, PortOperationStartupInformation } from '../../../../lego-hub';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { ACTIONS_CONFIGURE_HUB, IState, MOTOR_OPERATIONS_ACTIONS, SELECT_PORT_CURRENT_MODE } from '../../../../store';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-io-motor',
    templateUrl: './io-motor.component.html',
    styleUrls: [ './io-motor.component.scss' ],
    imports: [
        NgIf,
        JsonPipe,
        NgForOf,
        KeyValuePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IoMotorComponent extends IoPortRendererBase {
    constructor(
        cdRef: ChangeDetectorRef,
        private readonly store: Store<IState>  // TODO: remove from here
    ) {
        super(cdRef);
    }

    public start(): void {
        if (this.config) {
            this.store.dispatch(MOTOR_OPERATIONS_ACTIONS.setMotorSpeed({
                portId: this.config.portId,
                speed: 100,
                power: 100,
                profile: MotorProfile.useAccelerationAndDecelerationProfiles,
                startupMode: PortOperationStartupInformation.bufferIfNecessary,
                completionMode: PortOperationCompletionInformation.commandFeedback
            }));
        }
    }

    public stop(): void {
        if (this.config) {
            this.store.dispatch(MOTOR_OPERATIONS_ACTIONS.setMotorSpeed({
                portId: this.config.portId,
                speed: 0,
                power: 0,
                profile: MotorProfile.dontUseProfiles,
                startupMode: PortOperationStartupInformation.bufferIfNecessary,
                completionMode: PortOperationCompletionInformation.commandFeedback
            }));
        }
    }

    public brake(): void {
        if (this.config) {
            this.store.dispatch(MOTOR_OPERATIONS_ACTIONS.setMotorSpeed({
                portId: this.config.portId,
                speed: 0,
                power: 100,
                profile: MotorProfile.dontUseProfiles,
                startupMode: PortOperationStartupInformation.bufferIfNecessary,
                completionMode: PortOperationCompletionInformation.commandFeedback
            }));
        }
    }

    public subscribeTo(mode: PortModeName): void {
        if (this.config) {
            this.store.dispatch(ACTIONS_CONFIGURE_HUB.setPortMode({
                portId: this.config.portId,
                mode,
                subscribe: true
            }));
        }
    }

    public unsubscribe(): void {
        if (!this.config) {
            return;
        }
        this.store.select(SELECT_PORT_CURRENT_MODE(this.config.portId)).pipe(
            take(1)
        ).subscribe((mode) => {
            if (!mode || !this.config) {
                return;
            }
            this.store.dispatch(ACTIONS_CONFIGURE_HUB.setPortMode({
                portId: this.config.portId,
                mode,
                subscribe: false
            }));
        });
    }
}
