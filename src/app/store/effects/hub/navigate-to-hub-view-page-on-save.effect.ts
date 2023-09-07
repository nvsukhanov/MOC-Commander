import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { filter, tap } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RoutesBuilderService } from '@app/routing';
import { HUBS_ACTIONS, ROUTER_SELECTORS } from '@app/store';

export const NAVIGATE_TO_HUB_VIEW_PAGE_ON_SAVE = createEffect((
    actions$: Actions = inject(Actions),
    router: Router = inject(Router),
    store: Store = inject(Store),
    routesBuilderService: RoutesBuilderService = inject(RoutesBuilderService),
) => {
    return actions$.pipe(
        ofType(HUBS_ACTIONS.hubNameSet),
        concatLatestFrom(() => store.select(ROUTER_SELECTORS.selectCurrentlyEditedHubId)),
        filter(([ a, b ]) => a.hubId === b),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tap(([ , hubId ]) => router.navigate(routesBuilderService.hubView(hubId!)))
    );
}, { functional: true, dispatch: false });
