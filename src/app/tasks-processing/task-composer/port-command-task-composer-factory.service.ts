import { Injectable } from '@angular/core';
import { IPortCommandTaskComposer } from './i-port-command-task-composer';
import { ServoComposer, SetSpeedComposer } from './composers';

@Injectable({ providedIn: 'root' })
export class PortCommandTaskComposerFactoryService {
    public create(): IPortCommandTaskComposer {
        return new SetSpeedComposer().setNext(
            new ServoComposer()
        );
    }
}
