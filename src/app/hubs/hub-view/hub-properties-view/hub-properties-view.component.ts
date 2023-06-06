import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';

import { HubConfiguration } from '../../../store';
import { EllipsisTitleDirective, HUB_TYPE_TO_L10N_MAPPING } from '../../../common';
import { RoutesBuilderService } from '../../../routing';

@Component({
    standalone: true,
    selector: 'app-hub-properties-view',
    templateUrl: './hub-properties-view.component.html',
    styleUrls: [ './hub-properties-view.component.scss' ],
    imports: [
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        NgIf,
        TranslocoModule,
        RouterLink,
        EllipsisTitleDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubPropertiesViewComponent {
    @Output() public readonly disconnect = new EventEmitter<void>();

    public readonly hubTypeL10nMap = HUB_TYPE_TO_L10N_MAPPING;

    private _hubEditRoute: string[] = [];

    private _configuration: HubConfiguration | undefined;

    constructor(
        private readonly routesBuilderService: RoutesBuilderService,
    ) {
    }

    @Input()
    public set configuration(value: HubConfiguration | undefined) {
        this._configuration = value;
        this._hubEditRoute = value === undefined ? [] : this.routesBuilderService.hubEdit(value.hubId);
    }

    public get configuration(): HubConfiguration | undefined {
        return this._configuration;
    }

    public get hubEditRoute(): string[] {
        return this._hubEditRoute;
    }

    public onDisconnect(): void {
        this.disconnect.emit();
    }
}
