import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of, switchMap, take } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

import { RoutesBuilderService } from '../../routing';
import { BindingFormResult, ControlSchemeEditFormComponent } from './edit-form';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlScheme, ROUTER_SELECTORS } from '../../store';

@Component({
    standalone: true,
    selector: 'app-control-scheme',
    templateUrl: './control-scheme-edit.component.html',
    styleUrls: [ './control-scheme-edit.component.scss' ],
    imports: [
        ControlSchemeEditFormComponent,
        PushPipe,
        TranslocoModule,
        NgIf,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditComponent implements OnDestroy {
    public readonly currentlyEditedScheme$: Observable<ControlScheme | undefined> = this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
        switchMap((i) => i === null ? of(undefined) : this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(i)))
    );

    private sub?: Subscription;

    constructor(
        private readonly store: Store,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly router: Router
    ) {
    }

    public ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    public onSave(data: BindingFormResult): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.update(data));
    }

    public onCancel(): void {
        this.currentlyEditedScheme$.pipe(
            take(1)
        ).subscribe((i) => {
            this.router.navigate(i === undefined ? this.routesBuilderService.controlSchemesList : this.routesBuilderService.controlSchemeView(i.id));
        });
    }
}
