import { Provider } from '@angular/core';

import {
    GearboxControlTaskPayloadFactoryService,
    ServoTaskPayloadFactoryService,
    SetAngleTaskPayloadFactoryService,
    SetSpeedTaskPayloadFactoryService,
    StepperTaskPayloadFactoryService,
    TrainControlTaskPayloadFactoryService
} from './payload-factories';
import { TaskFactoryService } from './task-factory.service';

export function provideTaskFactories(): Provider[] {
    return [
        GearboxControlTaskPayloadFactoryService,
        ServoTaskPayloadFactoryService,
        SetAngleTaskPayloadFactoryService,
        SetSpeedTaskPayloadFactoryService,
        TrainControlTaskPayloadFactoryService,
        StepperTaskPayloadFactoryService,
        TaskFactoryService
    ];
}
