import { Pipe, PipeTransform } from '@angular/core';

import { PortIdToPortNameService } from './port-id-to-port-name.service';

@Pipe({
  standalone: true,
  name: 'portIdToPortName',
  pure: true,
})
export class PortIdToPortNamePipe implements PipeTransform {
  constructor(private readonly portIdToPortNameService: PortIdToPortNameService) {}

  public transform(portId: number | null): string {
    return this.portIdToPortNameService.mapPortId(portId);
  }
}
