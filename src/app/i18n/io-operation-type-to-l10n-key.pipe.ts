import { Pipe, PipeTransform } from '@angular/core';
import { HubIoOperationMode } from '../store';

@Pipe({
    name: 'ioOperationTypeToL10nKey',
    pure: true,
    standalone: true
})
export class IoOperationTypeToL10nKeyPipe implements PipeTransform {
    private readonly mapping: { [k in HubIoOperationMode]: string } = {
        [HubIoOperationMode.Linear]: 'hubIOOperationModeLinear',
        [HubIoOperationMode.Servo]: 'hubIOOperationModeServo',
        [HubIoOperationMode.SetAngle]: 'hubIOOperationModeSetAngle'
    };

    public transform(operationMode: HubIoOperationMode): string {
        return this.mapping[operationMode];
    }

}
