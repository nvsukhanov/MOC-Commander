import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, Subscription, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ISchemeRunnerComponent, RoutesBuilderService, ScreenSizeObserverService, TitleService } from '@app/shared-misc';
import { BreadcrumbsService, ConfirmationDialogModule, ConfirmationDialogService } from '@app/shared-components';
import { CONTROLLER_INPUT_ACTIONS, CONTROL_SCHEME_ACTIONS, ROUTER_SELECTORS } from '@app/store';
import { ExportControlSchemeDialogComponent, ExportControlSchemeDialogData } from '@app/shared-control-schemes';

import { CONTROL_SCHEME_PAGE_SELECTORS } from './control-scheme-page.selectors';
import { ToolbarControlsComponent } from './toolbar-controls';
import { CONTROL_SCHEME_RUN_WIDGET_BLOCKERS_CHECKER, IControlSchemeRunWidgetBlockersChecker, WidgetsSectionComponent } from './widgets';
import { IssuesSectionComponent } from './issues-section';
import { BindingsSectionComponent } from './bindings-section';

@Component({
  standalone: true,
  selector: 'page-control-scheme-view',
  templateUrl: './control-scheme-page.component.html',
  styleUrl: './control-scheme-page.component.scss',
  imports: [ConfirmationDialogModule, ToolbarControlsComponent, MatDialogModule, WidgetsSectionComponent, IssuesSectionComponent, BindingsSectionComponent],
  providers: [TitleService, BreadcrumbsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlSchemePageComponent implements OnInit, OnDestroy, ISchemeRunnerComponent {
  public readonly selectedScheme = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme);

  public readonly canRunScheme = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.canRunViewedScheme(this.controlSchemeStartWidgetCheckService));

  public readonly isSmallScreen$: Observable<boolean> = this.screenSizeObserverService.isSmallScreen$;

  public readonly isSchemeRunning = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.isCurrentControlSchemeRunning);

  private sub?: Subscription;

  private isCapturingInput = false;

  constructor(
    private readonly store: Store,
    private readonly routesBuilderService: RoutesBuilderService,
    private readonly router: Router,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly transloco: TranslocoService,
    private readonly dialog: MatDialog,
    private readonly screenSizeObserverService: ScreenSizeObserverService,
    private readonly titleService: TitleService,
    @Inject(CONTROL_SCHEME_RUN_WIDGET_BLOCKERS_CHECKER)
    private readonly controlSchemeStartWidgetCheckService: IControlSchemeRunWidgetBlockersChecker,
    private breadcrumbs: BreadcrumbsService,
  ) {}

  @ViewChild('controlsTemplate', { static: false, read: TemplateRef })
  public set controlsTemplate(controls: TemplateRef<unknown> | null) {
    this.sub?.unsubscribe();
    if (!controls) {
      return;
    }
  }

  public ngOnInit(): void {
    this.titleService.setTitle$(
      this.store
        .select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeName)
        .pipe(switchMap((controlSchemeName) => this.transloco.selectTranslate('pageTitle.controlSchemeView', { controlSchemeName }))),
    );

    const scheme = this.selectedScheme();
    if (scheme) {
      this.breadcrumbs.setBreadcrumbsDef(
        of([
          {
            label$: this.transloco.selectTranslate('pageTitle.controlSchemesList'),
            route: this.routesBuilderService.controlSchemesList,
          },
          {
            label$: of(scheme.name),
            route: this.routesBuilderService.controlSchemeView(scheme.name),
          },
        ]),
      );
    }
  }

  public ngOnDestroy(): void {
    this.stopRunningScheme();
    this.sub?.unsubscribe();
  }

  public onExport(): void {
    const scheme = this.selectedScheme();
    if (!scheme) {
      return;
    }
    this.dialog.open<ExportControlSchemeDialogComponent, ExportControlSchemeDialogData>(ExportControlSchemeDialogComponent, { data: scheme });
  }

  public runScheme(): void {
    const scheme = this.selectedScheme();
    if (!scheme) {
      return;
    }
    this.startControllerInputCapture();
    this.store.dispatch(CONTROL_SCHEME_ACTIONS.startScheme(scheme));
  }

  public stopRunningScheme(): void {
    this.stopControllerInputCapture();
    this.store.dispatch(CONTROL_SCHEME_ACTIONS.stopScheme());
  }

  public onDelete(): void {
    const scheme = this.selectedScheme();
    if (!scheme) {
      return;
    }
    this.confirmationDialogService
      .confirm(this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationTitle', scheme), {
        content$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationContent'),
        confirmTitle$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationConfirmButtonTitle'),
        cancelTitle$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationCancelButtonTitle'),
      })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.router.navigate(this.routesBuilderService.controlSchemesList);
          this.store.dispatch(CONTROL_SCHEME_ACTIONS.deleteControlScheme({ name: scheme.name }));
        }
      });
  }

  private startControllerInputCapture(): void {
    if (!this.isCapturingInput) {
      this.store.dispatch(CONTROLLER_INPUT_ACTIONS.requestInputCapture());
      this.isCapturingInput = true;
    }
  }

  private stopControllerInputCapture(): void {
    if (this.isCapturingInput) {
      this.store.dispatch(CONTROLLER_INPUT_ACTIONS.releaseInputCapture());
      this.isCapturingInput = false;
    }
  }
}
