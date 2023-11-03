import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DecimalPipe, NgIf } from '@angular/common';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@ngneat/transloco';
import { TemperatureWidgetConfigModel } from '@app/store';
import { WidgetComponent } from '@app/shared';

import { TemperatureWidgetDataProviderService } from '../temperature-widget-data-provider.service';
import { IControlSchemeWidgetComponent } from '../../../widget-container';
import { WidgetConnectionInfoL10nService } from '../../widget-connection-info-l10n.service';

@Component({
    standalone: true,
    selector: 'app-temperature-sensor-widget',
    templateUrl: './temperature-sensor-widget.component.html',
    styleUrls: [ './temperature-sensor-widget.component.scss' ],
    providers: [
        TemperatureWidgetDataProviderService
    ],
    imports: [
        DecimalPipe,
        LetDirective,
        MatIconModule,
        NgIf,
        PushPipe,
        TranslocoPipe,
        WidgetComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemperatureSensorWidgetComponent implements IControlSchemeWidgetComponent<TemperatureWidgetConfigModel> {
    @Input() public canBeDeleted = false;

    @Input() public canBeEdited = false;

    @Output() public readonly delete = new EventEmitter<void>();

    @Output() public readonly edit = new EventEmitter<void>();

    private _subtitle$: Observable<string> = of('');

    private _config?: TemperatureWidgetConfigModel;

    private _temperature$: Observable<number | null> = of(null);

    constructor(
        private readonly dataProvider: TemperatureWidgetDataProviderService,
        private readonly widgetConnectionInfoL10nService: WidgetConnectionInfoL10nService
    ) {
    }

    @Input()
    public set config(
        config: TemperatureWidgetConfigModel
    ) {
        if (config !== this._config) {
            if (config.hubId !== this._config?.hubId || config.portId !== this._config?.portId) {
                this._temperature$ = this.dataProvider.getTemperature(config.id);
                this._subtitle$ = this.widgetConnectionInfoL10nService.getConnectionInfo(config.widgetType, config.hubId, config.portId);
            }
            this._config = config;
        }
        this._config = config;
    }

    public get config(): TemperatureWidgetConfigModel {
        if (!this._config) {
            throw new Error('Config is not set');
        }

        return this._config;
    }

    public get temperature$(): Observable<number | null> {
        return this._temperature$;
    }

    public get title(): string {
        if (this._config) {
            return this._config.title;
        }
        return '';
    }

    public get subtitle$(): Observable<string> {
        return this._subtitle$;
    }

    public onEdit(): void {
        this.edit.emit();
    }

    public onDelete(): void {
        this.delete.emit();
    }
}
