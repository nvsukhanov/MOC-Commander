import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslocoPipe } from '@jsverse/transloco';
import { RoutesBuilderService } from '@app/shared-misc';
import { EllipsisTitleDirective, HubTypeToL10nKeyPipe } from '@app/shared-components';
import { HubModel, HubRuntimeDataModel } from '@app/store';

@Component({
  standalone: true,
  selector: 'page-hub-view-hub-properties-view',
  templateUrl: './hub-properties-view.component.html',
  styleUrl: './hub-properties-view.component.scss',
  imports: [MatButtonModule, MatCardModule, TranslocoPipe, EllipsisTitleDirective, HubTypeToL10nKeyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPropertiesViewComponent {
  @Input() public runtimeData?: HubRuntimeDataModel;

  private _hubEditRoute: string[] = [];

  private _configuration: HubModel | undefined;

  constructor(private readonly routesBuilderService: RoutesBuilderService) {}

  @Input()
  public set configuration(value: HubModel | undefined) {
    this._configuration = value;
    this._hubEditRoute = value === undefined ? [] : this.routesBuilderService.hubEdit(value.hubId);
  }

  public get configuration(): HubModel | undefined {
    return this._configuration;
  }

  public get hubEditRoute(): string[] {
    return this._hubEditRoute;
  }
}
