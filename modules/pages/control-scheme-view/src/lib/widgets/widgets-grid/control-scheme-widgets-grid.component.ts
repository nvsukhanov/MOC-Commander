import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { WidgetType } from '@app/shared-misc';
import { WidgetConfigModel } from '@app/store';

import { WidgetContainerComponent } from '../widget-container';
import {
  CONTROL_SCHEME_WIDGET_SETTINGS_COMPONENT_FACTORY,
  IControlSchemeWidgetSettingsComponentFactory,
} from '../widget-settings-container';

type WidgetsGridWidgetViewModel = {
  config: WidgetConfigModel;
  hasSettings: boolean;
};

@Component({
  standalone: true,
  selector: 'page-control-scheme-view-control-scheme-widgets-grid',
  templateUrl: './control-scheme-widgets-grid.component.html',
  styleUrl: './control-scheme-widgets-grid.component.scss',
  imports: [WidgetContainerComponent, MatIcon, TranslocoPipe, MatFabButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlSchemeWidgetsGridComponent {
  @Input() public editable = false;

  @Input() public canAddWidget = false;

  @Output() public readonly deleteWidget = new EventEmitter<number>();

  @Output() public readonly editWidget = new EventEmitter<number>();

  @Output() public readonly addWidget = new EventEmitter<void>();

  private _viewModels: WidgetsGridWidgetViewModel[] = [];

  constructor(
    @Inject(CONTROL_SCHEME_WIDGET_SETTINGS_COMPONENT_FACTORY)
    private readonly settingsFactory: IControlSchemeWidgetSettingsComponentFactory<WidgetType>,
  ) {}

  @Input()
  public set widgetConfigs(data: WidgetConfigModel[]) {
    this._viewModels = data.map((config) => {
      return {
        config,
        hasSettings: this.settingsFactory.hasSettings(config.widgetType),
      };
    });
  }

  public get viewModels(): WidgetsGridWidgetViewModel[] {
    return this._viewModels;
  }

  public onAddWidget(): void {
    this.addWidget.emit();
  }

  public onDeleteWidget(widgetIndex: number): void {
    this.deleteWidget.emit(widgetIndex);
  }

  public onEditWidget(widgetIndex: number): void {
    this.editWidget.emit(widgetIndex);
  }
}
