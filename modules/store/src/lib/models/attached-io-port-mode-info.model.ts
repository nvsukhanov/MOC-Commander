import { PortModeName, PortModeSymbol } from 'rxpoweredup';

export type AttachedIoPortModeInfoModel = {
  id: string;
  modeId: number;
  name: PortModeName;
  symbol: PortModeSymbol;
};
