import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Observable, of, switchMap } from 'rxjs';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { NotFoundComponent } from '../../../common';
import { HUBS_ACTIONS, HUBS_SELECTORS, HUB_EDIT_FORM_ACTIVE_SAVES_SELECTORS, ROUTER_SELECTORS } from '../../../store';
import { HubEditFormComponent, HubEditFormSaveResult } from '../hub-edit-form';

@Component({
    standalone: true,
    selector: 'app-hub-edit',
    templateUrl: './hub-edit.component.html',
    styleUrls: [ './hub-edit.component.scss' ],
    imports: [
        HubEditFormComponent,
        PushPipe,
        LetDirective,
        NgIf,
        NotFoundComponent,
        TranslocoModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubEditComponent {
    public readonly editedHubConfiguration$ = this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedHubId).pipe(
        switchMap((id) => id !== null ? this.store.select(HUBS_SELECTORS.selectHub(id)) : of(null))
    );

    public readonly isSaving$: Observable<boolean> = this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedHubId).pipe(
        switchMap((id) => id !== null ? this.store.select(HUB_EDIT_FORM_ACTIVE_SAVES_SELECTORS.isSaveInProgress(id)) : of(false))
    );

    constructor(
        private readonly store: Store
    ) {
    }

    public onSave(data: HubEditFormSaveResult): void {
        this.store.dispatch(HUBS_ACTIONS.requestSetHubName({ name: data.name, hubId: data.hubId }));
    }
}
