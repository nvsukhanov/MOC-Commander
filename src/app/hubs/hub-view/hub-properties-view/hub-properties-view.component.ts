import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { HubConfiguration } from '../../../store';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { HUB_TYPE_TO_L10N_MAPPING } from '../../../i18n';
import { RouterLink } from '@angular/router';
import { EllipsisTitleDirective } from '../../../common';
import { ROUTE_PATHS } from '../../../routes';

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
    @Input() public configuration: HubConfiguration | undefined;

    @Output() public readonly disconnect = new EventEmitter<void>();

    public readonly hubTypeL10nMap = HUB_TYPE_TO_L10N_MAPPING;

    public readonly hubEditSubroute = ROUTE_PATHS.hubEditSubroute;

    public onDisconnect(): void {
        this.disconnect.emit();
    }
}
