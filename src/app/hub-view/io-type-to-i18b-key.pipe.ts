import { Pipe, PipeTransform } from '@angular/core';
import { IOType } from '../lego-hub';
import { MAPPING_HUB_IO_TYPE_TO_L10N } from '../mappings';

@Pipe({
    name: 'ioTypeToI18nKey',
    standalone: true,
    pure: true
})
export class IOTypeToI18nKey implements PipeTransform {
    public transform(ioType: IOType): string {
        return MAPPING_HUB_IO_TYPE_TO_L10N[ioType];
    }
}
