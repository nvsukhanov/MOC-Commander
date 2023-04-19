import { Pipe, PipeTransform } from '@angular/core';
import { IOType } from '../lego-hub';
import { MAPPING_HUB_IO_TYPE_TO_L10N } from './hub-io-type-to-l10n';

@Pipe({
    name: 'ioTypeToL10nKey',
    pure: true,
    standalone: true
})
export class IoTypeToL10nKeyPipe implements PipeTransform {
    public transform(value: IOType): string {
        return MAPPING_HUB_IO_TYPE_TO_L10N[value];
    }
}
