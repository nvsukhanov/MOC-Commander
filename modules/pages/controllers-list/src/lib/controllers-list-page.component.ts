import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { ControllerNamePipe, ControllerTypeIconNamePipe, ControllerViewHrefPipe } from '@app/shared-controller';
import { RoutesBuilderService, TitleService } from '@app/shared-misc';
import { BreadcrumbsService, ConfirmationDialogModule, ConfirmationDialogService, HintComponent } from '@app/shared-components';
import { CONTROLLERS_ACTIONS } from '@app/store';

import { CONTROLLERS_LIST_PAGE_SELECTORS, ControllerListViewModel } from './controllers-list-page.selectors';

@Component({
  standalone: true,
  selector: 'page-controllers-list',
  templateUrl: './controllers-list-page.component.html',
  styleUrl: './controllers-list-page.component.scss',
  imports: [
    HintComponent,
    TranslocoPipe,
    ControllerNamePipe,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    ControllerViewHrefPipe,
    ControllerTypeIconNamePipe,
    MatIconModule,
    ConfirmationDialogModule,
    AsyncPipe,
  ],
  providers: [TitleService, BreadcrumbsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControllersListPageComponent implements OnInit {
  public readonly controllerListViewModel$: Observable<ControllerListViewModel> = this.store.select(CONTROLLERS_LIST_PAGE_SELECTORS.viewModel);

  constructor(
    private readonly store: Store,
    private readonly confirmationService: ConfirmationDialogService,
    private readonly translocoService: TranslocoService,
    private readonly titleService: TitleService,
    private readonly routesBuilder: RoutesBuilderService,
    private breadcrumbs: BreadcrumbsService,
  ) {
    this.breadcrumbs.setBreadcrumbsDef(
      of([
        {
          label$: this.translocoService.selectTranslate('pageTitle.controllerList'),
          route: this.routesBuilder.controllersList,
        },
      ]),
    );
  }

  public ngOnInit(): void {
    this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.controllerList'));
  }

  public forgetController(controllerId: string): void {
    this.confirmationService
      .confirm(this.translocoService.selectTranslate('controller.forgetControllerDialogTitle'), {
        content$: this.translocoService.selectTranslate('controller.forgetControllerDialogDescription'),
        confirmTitle$: this.translocoService.selectTranslate('controller.forgetControllerDialogConfirmButtonTitle'),
        cancelTitle$: this.translocoService.selectTranslate('controller.forgetControllerDialogCancelButtonTitle'),
      })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.store.dispatch(CONTROLLERS_ACTIONS.forgetController({ controllerId }));
        }
      });
  }
}
