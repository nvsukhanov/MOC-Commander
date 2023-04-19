import { Pipe, PipeTransform } from '@angular/core';
import { HubIoOperationMode } from '../store/hub-io-operation-mode';
import { MAPPING_HUB_IO_OPERATION_MODE_TO_L10N } from './hub-io-operation-mode-to-l10n';

@Pipe({
    name: 'ioOperationTypeToL10nKey',
    pure: true,
    standalone: true
})
export class IoOperationTypeToL10nKeyPipe implements PipeTransform {
    public transform(operationMode: HubIoOperationMode): string {
        return MAPPING_HUB_IO_OPERATION_MODE_TO_L10N[operationMode];
    }

}
