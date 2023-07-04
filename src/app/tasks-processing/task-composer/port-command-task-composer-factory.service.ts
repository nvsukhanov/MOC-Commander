import { Injectable } from '@angular/core';

import { IPortCommandTaskComposer } from './i-port-command-task-composer';
import { ServoComposer, SetAngleComposer, SetSpeedComposer, StepperComposer } from './composers';

@Injectable({ providedIn: 'root' })
export class PortCommandTaskComposerFactoryService {
    public create(): IPortCommandTaskComposer {
        return this.createChain();
    }

    private createChain(): IPortCommandTaskComposer {
        const setSpeedComposer = new SetSpeedComposer();
        const servoComposer = new ServoComposer();
        const setAngleComposer = new SetAngleComposer();
        const stepperComposer = new StepperComposer();
        setSpeedComposer.setNext(servoComposer)
                        .setNext(setAngleComposer)
                        .setNext(stepperComposer);
        return setSpeedComposer;
    }
}
