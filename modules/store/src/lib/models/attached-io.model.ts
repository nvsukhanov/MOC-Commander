import { IOType } from 'rxpoweredup';

export type AttachedIoModel = {
  hubId: string;
  portId: number;
  ioType: IOType;
  hardwareRevision: string;
  softwareRevision: string;
};
