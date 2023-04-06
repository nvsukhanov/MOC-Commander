import { OutboundMessenger, PortOperationsOutboundMessageFactoryService } from '../messages';
import { MotorProfile, PortOperationCompletionInformation, PortOperationStartupInformation } from '../constants';

export class MotorFeature {
    constructor(
        private readonly messenger: OutboundMessenger,
        private readonly portOperationsOutboundMessageFactoryService: PortOperationsOutboundMessageFactoryService,
    ) {
    }

    public startRotation(
        portId: number,
        speed: number,
        power: number = 100,
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
}
