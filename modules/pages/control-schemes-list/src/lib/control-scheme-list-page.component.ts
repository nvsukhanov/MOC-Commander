import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter, of, take } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { AsyncPipe } from '@angular/common';
import { RoutesBuilderService, ScreenSizeObserverService, TitleService } from '@app/shared-misc';
import {
  BreadcrumbsService,
  ConfirmationDialogModule,
  ConfirmationDialogService,
  FeatureToolbarControlsDirective,
  HintComponent,
} from '@app/shared-components';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlSchemeModel } from '@app/store';
import {
  ControlSchemeViewUrlPipe,
  ExportControlSchemeDialogComponent,
  ExportControlSchemeDialogData,
  ImportControlSchemeDialogComponent,
} from '@app/shared-control-schemes';

import { CONTROL_SCHEMES_LIST_PAGE_SELECTORS } from './control-scheme-list-page.selectors';
import { ControlSchemeCreateDialogComponent } from './control-scheme-create-dialog';

@Component({
  standalone: true,
  selector: 'page-control-schemes-list',
  templateUrl: './control-scheme-list-page.component.html',
  styleUrl: './control-scheme-list-page.component.scss',
  imports: [
    TranslocoPipe,
    MatButtonModule,
    RouterLink,
    MatCardModule,
    MatDialogModule,
    ControlSchemeViewUrlPipe,
    HintComponent,
    FeatureToolbarControlsDirective,
    ConfirmationDialogModule,
    AsyncPipe,
  ],
  providers: [TitleService, BreadcrumbsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlSchemeListPageComponent implements OnInit {
  public readonly controlSchemes$ = this.store.select(CONTROL_SCHEMES_LIST_PAGE_SELECTORS.selectSchemesList);

  public readonly canCreateScheme$ = this.store.select(CONTROL_SCHEMES_LIST_PAGE_SELECTORS.canCreateScheme);

  public readonly isSmallScreen$ = this.screenSizeObserverService.isSmallScreen$;

  constructor(
    private readonly store: Store,
    protected readonly routesBuilderService: RoutesBuilderService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly transloco: TranslocoService,
    private readonly screenSizeObserverService: ScreenSizeObserverService,
    private readonly titleService: TitleService,
    private breadcrumbs: BreadcrumbsService,
  ) {
    this.breadcrumbs.setBreadcrumbsDef(
      of([
        {
          label$: this.transloco.selectTranslate('pageTitle.controlSchemesList'),
          route: this.routesBuilderService.controlSchemesList,
        },
      ]),
    );
  }

  public ngOnInit(): void {
    this.titleService.setTitle$(this.transloco.selectTranslate('pageTitle.controlSchemesList'));
  }

  public onImport(): void {
    this.dialog
      .open<ImportControlSchemeDialogComponent, undefined, ControlSchemeModel | void>(ImportControlSchemeDialogComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter((r): r is ControlSchemeModel => !!r),
        concatLatestFrom((scheme: ControlSchemeModel) => this.store.select(CONTROL_SCHEME_SELECTORS.selectNextSchemeName(scheme.name))),
      )
      .subscribe(([importedScheme, newName]) => {
        const scheme = { ...importedScheme, name: newName };
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.importControlScheme({ scheme }));
        this.router.navigate(this.routesBuilderService.controlSchemeView(newName));
      });
  }

  public onExport(name: string): void {
    this.dialog.open<ExportControlSchemeDialogComponent, ExportControlSchemeDialogData>(ExportControlSchemeDialogComponent, { data: { name } });
  }

  public onCreate(): void {
    const dialogRef = this.dialog.open<ControlSchemeCreateDialogComponent, null, { name: string }>(ControlSchemeCreateDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.router.navigate(this.routesBuilderService.controlSchemeView(result.name));
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.createControlScheme(result));
      }
    });
  }

  public onDelete(name: string): void {
    this.confirmationDialogService
      .confirm(this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationTitle', { name }), {
        content$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationContent'),
        confirmTitle$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationConfirmButtonTitle'),
        cancelTitle$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationCancelButtonTitle'),
      })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.store.dispatch(CONTROL_SCHEME_ACTIONS.deleteControlScheme({ name }));
        }
      });
  }

  public onRename(name: string): void {
    this.router.navigate(this.routesBuilderService.controlSchemeRename(name));
  }
}
