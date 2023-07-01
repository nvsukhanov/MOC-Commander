import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of, switchMap, take } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

import { RoutesBuilderService } from '../../routing';
import { BindingFormResult, ControlSchemeEditFormComponent } from './edit-form';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlSchemeModel, ROUTER_SELECTORS } from '../../store';
import { trimFormOutputBinding } from '../trim-form-output-binding';

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
    public readonly currentlyEditedScheme$: Observable<ControlSchemeModel | undefined> = this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
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
        const result = {
            id: data.id,
            name: data.name,
            bindings: data.bindings.map((i) => trimFormOutputBinding(i))
        };
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.update(result));
    }

    public onCancel(): void {
        this.currentlyEditedScheme$.pipe(
            take(1)
        ).subscribe((i) => {
            this.router.navigate(i === undefined ? this.routesBuilderService.controlSchemesList : this.routesBuilderService.controlSchemeView(i.id));
        });
    }
}
