import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BindingFormResult, ControlSchemeEditFormComponent } from '../edit';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS } from '../../store';
import { Router } from '@angular/router';
import { RoutesBuilderService } from '../../routing';

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
        formResult: BindingFormResult
    ): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.create(formResult));
    }

    public onCancel(): void {
        this.router.navigate(this.routesBuilderService.controlSchemesList);
    }
}
