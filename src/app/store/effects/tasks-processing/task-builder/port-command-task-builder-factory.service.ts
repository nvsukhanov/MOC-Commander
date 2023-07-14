import { Injectable } from '@angular/core';

import { IPortCommandTaskBuilder } from './i-port-command-task-builder';
import { ServoTaskBuilder, SetAngleTaskBuilder, SetSpeedTaskBuilder, StepperTaskBuilder } from './builders';

@Injectable({ providedIn: 'root' })
export class PortCommandTaskBuilderFactoryService {
    public create(): IPortCommandTaskBuilder {
        return this.createChain();
    }

    private createChain(): IPortCommandTaskBuilder {
        const setSpeedTaskBuilder = new SetSpeedTaskBuilder();
        const servoTaskBuilder = new ServoTaskBuilder();
        const setTaskBuilder = new SetAngleTaskBuilder();
        const stepperTaskBuilder = new StepperTaskBuilder();
        setSpeedTaskBuilder.setNext(servoTaskBuilder)
                           .setNext(setTaskBuilder)
                           .setNext(stepperTaskBuilder);
        return setSpeedTaskBuilder;
    }
}
