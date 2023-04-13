import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { EMPTY, Observable, switchMap } from 'rxjs';
import {
    CONTROL_BINDING_SCHEME_SELECTORS,
    CONTROL_SCHEME_BINDINGS_ACTIONS,
    CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    ControlScheme,
    ControlSchemeBinding,
    ROUTER_SELECTORS
} from '../../store';
import { Store } from '@ngrx/store';
import { PushModule } from '@ngrx/component';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NotFoundComponent } from '../../main';
import { ControlSchemeBindingViewComponent } from '../control-scheme-binding-view';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-control-scheme-view',
    templateUrl: './control-scheme-view.component.html',
    styleUrls: [ './control-scheme-view.component.scss' ],
    imports: [
        PushModule,
        JsonPipe,
        NotFoundComponent,
        NgIf,
        ControlSchemeBindingViewComponent,
        NgForOf,
        MatButtonModule,
        TranslocoModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeViewComponent implements OnDestroy {
    public readonly selectedScheme$: Observable<ControlScheme | undefined> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(id))),
    );

    public readonly selectSchemeBindings$: Observable<ControlSchemeBinding[]> = this.selectedScheme$.pipe(
        switchMap((scheme) => scheme === undefined ? EMPTY : this.store.select(CONTROL_BINDING_SCHEME_SELECTORS.selectBySchemeId(scheme.id))),
    );

    public readonly canAddBinding$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canAddBinding);

    public readonly shouldShowBindingHelp$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.shouldShowBindingHelp);

    public readonly canCancelBinding$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canCancelBinding);

    constructor(
        private readonly store: Store
    ) {
    }

    public schemeBindingTrackByFn(index: number, binding: ControlSchemeBinding): string {
        return binding.id;
    }

    public addBinding(schemeId: string): void {
        this.store.dispatch(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputListen({ schemeId }));
    }

    public cancelAddBinging(): void {
        this.store.dispatch(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputStopListening());
    }

    public ngOnDestroy(): void {
        this.store.dispatch(CONTROL_SCHEME_BINDINGS_ACTIONS.gamepadInputStopListening());
    }
}
