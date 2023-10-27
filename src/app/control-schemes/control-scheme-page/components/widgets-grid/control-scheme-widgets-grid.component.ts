import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { NgForOf } from '@angular/common';
import { WidgetConfigModel } from '@app/store';

import { OrderWidgetsPipe } from './order-widgets.pipe';
import { WidgetContainerComponent } from '../widget-container';

@Component({
    standalone: true,
    selector: 'app-control-scheme-widgets-grid',
    templateUrl: './control-scheme-widgets-grid.component.html',
    styleUrls: [ './control-scheme-widgets-grid.component.scss' ],
    imports: [
        LetDirective,
        NgForOf,
        OrderWidgetsPipe,
        WidgetContainerComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeWidgetsGridComponent {
    @Input() public widgetConfigs: WidgetConfigModel[] = [];

    @Input() public editable = false;

    @Output() public deleteWidget = new EventEmitter<number>();

    @Output() public editWidget = new EventEmitter<number>();

    public onDeleteWidget(
        widgetIndex: number
    ): void {
        this.deleteWidget.emit(widgetIndex);
    }

    public onEditWidget(
        widgetIndex: number
    ): void {
        this.editWidget.emit(widgetIndex);
    }
}
