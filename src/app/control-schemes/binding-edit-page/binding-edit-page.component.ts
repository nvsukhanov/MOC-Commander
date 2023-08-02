import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map, switchMap, take } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { JsonPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { ConfirmationDialogModule, ConfirmationDialogService, FeatureToolbarControlsDirective } from '@app/shared';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeBinding, ROUTER_SELECTORS } from '@app/store';

import { BINDING_EDIT_PAGE_SELECTORS } from './binding-edit.selectors';
import { BindingEditComponent } from '../binding-edit';
import { BindingEditViewPageModel } from './binding-edit-view-page-model';
import { RoutesBuilderService } from '../../routing';

@Component({
    standalone: true,
    selector: 'app-binding-edit-page',
    templateUrl: './binding-edit-page.component.html',
    styleUrls: [ './binding-edit-page.component.scss' ],
    imports: [
        PushPipe,
        NgIf,
        JsonPipe,
        BindingEditComponent,
        MatButtonModule,
        TranslocoModule,
        FeatureToolbarControlsDirective,
        ConfirmationDialogModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingEditPageComponent {
    public readonly viewModel$: Observable<BindingEditViewPageModel | null>;

    constructor(
        private readonly store: Store,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly router: Router,
        private readonly confirmationDialogService: ConfirmationDialogService,
        private readonly translocoService: TranslocoService
    ) {
        this.viewModel$ = store.select(BINDING_EDIT_PAGE_SELECTORS.selectViewModel);
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
            filter((result): result is true => result === true),
            switchMap(() => this.viewModel$),
            take(1),
            filter((vm): vm is BindingEditViewPageModel => vm !== null),
        ).subscribe((vm) => {
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.deleteBinding({ schemeId: vm.controlSchemeId, bindingId: vm.binding.id }));

            const route = this.routesBuilderService.controlSchemeView(vm.controlSchemeId);
            this.router.navigate(route);
        });
    }
}
