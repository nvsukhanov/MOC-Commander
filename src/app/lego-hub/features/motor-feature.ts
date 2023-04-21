import { OutboundMessenger, PortOperationsOutboundMessageFactoryService } from '../messages';
import { MotorProfile, PortOperationCompletionInformation, PortOperationStartupInformation } from '../constants';

export class MotorFeature {
    public static readonly maxSpeed = 100;

    public static readonly maxPower = 100;

    constructor(
        private readonly messenger: OutboundMessenger,
        private readonly portOperationsOutboundMessageFactoryService: PortOperationsOutboundMessageFactoryService,
    ) {
    }

    public setSpeed(
        portId: number,
        speed: number,
        power: number = MotorFeature.maxPower,
        profile: MotorProfile = MotorProfile.dontUseProfiles,
        startupMode: PortOperationStartupInformation = PortOperationStartupInformation.executeImmediately,
        completionMode: PortOperationCompletionInformation = PortOperationCompletionInformation.commandFeedback,
    ): Promise<void> {
        if (Math.abs(speed) > MotorFeature.maxSpeed) {
            throw new Error(`Speed must be between ${-MotorFeature.maxSpeed} and ${MotorFeature.maxSpeed}`);
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
