import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { WidgetConfigModel } from '@app/store';

import { WidgetConnectionInfoL10nPipe } from '../../widget-connection-info-l10n.pipe';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-reorder-widget-dialog-list-item',
    templateUrl: './widgets-list-item.component.html',
    styleUrls: [ './widgets-list-item.component.scss' ],
    imports: [
        MatListModule,
        MatIconModule,
        CdkDragPlaceholder,
        CdkDragHandle,
        WidgetConnectionInfoL10nPipe,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetsListItemComponent {
    @Input() public widget?: WidgetConfigModel;
}
