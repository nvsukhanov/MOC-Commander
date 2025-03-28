import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map, switchMap, take } from 'rxjs';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { IUnsavedChangesComponent, RoutesBuilderService, TitleService } from '@app/shared-misc';
import { BreadcrumbsService, FeatureToolbarControlsDirective, HintComponent } from '@app/shared-components';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeBinding, ROUTER_SELECTORS } from '@app/store';
import { BindingEditComponent } from '@app/shared-control-schemes';

import { BINDING_CREATE_PAGE_SELECTORS } from './binding-create-page.selectors';

@Component({
  standalone: true,
  selector: 'page-control-scheme-binding-create',
  templateUrl: './binding-create-page.component.html',
  styleUrl: './binding-create-page.component.scss',
  imports: [BindingEditComponent, MatButtonModule, HintComponent, TranslocoPipe, FeatureToolbarControlsDirective, AsyncPipe],
  providers: [TitleService, BreadcrumbsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BindingCreatePageComponent implements OnInit, IUnsavedChangesComponent {
  public readonly initialBindingData$: Observable<Partial<ControlSchemeBinding | null>>;

  private _hasUnsavedChanges = false;

  private binding: ControlSchemeBinding | null = null;

  constructor(
    private readonly store: Store,
    private readonly routesBuilderService: RoutesBuilderService,
    private readonly router: Router,
    private readonly titleService: TitleService,
    private readonly translocoService: TranslocoService,
    private breadcrumbs: BreadcrumbsService,
  ) {
    this.initialBindingData$ = this.store.select(BINDING_CREATE_PAGE_SELECTORS.selectDataForNewBinding).pipe(take(1));
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
            label$: this.translocoService.selectTranslate('pageTitle.bindingCreate'),
            route: this.routesBuilderService.bindingCreate(controlSchemeName),
          },
        ]),
      ),
    );
  }

  public get hasUnsavedChanges(): boolean {
    return this._hasUnsavedChanges;
  }

  public get canSave(): boolean {
    return this.binding !== null;
  }

  public onBindingChange(binding: ControlSchemeBinding | null): void {
    this.binding = binding;
  }

  public onFormDirtyChange(isDirty: boolean): void {
    this._hasUnsavedChanges = isDirty;
  }

  public ngOnInit(): void {
    this.titleService.setTitle$(
      this.store
        .select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeName)
        .pipe(switchMap((controlSchemeName) => this.translocoService.selectTranslate('pageTitle.bindingCreateForScheme', { controlSchemeName }))),
    );
  }

  public onCancel(): void {
    this.store
      .select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeName)
      .pipe(
        take(1),
        filter((schemeName): schemeName is string => schemeName !== null),
      )
      .subscribe((schemeName) => {
        this.router.navigate(this.routesBuilderService.controlSchemeView(schemeName));
      });
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
        if (this.binding === null) {
          return;
        }
        this.store.dispatch(
          CONTROL_SCHEME_ACTIONS.createBinding({
            schemeName: schemeName,
            binding: this.binding,
          }),
        );
        this._hasUnsavedChanges = false;
        this.router.navigate(this.routesBuilderService.controlSchemeView(schemeName));
      });
  }
}
