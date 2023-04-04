import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IIoPortRenderer, IIoPortRendererConfig } from '../../i-io-port-renderer';
import { IOType } from '../../../../lego-hub';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-io-motor',
    templateUrl: './io-motor.component.html',
    styleUrls: [ './io-motor.component.scss' ],
    imports: [
        NgIf,
        JsonPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IoMotorComponent implements IIoPortRenderer {
    public readonly ioType = IOType.largeTechnicMotor;

    private _config?: IIoPortRendererConfig;

    constructor(
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    public get config(): IIoPortRendererConfig | undefined {
        return this._config;
    }

    public setConfig(config: IIoPortRendererConfig): void {
        this._config = config;
        this.cdRef.markForCheck();
    }
}
