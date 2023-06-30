import { Pipe, PipeTransform } from '@angular/core';

import { HubIoOperationMode } from './hub-io-operation-mode';

@Pipe({
    name: 'ioOperationTypeToL10nKey',
    pure: true,
    standalone: true
})
export class IoOperationTypeToL10nKeyPipe implements PipeTransform {
    private readonly mapping: { [k in HubIoOperationMode]: string } = {
        [HubIoOperationMode.Linear]: 'io.operationModeLinear',
        [HubIoOperationMode.Servo]: 'io.operationModeServo',
        [HubIoOperationMode.SetAngle]: 'io.operationModeSetAngle'
    };

    public transform(operationMode: HubIoOperationMode): string {
        return this.mapping[operationMode];
    }

}
