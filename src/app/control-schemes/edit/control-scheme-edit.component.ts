import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlScheme, ROUTER_SELECTORS } from '../../store';
import { Observable, of, switchMap } from 'rxjs';
import { BindingFormResult, ControlSchemeEditFormComponent } from './edit-form';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslocoModule } from '@ngneat/transloco';
import { JsonPipe, NgIf } from '@angular/common';
import { PushModule } from '@ngrx/component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FeatureContentContainerComponent, FeatureToolbarComponent } from '../../common';

@Component({
    standalone: true,
    selector: 'app-control-scheme',
    templateUrl: './control-scheme-edit.component.html',
    styleUrls: [ './control-scheme-edit.component.scss' ],
    imports: [
        ControlSchemeEditFormComponent,
        MatToolbarModule,
        TranslocoModule,
        NgIf,
        PushModule,
        MatCardModule,
        JsonPipe,
        MatButtonModule,
        RouterLink,
        FeatureContentContainerComponent,
        FeatureToolbarComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditComponent {
    public readonly currentlyEditedScheme$: Observable<ControlScheme | undefined> = this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
        switchMap((i) => i === null ? of(undefined) : this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(i)))
    );

    public readonly isSchemeRunning$: Observable<boolean> = this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
        switchMap((i) => i === null ? of(false) : this.store.select(CONTROL_SCHEME_SELECTORS.isSchemeRunning(i)))
    );

    constructor(
        private readonly store: Store
    ) {

    }

    public onSave(data: BindingFormResult): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.update(data));
    }
}
