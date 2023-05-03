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
        startupMode: PortOperationStartupInformation = PortOperationStartupInformation.bufferIfNecessary,
        completionMode: PortOperationCompletionInformation = PortOperationCompletionInformation.commandFeedback,
    ): Promise<void> {
        return this.messenger.sendWithoutResponse(this.portOperationsOutboundMessageFactoryService.startRotation(
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
        speed: number = MOTOR_LIMITS.maxSpeed,
        power: number = MOTOR_LIMITS.maxPower,
        endState: MotorServoEndState = MotorServoEndState.hold,
        profile: MotorProfile = MotorProfile.dontUseProfiles,
        startupMode: PortOperationStartupInformation = PortOperationStartupInformation.bufferIfNecessary,
        completionMode: PortOperationCompletionInformation = PortOperationCompletionInformation.commandFeedback,
    ): Promise<void> {
        return this.messenger.sendWithoutResponse(this.portOperationsOutboundMessageFactoryService.goToAbsolutePosition(
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
    public setAbsoluteZeroRelativeToCurrentPosition(
        portId: number,
        absolutePosition: number,
    ): Promise<void> {
        if (absolutePosition === 0) {
            // Setting absolute zero to 0 is a no-op (because it's relative to current absolute position),
            return Promise.resolve();
        }
        return this.messenger.sendWithoutResponse(this.portOperationsOutboundMessageFactoryService.presetEncoder(
            portId,
            // We use negative value here because:
            // 1. presetting encoder sets absolute zero relative to current absolute motor position
            //      e.g. if current position is 100 and absolutePosition is 50, then absolute zero will be set to 150
            // 2. somehow hub treats absolute zero in an unusual way - while positive motor angle increase treated as clockwise rotation,
            //      incrementing absolute zero by positive value shifts absolute zero in counter-clockwise direction
            // so we invert value here to have an expected behavior of API.
            // Also, we invert value here (and not in presetEncoder method) in order to keep message factories as close
            // to original documentation as possible.
            -absolutePosition,
        ));
    }
}
