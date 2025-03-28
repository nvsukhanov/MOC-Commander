import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { WidgetConfigModel } from '@app/store';
import { EllipsisTitleDirective } from '@app/shared-components';

import { WidgetConnectionInfoL10nPipe } from '../widget-connection-info-l10n.pipe';

@Component({
  standalone: true,
  selector: 'page-control-scheme-view-reorder-widget-dialog',
  templateUrl: './reorder-widget-dialog.component.html',
  styleUrl: './reorder-widget-dialog.component.scss',
  imports: [MatButtonModule, MatDialogModule, TranslocoPipe, MatListModule, WidgetConnectionInfoL10nPipe, AsyncPipe, EllipsisTitleDirective, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReorderWidgetDialogComponent {
  protected readonly widgetsList: WidgetConfigModel[] = [...this.dialogData];

  constructor(
    private readonly dialog: MatDialogRef<ReorderWidgetDialogComponent, WidgetConfigModel[]>,
    @Inject(MAT_DIALOG_DATA) private readonly dialogData: WidgetConfigModel[],
  ) {}

  public onMoveUp(index: number): void {
    if (index === 0) {
      return;
    }
    const widget = this.widgetsList[index];
    this.widgetsList[index] = this.widgetsList[index - 1];
    this.widgetsList[index - 1] = widget;
  }

  public onMoveDown(index: number): void {
    if (index === this.widgetsList.length - 1) {
      return;
    }
    const widget = this.widgetsList[index];
    this.widgetsList[index] = this.widgetsList[index + 1];
    this.widgetsList[index + 1] = widget;
  }

  public onSave(): void {
    this.dialog.close(this.widgetsList);
  }

  public onCancel(): void {
    this.dialog.close();
  }

  public trackByWidgetId(index: number, widget: WidgetConfigModel): number {
    return widget.id;
  }
}
