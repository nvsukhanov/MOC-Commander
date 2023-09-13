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

export function provideTaskFactories(): Provider[] {
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
