import { PortModeData } from '../../store';
import { ChangeDetectorRef, Directive } from '@angular/core';
import { PortModeName } from '../../lego-hub';

export type IoPortRendererConfig = {
    portId: number;
    value: number[];
    inputModes: PortModeData;
    outputModes: PortModeData;
    currentMode: PortModeName | null;
}

@Directive()
export class IoPortRendererBase {
    protected _config?: IoPortRendererConfig;

    constructor(
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    public get config(): IoPortRendererConfig | undefined {
        return this._config;
    }

    public setConfig(config: IoPortRendererConfig): void {
        this._config = config;
        this.cdRef.markForCheck();
    }
}
