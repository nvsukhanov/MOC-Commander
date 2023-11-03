import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DecimalPipe, NgIf } from '@angular/common';
import { LetDirective, PushPipe } from '@ngrx/component';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { WidgetComponent } from '@app/shared';
import { VoltageWidgetConfigModel } from '@app/store';

import { IControlSchemeWidgetComponent } from '../../../widget-container';
import { WidgetConnectionInfoL10nService } from '../../widget-connection-info-l10n.service';
import { VoltageWidgetDataProviderService } from '../voltage-widget-data-provider.service';

@Component({
    standalone: true,
    selector: 'app-voltage-sensor-widget',
    templateUrl: './voltage-sensor-widget.component.html',
    styleUrls: [ './voltage-sensor-widget.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        WidgetComponent,
        PushPipe,
        TranslocoPipe,
        LetDirective,
        MatIconModule,
        DecimalPipe
    ],
    providers: [
        VoltageWidgetDataProviderService
    ]
})
export class VoltageSensorWidgetComponent implements IControlSchemeWidgetComponent<VoltageWidgetConfigModel> {
    @Output() public readonly edit = new EventEmitter<void>();

    @Output() public readonly delete = new EventEmitter<void>();

    @Input() public canBeDeleted = false;

    @Input() public canBeEdited = false;

    private _subtitle$: Observable<string> = of('');

    private _config?: VoltageWidgetConfigModel;

    private _voltage$: Observable<number | null> = of(null);

    constructor(
        private readonly dataProvider: VoltageWidgetDataProviderService,
        private readonly widgetConnectionInfoL10nService: WidgetConnectionInfoL10nService
    ) {
    }

    @Input()
    public set config(
        config: VoltageWidgetConfigModel
    ) {
        if (config !== this._config) {
            if (config.hubId !== this._config?.hubId || config.portId !== this._config?.portId) {
                this._voltage$ = this.dataProvider.getVoltage(config.id);
                this._subtitle$ = this.widgetConnectionInfoL10nService.getConnectionInfo(config.widgetType, config.hubId, config.portId);
            }
            this._config = config;
        }
    }

    public get config(): VoltageWidgetConfigModel {
        if (!this._config) {
            throw new Error('Config is not defined');
        }
        return this._config;
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

    public get voltage$(): Observable<number | null> {
        return this._voltage$;
    }

    public onEdit(): void {
        this.edit.emit();
    }

    public onDelete(): void {
        this.delete.emit();
    }
}
