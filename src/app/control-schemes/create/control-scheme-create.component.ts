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
        ControlSchemeEditFormComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeCreateComponent {
    constructor(
        private readonly store: Store,
    ) {
    }

    public onSave(formResult: BindingFormResult): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.create(formResult));
    }
}
