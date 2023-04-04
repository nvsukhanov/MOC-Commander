import { PortModeData } from '../../store';

export interface IIoPortRendererConfig {
    portId: number;
    value: number[];
    inputModes: PortModeData;
    outputModes: PortModeData;
}

export interface IIoPortRenderer {
    setConfig(config: IIoPortRendererConfig): void;
}
