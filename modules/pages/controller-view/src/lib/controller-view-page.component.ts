import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { MatCardModule } from '@angular/material/card';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { Observable, filter, map, switchMap } from 'rxjs';
import { ControllerNamePipe, ControllerTypeIconNamePipe, ControllerTypeToL10nKeyPipe } from '@app/shared-controller';
import { RoutesBuilderService, ScreenSizeObserverService, TitleService } from '@app/shared-misc';
import { FeatureToolbarBreadcrumbsDirective, FeatureToolbarControlsDirective, HintComponent, IBreadcrumbDefinition } from '@app/shared-ui';
import { ControllerProfilesFacadeService } from '@app/store';

import { CONTROLLER_VIEW_PAGE_SELECTORS } from './controller-view-page-selectors';
import { ControllerSettingsContainerComponent } from './controller-settings-container';

@Component({
    standalone: true,
    selector: 'page-controller-view',
    templateUrl: './controller-view-page.component.html',
    styleUrls: [ './controller-view-page.component.scss' ],
    imports: [
        NgIf,
        PushPipe,
        MatCardModule,
        HintComponent,
        TranslocoPipe,
        ControllerNamePipe,
        ControllerSettingsContainerComponent,
        MatIconModule,
        ControllerTypeIconNamePipe,
        ControllerTypeToL10nKeyPipe,
        FeatureToolbarControlsDirective,
        FeatureToolbarBreadcrumbsDirective
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerViewPageComponent implements OnInit {
    public readonly viewModel$ = this.store.select(CONTROLLER_VIEW_PAGE_SELECTORS.selectViewModel);

    public readonly isSmallScreen$ = this.screenSizeObserver.isSmallScreen$;

    public readonly breadcrumbsDef$: Observable<ReadonlyArray<IBreadcrumbDefinition>>;

    constructor(
        private readonly store: Store,
        private readonly screenSizeObserver: ScreenSizeObserverService,
        private readonly titleService: TitleService,
        private readonly controllerProfilesFacadeService: ControllerProfilesFacadeService,
        private readonly translocoService: TranslocoService,
        private readonly routesBuilderService: RoutesBuilderService
    ) {
        this.breadcrumbsDef$ = this.store.select(CONTROLLER_VIEW_PAGE_SELECTORS.selectCurrentlyViewedControllerId).pipe(
            filter((controllerId): controllerId is string => !!controllerId),
            switchMap((controllerId) => {
                return this.controllerProfilesFacadeService.getByControllerId(controllerId).pipe(
                    map((controllerProfile) => ([
                        {
                            label$: this.translocoService.selectTranslate('pageTitle.controllerList'),
                            route: this.routesBuilderService.controllersList
                        },
                        {
                            label$: controllerProfile.name$,
                            route: this.routesBuilderService.controllerView(controllerId)
                        }
                    ]))
                );
            })
        );
    }

    public ngOnInit(): void {
        const title$ = this.store.select(CONTROLLER_VIEW_PAGE_SELECTORS.selectCurrentlyViewedControllerId).pipe(
            filter((controllerId): controllerId is string => !!controllerId),
            switchMap((controllerId) => this.controllerProfilesFacadeService.getByControllerId(controllerId)),
            switchMap((controllerProfile) => controllerProfile.name$),
            switchMap((controllerName) => this.translocoService.selectTranslate('pageTitle.controllerView', { controllerName }))
        );
        this.titleService.setTitle$(title$);
    }
}
