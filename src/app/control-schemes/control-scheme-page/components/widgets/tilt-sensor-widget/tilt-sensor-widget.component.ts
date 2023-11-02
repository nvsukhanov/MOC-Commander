import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TiltData } from 'rxpoweredup';
import { LetDirective, PushPipe } from '@ngrx/component';
import { PitchIndicatorComponent, RollIndicatorComponent, TiltGaugeIconDirective, WidgetComponent, YawIndicatorComponent } from '@app/shared';
import { TiltWidgetConfigModel } from '@app/store';

import { IControlSchemeWidgetComponent } from '../../widget-container';
import { ITiltSensorWidgetDataProvider, TILT_SENSOR_WIDGET_DATA_PROVIDER } from './i-tilt-sensor-widget-data-provider';

@Component({
    standalone: true,
    selector: 'app-tilt-sensor-widget',
    templateUrl: './tilt-sensor-widget.component.html',
    styleUrls: [ './tilt-sensor-widget.component.scss' ],
    imports: [
        WidgetComponent,
        LetDirective,
        RollIndicatorComponent,
        PushPipe,
        YawIndicatorComponent,
        PitchIndicatorComponent,
        TiltGaugeIconDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TiltSensorWidgetComponent implements IControlSchemeWidgetComponent<TiltWidgetConfigModel> {
    @Output() public readonly edit = new EventEmitter<void>();

    @Output() public readonly delete = new EventEmitter<void>();

    @Input() public canBeDeleted = false;

    @Input() public canBeEdited = false;

    private _config?: TiltWidgetConfigModel;

    private _tiltData$: Observable<TiltData | null> = of(null);

    constructor(
        @Inject(TILT_SENSOR_WIDGET_DATA_PROVIDER) private readonly dataProvider: ITiltSensorWidgetDataProvider
    ) {
    }

    @Input()
    public set config(
        config: TiltWidgetConfigModel
    ) {
        if (config !== this._config) {
            if (config.hubId !== this._config?.hubId || config.portId !== this._config?.portId) {
                this._tiltData$ = this.dataProvider.getTilt(config.id);
            }
            this._config = config;
        }
    }

    public get config(): TiltWidgetConfigModel {
        if (!this._config) {
            throw new Error('Config is not set');
        }
        return this._config;
    }

    public get title(): string {
        if (this._config) {
            return this._config.title;
        }
        return '';
    }

    public get tiltData$(): Observable<TiltData | null> {
        return this._tiltData$;
    }

    public onEdit(): void {
        this.edit.emit();
    }

    public onDelete(): void {
        this.delete.emit();
    }
}
