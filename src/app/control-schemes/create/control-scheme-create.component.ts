import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CONTROL_SCHEME_ACTIONS } from '@app/store';

import { BindingFormResult, ControlSchemeEditFormComponent } from '../edit';
import { RoutesBuilderService } from '../../routing';
import { trimFormOutputBinding } from '../trim-form-output-binding';

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
        data: BindingFormResult
    ): void {
        const result = {
            id: data.id,
            name: data.name,
            bindings: data.bindings.map((i) => trimFormOutputBinding(i))
        };
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.create(result));
    }

    public onCancel(): void {
        this.router.navigate(this.routesBuilderService.controlSchemesList);
    }
}
