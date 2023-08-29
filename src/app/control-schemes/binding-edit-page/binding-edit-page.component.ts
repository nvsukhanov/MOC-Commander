import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map, take } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { concatLatestFrom } from '@ngrx/effects';
import { ConfirmationDialogModule, ConfirmationDialogService, FeatureToolbarControlsDirective } from '@app/shared';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeBinding, ROUTER_SELECTORS } from '@app/store';

import { BINDING_EDIT_PAGE_SELECTORS } from './binding-edit-page.selectors';
import { BindingEditComponent } from '../binding-edit';
import { RoutesBuilderService } from '../../routing';

@Component({
    standalone: true,
    selector: 'app-binding-edit-page',
    templateUrl: './binding-edit-page.component.html',
    styleUrls: [ './binding-edit-page.component.scss' ],
    imports: [
        PushPipe,
        BindingEditComponent,
        MatButtonModule,
        TranslocoModule,
        FeatureToolbarControlsDirective,
        ConfirmationDialogModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingEditPageComponent {
    public readonly binding$: Observable<ControlSchemeBinding | undefined>;

    constructor(
        private readonly store: Store,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly router: Router,
        private readonly confirmationDialogService: ConfirmationDialogService,
        private readonly translocoService: TranslocoService
    ) {
        this.binding$ = this.store.select(BINDING_EDIT_PAGE_SELECTORS.selectEditedBinding);
    }

    public onSave(
        binding: ControlSchemeBinding
    ): void {
        this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
            take(1),
            filter((schemeId): schemeId is string => (schemeId) !== null)
        ).subscribe((schemeId) => {
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.saveBinding({
                schemeId,
                binding
            }));
            this.router.navigate(
                this.routesBuilderService.controlSchemeView(schemeId)
            );
        });
    }

    public onCancel(): void {
        this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
            take(1),
            filter((id): id is string => id !== null),
            map((id) => this.routesBuilderService.controlSchemeView(id))
        ).subscribe((route) => {
            this.router.navigate(route);
        });
    }

    public onDelete(): void {
        this.confirmationDialogService.confirm(
            this.translocoService.selectTranslate('controlScheme.deleteBindingConfirmationTitle'),
            {
                content$: this.translocoService.selectTranslate('controlScheme.deleteBindingConfirmationContent'),
                confirmTitle$: this.translocoService.selectTranslate('controlScheme.deleteBindingConfirmationConfirmButtonTitle'),
                cancelTitle$: this.translocoService.selectTranslate('controlScheme.deleteBindingConfirmationCancelButtonTitle')
            }
        ).pipe(
            take(1),
            concatLatestFrom(() => [
                this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId),
                this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedBindingId)
            ]),
        ).subscribe(([ isConfirmed, schemeId, bindingId ]) => {
            if (isConfirmed === false || schemeId === null || bindingId === null) {
                return;
            }
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.deleteBinding({ schemeId, bindingId }));

            const route = this.routesBuilderService.controlSchemeView(schemeId);
            this.router.navigate(route);
        });
    }
}
