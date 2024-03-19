import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { filter, map, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ControllerNamePipe, ControllerTypeIconNamePipe, ControllerTypeToL10nKeyPipe } from '@app/shared-controller';
import { RoutesBuilderService, ScreenSizeObserverService, TitleService } from '@app/shared-misc';
import { BreadcrumbsService, HintComponent } from '@app/shared-ui';
import { ControllerProfilesFacadeService } from '@app/store';

import { CONTROLLER_VIEW_PAGE_SELECTORS } from './controller-view-page-selectors';
import { ControllerSettingsContainerComponent } from './controller-settings-container';

@Component({
    standalone: true,
    selector: 'page-controller-view',
    templateUrl: './controller-view-page.component.html',
    styleUrls: [ './controller-view-page.component.scss' ],
    imports: [
        MatCardModule,
        HintComponent,
        TranslocoPipe,
        ControllerNamePipe,
        ControllerSettingsContainerComponent,
        MatIconModule,
        ControllerTypeIconNamePipe,
        ControllerTypeToL10nKeyPipe,
        AsyncPipe
    ],
    providers: [
        TitleService,
        BreadcrumbsService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerViewPageComponent implements OnInit {
    public readonly viewModel$ = this.store.select(CONTROLLER_VIEW_PAGE_SELECTORS.selectViewModel);

    public readonly isSmallScreen$ = this.screenSizeObserver.isSmallScreen$;

    constructor(
        private readonly store: Store,
        private readonly screenSizeObserver: ScreenSizeObserverService,
        private readonly titleService: TitleService,
        private readonly controllerProfilesFacadeService: ControllerProfilesFacadeService,
        private readonly translocoService: TranslocoService,
        private readonly routesBuilderService: RoutesBuilderService,
        private breadcrumbs: BreadcrumbsService
    ) {
        this.breadcrumbs.setBreadcrumbsDef(
            this.store.select(CONTROLLER_VIEW_PAGE_SELECTORS.selectCurrentlyViewedControllerId).pipe(
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
            )
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
