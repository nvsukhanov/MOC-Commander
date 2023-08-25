import { Provider } from '@angular/core';

import {
    AngleShiftTaskPayloadFactoryService,
    ServoTaskPayloadFactoryService,
    SetAngleTaskPayloadFactoryService,
    SetSpeedTaskPayloadFactoryService,
    SpeedShiftTaskPayloadFactoryService,
    StepperTaskPayloadFactoryService
} from './payload-factories';
import { TaskFactoryService } from './task-factory.service';

export function provideTaskProcessingFactories(): Provider[] {
    return [
        AngleShiftTaskPayloadFactoryService,
        ServoTaskPayloadFactoryService,
        SetAngleTaskPayloadFactoryService,
        SetSpeedTaskPayloadFactoryService,
        SpeedShiftTaskPayloadFactoryService,
        StepperTaskPayloadFactoryService,
        TaskFactoryService
    ];
}
