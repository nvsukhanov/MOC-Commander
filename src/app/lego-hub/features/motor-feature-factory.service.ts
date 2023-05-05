import { Injectable } from '@angular/core';
import { MotorFeature } from './motor-feature';
import { OutboundMessenger, PortOutputCommandOutboundMessageFactoryService } from '../messages';

@Injectable()
export class MotorFeatureFactoryService {
    constructor(
        private readonly portOutputCommandOutboundMessageFactoryService: PortOutputCommandOutboundMessageFactoryService,
    ) {
    }

    public createMotorFeature(
        messenger: OutboundMessenger
    ): MotorFeature {
        return new MotorFeature(
            messenger,
            this.portOutputCommandOutboundMessageFactoryService
        );
    }
}
