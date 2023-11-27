import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { PushPipe } from '@ngrx/component';
import { WidgetConfigModel } from '@app/store';

import { WidgetConnectionInfoL10nPipe } from '../../widgets';

@Component({
    standalone: true,
    selector: 'feat-control-scheme-view-reorder-widget-dialog-list-item',
    templateUrl: './widgets-list-item.component.html',
    styleUrls: [ './widgets-list-item.component.scss' ],
    imports: [
        MatListModule,
        MatIconModule,
        CdkDragPlaceholder,
        CdkDragHandle,
        WidgetConnectionInfoL10nPipe,
        PushPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetsListItemComponent {
    @Input() public widget?: WidgetConfigModel;
}
