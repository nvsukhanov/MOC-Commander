import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map, switchMap, take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { concatLatestFrom } from '@ngrx/operators';
import { AsyncPipe } from '@angular/common';
import { IUnsavedChangesComponent, RoutesBuilderService, TitleService } from '@app/shared-misc';
import { BreadcrumbsService, ConfirmationDialogModule, ConfirmationDialogService, FeatureToolbarControlsDirective } from '@app/shared-components';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeBinding, ROUTER_SELECTORS } from '@app/store';
import { BindingEditComponent } from '@app/shared-control-schemes';

import { BINDING_EDIT_PAGE_SELECTORS } from './binding-edit-page.selectors';

@Component({
  standalone: true,
  selector: 'page-control-scheme-binding-edit',
  templateUrl: './binding-edit-page.component.html',
  styleUrl: './binding-edit-page.component.scss',
  imports: [BindingEditComponent, MatButtonModule, TranslocoPipe, FeatureToolbarControlsDirective, ConfirmationDialogModule, AsyncPipe],
  providers: [TitleService, BreadcrumbsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BindingEditPageComponent implements OnInit, IUnsavedChangesComponent {
  public readonly binding$: Observable<ControlSchemeBinding | null>;

  private changedBinding: ControlSchemeBinding | null = null;

  private _hasUnsavedChanges = false;

  constructor(
    private readonly store: Store,
    private readonly routesBuilderService: RoutesBuilderService,
    private readonly router: Router,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly translocoService: TranslocoService,
    private readonly titleService: TitleService,
    private breadcrumbs: BreadcrumbsService,
  ) {
    this.binding$ = this.store.select(BINDING_EDIT_PAGE_SELECTORS.selectEditedBinding);

    this.breadcrumbs.setBreadcrumbsDef(
      this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeName).pipe(
        filter((schemeName): schemeName is string => schemeName !== null),
        map((controlSchemeName) => [
          {
            label$: this.translocoService.selectTranslate('pageTitle.controlSchemesList'),
            route: this.routesBuilderService.controllersList,
          },
          {
            label$: this.translocoService.selectTranslate('pageTitle.controlSchemeView', { controlSchemeName }),
            route: this.routesBuilderService.controlSchemeView(controlSchemeName),
          },
          {
            label$: this.translocoService.selectTranslate('pageTitle.bindingEdit'),
            route: this.routesBuilderService.bindingCreate(controlSchemeName),
          },
        ]),
      ),
    );
  }

  public get canSave(): boolean {
    return this.changedBinding !== null;
  }

  public get hasUnsavedChanges(): boolean {
    return this._hasUnsavedChanges;
  }

  public ngOnInit(): void {
    this.titleService.setTitle$(
      this.store
        .select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeName)
        .pipe(switchMap((controlSchemeName) => this.translocoService.selectTranslate('pageTitle.bindingEditForScheme', { controlSchemeName }))),
    );
  }

  public onBindingFormDirtyChange(dirty: boolean): void {
    this._hasUnsavedChanges = dirty;
  }

  public onBindingChange(binding: ControlSchemeBinding | null): void {
    this.changedBinding = binding;
  }

  public onSave(): void {
    if (!this.canSave) {
      throw new Error('Cannot save');
    }
    this.store
      .select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeName)
      .pipe(
        take(1),
        filter((schemeName): schemeName is string => schemeName !== null),
      )
      .subscribe((schemeName) => {
        if (this.changedBinding === null) {
          return;
        }
        this.store.dispatch(
          CONTROL_SCHEME_ACTIONS.saveBinding({
            schemeName,
            binding: this.changedBinding,
          }),
        );

        this._hasUnsavedChanges = false;
        this.router.navigate(this.routesBuilderService.controlSchemeView(schemeName));
      });
  }

  public onCancel(): void {
    this.store
      .select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeName)
      .pipe(
        take(1),
        filter((id): id is string => id !== null),
        map((id) => this.routesBuilderService.controlSchemeView(id)),
      )
      .subscribe((route) => {
        this.router.navigate(route);
      });
  }

  public onDelete(): void {
    this.confirmationDialogService
      .confirm(this.translocoService.selectTranslate('controlScheme.deleteBindingConfirmationTitle'), {
        content$: this.translocoService.selectTranslate('controlScheme.deleteBindingConfirmationContent'),
        confirmTitle$: this.translocoService.selectTranslate('controlScheme.deleteBindingConfirmationConfirmButtonTitle'),
        cancelTitle$: this.translocoService.selectTranslate('controlScheme.deleteBindingConfirmationCancelButtonTitle'),
      })
      .pipe(
        take(1),
        concatLatestFrom(() => [
          this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeName),
          this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedBindingId),
        ]),
      )
      .subscribe(([isConfirmed, schemeName, bindingId]) => {
        if (isConfirmed === false || schemeName === null || bindingId === null) {
          return;
        }
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.deleteBinding({ schemeName, bindingId }));

        this._hasUnsavedChanges = false;
        const route = this.routesBuilderService.controlSchemeView(schemeName);
        this.router.navigate(route);
      });
  }
}
