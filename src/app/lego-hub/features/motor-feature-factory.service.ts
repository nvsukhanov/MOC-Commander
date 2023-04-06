import { Injectable } from '@angular/core';
import { MotorFeature } from './motor-feature';
import { OutboundMessenger, PortOperationsOutboundMessageFactoryService } from '../messages';

@Injectable()
export class MotorFeatureFactoryService {
    constructor(
        private readonly portOperationsOutboundMessageFactoryService: PortOperationsOutboundMessageFactoryService,
    ) {
    }

    public createMotorFeature(
        messenger: OutboundMessenger
    ): MotorFeature {
        return new MotorFeature(
            messenger,
            this.portOperationsOutboundMessageFactoryService
        );
    }
}
