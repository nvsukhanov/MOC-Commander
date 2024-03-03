import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { WidgetConfigModel } from '@app/store';

import { WidgetsListItemComponent } from './widgets-list-item';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-reorder-widget-dialog',
    templateUrl: './reorder-widget-dialog.component.html',
    styleUrls: [ './reorder-widget-dialog.component.scss' ],
    imports: [
        MatButtonModule,
        MatDialogModule,
        TranslocoPipe,
        WidgetsListItemComponent,
        CdkDropList,
        MatListModule,
        CdkDrag,
        CdkDragPlaceholder
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReorderWidgetDialogComponent {
    protected readonly widgetsList: WidgetConfigModel[] = [...this.dialogData];

    constructor(
        private readonly dialog: MatDialogRef<ReorderWidgetDialogComponent, WidgetConfigModel[]>,
        @Inject(MAT_DIALOG_DATA) private readonly dialogData: WidgetConfigModel[],
    ) {
    }

    public onReorder(
        event: CdkDragDrop<WidgetConfigModel[]>
    ): void {
        moveItemInArray(this.widgetsList, event.previousIndex, event.currentIndex);
    }

    public onSave(): void {
        this.dialog.close(this.widgetsList);
    }

    public onCancel(): void {
        this.dialog.close();
    }

    public trackByWidgetId(
        index: number,
        widget: WidgetConfigModel
    ): number {
        return widget.id;
    }
}
