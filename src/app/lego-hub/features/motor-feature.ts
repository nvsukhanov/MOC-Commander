import { OutboundMessenger, PortOperationsOutboundMessageFactoryService } from '../messages';
import { MOTOR_LIMITS, MotorProfile, PortOperationCompletionInformation, PortOperationStartupInformation } from '../constants';

export class MotorFeature {
    constructor(
        private readonly messenger: OutboundMessenger,
        private readonly portOperationsOutboundMessageFactoryService: PortOperationsOutboundMessageFactoryService,
    ) {
    }

    public setSpeed(
        portId: number,
        speed: number,
        power: number = MOTOR_LIMITS.maxPower,
        profile: MotorProfile = MotorProfile.dontUseProfiles,
        startupMode: PortOperationStartupInformation = PortOperationStartupInformation.executeImmediately,
        completionMode: PortOperationCompletionInformation = PortOperationCompletionInformation.commandFeedback,
    ): Promise<void> {
        if (Math.abs(speed) > MOTOR_LIMITS.maxAbsSpeed) { // TODO: clamp speed & power
            throw new Error(`Speed must be between ${-MOTOR_LIMITS.maxAbsSpeed} and ${MOTOR_LIMITS.maxAbsSpeed}`);
        }
        return this.messenger.send(this.portOperationsOutboundMessageFactoryService.startRotation(
            portId,
            speed,
            power,
            profile,
            startupMode,
            completionMode
        ));
    }
}
