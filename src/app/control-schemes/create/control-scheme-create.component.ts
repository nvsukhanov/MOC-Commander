import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CONTROL_SCHEME_V2_ACTIONS } from '@app/store';

import { ControlSchemeEditForm, ControlSchemeEditFormComponent } from '../edit';
import { RoutesBuilderService } from '../../routing';
import { mapFormToModel } from '../map-form-to-model';

@Component({
    standalone: true,
    selector: 'app-control-scheme',
    templateUrl: './control-scheme-create.component.html',
    styleUrls: [ './control-scheme-create.component.scss' ],
    imports: [
        ControlSchemeEditFormComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeCreateComponent {
    constructor(
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly router: Router,
        private readonly store: Store
    ) {
    }

    public onSave(
        form: ControlSchemeEditForm
    ): void {
        this.store.dispatch(CONTROL_SCHEME_V2_ACTIONS.create({
            scheme: mapFormToModel(form)
        }));
        this.router.navigate(this.routesBuilderService.controlSchemesList);
    }

    public onCancel(): void {
        this.router.navigate(this.routesBuilderService.controlSchemesList);
    }
}
