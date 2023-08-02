import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, of, take } from 'rxjs';
import { Router } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeBinding, ROUTER_SELECTORS } from '@app/store';
import { FeatureToolbarControlsDirective } from '@app/shared';

import { RoutesBuilderService } from '../../routing';
import { BINDING_EDIT_SELECTORS, BindingEditAvailableOperationModesModel, BindingEditComponent } from '../binding-edit';

@Component({
    standalone: true,
    selector: 'app-binding-create-page',
    templateUrl: './binding-create-page.component.html',
    styleUrls: [ './binding-create-page.component.scss' ],
    imports: [
        BindingEditComponent,
        PushPipe,
        NgIf,
        MatButtonModule,
        TranslocoModule,
        FeatureToolbarControlsDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingCreatePageComponent {
    public readonly availabilityData$: Observable<BindingEditAvailableOperationModesModel> = of({});

    constructor(
        private readonly store: Store,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly router: Router
    ) {
        this.availabilityData$ = this.store.select(BINDING_EDIT_SELECTORS.selectBindingEditAvailableOperationModes);
    }

    public onCancel(): void {
        this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
            take(1),
            filter((schemeId): schemeId is string => (schemeId) !== null)
        ).subscribe((schemeId) => {
            this.router.navigate(
                this.routesBuilderService.controlSchemeView(schemeId)
            );
        });
    }

    public onSave(
        binding: ControlSchemeBinding
    ): void {
        this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
            take(1),
            filter((schemeId): schemeId is string => (schemeId) !== null)
        ).subscribe((schemeId) => {
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.createBinding({
                schemeId,
                binding
            }));
            this.router.navigate(
                this.routesBuilderService.controlSchemeView(schemeId)
            );
        });
    }
}
