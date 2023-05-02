import { OutboundMessenger, PortOperationsOutboundMessageFactoryService } from '../messages';
import { MOTOR_LIMITS, MotorProfile, MotorServoEndState, PortOperationCompletionInformation, PortOperationStartupInformation } from '../constants';

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
        return this.messenger.send(this.portOperationsOutboundMessageFactoryService.startRotation(
            portId,
            speed,
            power,
            profile,
            startupMode,
            completionMode
        ));
    }

    public goToAbsoluteDegree(
        portId: number,
        absoluteDegree: number,
        speed: number = MOTOR_LIMITS.maxAbsSpeed,
        power: number = MOTOR_LIMITS.maxPower,
        endState: MotorServoEndState = MotorServoEndState.hold,
        profile: MotorProfile = MotorProfile.dontUseProfiles,
        startupMode: PortOperationStartupInformation = PortOperationStartupInformation.executeImmediately,
        completionMode: PortOperationCompletionInformation = PortOperationCompletionInformation.commandFeedback,
    ): Promise<void> {
        return this.messenger.send(this.portOperationsOutboundMessageFactoryService.goToAbsolutePosition(
            portId,
            absoluteDegree,
            speed,
            power,
            endState,
            profile,
            startupMode,
            completionMode
        ));
    }

    // sets absolute zero degree position of motor (relative to current position)
    public setAbsoluteZeroDegree(
        portId: number,
        absolutePosition: number,
    ): Promise<void> {
        return this.messenger.send(this.portOperationsOutboundMessageFactoryService.presetEncoder(
            portId,
            absolutePosition,
        ));
    }
}
