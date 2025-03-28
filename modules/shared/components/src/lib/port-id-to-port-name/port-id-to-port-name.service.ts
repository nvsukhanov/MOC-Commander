import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PortIdToPortNameService {
  // This assumption is incorrect, but it's good enough for now.
  // TODO: Replace this with a mapping that is based on the hub type.
  private readonly portIdToPortNameMapping: Readonly<{ [portId: number]: string }> = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
  };

  private readonly nullPortName: string = '-';

  public mapPortId(portId: number | null): string {
    if (portId === null) {
      return this.nullPortName;
    }
    return this.portIdToPortNameMapping[portId] ?? portId.toString();
  }
}
