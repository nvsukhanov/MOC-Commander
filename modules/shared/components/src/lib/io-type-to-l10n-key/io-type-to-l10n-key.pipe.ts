import { Pipe, PipeTransform } from '@angular/core';
import { IOType } from 'rxpoweredup';

import { IoTypeToL10nKeyService } from './io-type-to-l10n-key.service';

@Pipe({
  name: 'ioTypeToL10nKey',
  pure: true,
  standalone: true,
})
export class IoTypeToL10nKeyPipe implements PipeTransform {
  constructor(private readonly mappingService: IoTypeToL10nKeyService) {}

  public transform(ioType: IOType | null): string {
    return this.mappingService.getL10nKey(ioType ?? undefined);
  }
}
