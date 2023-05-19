import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';
import { PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { BindingFormResult, ControlSchemeEditFormComponent } from '../edit';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS } from '../../store';
import { FeatureContentContainerComponent, FeatureToolbarComponent } from '../../common';
import { RouterLink } from '@angular/router';
import { ROUTE_PATHS } from '../../routes';

@Component({
    standalone: true,
    selector: 'app-control-scheme',
    templateUrl: './control-scheme-create.component.html',
    styleUrls: [ './control-scheme-create.component.scss' ],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        NgIf,
        PushModule,
        TranslocoModule,
        ControlSchemeEditFormComponent,
        FeatureToolbarComponent,
        FeatureContentContainerComponent,
        RouterLink
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeCreateComponent {
    public readonly cancelRoute = ROUTE_PATHS.controlSchemeList;

    constructor(
        private readonly store: Store,
    ) {
    }

    public onSave(formResult: BindingFormResult): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.create(formResult));
    }
}
