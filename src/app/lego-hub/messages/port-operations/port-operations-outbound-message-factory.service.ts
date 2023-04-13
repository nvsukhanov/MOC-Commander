import { Injectable } from '@angular/core';
import { RawMessage } from '../raw-message';
import { MessageType, MotorProfile, MotorSubCommand, PortOperationCompletionInformation, PortOperationStartupInformation } from '../../constants';

@Injectable()
export class PortOperationsOutboundMessageFactoryService {
    private readonly minMotorSpeed = -100;

    private readonly maxMotorSpeed = 100;

    private readonly minMotorPower = 0;

    private readonly maxMotorPower = 100;

    public startRotation(
        portId: number,
        speed: number,
        power: number = 100,
        profile: MotorProfile = MotorProfile.dontUseProfiles,
        startupMode: PortOperationStartupInformation = PortOperationStartupInformation.bufferIfNecessary,
        completionMode: PortOperationCompletionInformation = PortOperationCompletionInformation.commandFeedback,
    ): RawMessage<MessageType.portOutputCommand> {
        if (speed > this.maxMotorSpeed || speed < this.minMotorSpeed) {
            throw new Error(`Speed must be between ${this.minMotorSpeed} and ${this.maxMotorSpeed}`);
        }
        if (power > this.maxMotorPower || power < this.minMotorPower) {
            throw new Error(`Power must be between ${this.minMotorPower} and ${this.maxMotorPower}`);
        }
        return {
            header: {
                messageType: MessageType.portOutputCommand,
            },
            payload: new Uint8Array([
                portId,
                startupMode | completionMode,
                MotorSubCommand.startSpeed,
                speed,
                power,
                profile
            ])
        };
    }
}
