import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';

import { SETTINGS_ACTIONS } from '../../actions';

export const CREATE_STATE_BACKUP_EFFECT = createEffect((
    actions$: Actions = inject(Actions),
    document: Document = inject(DOCUMENT),
    store: Store = inject(Store)
) => {
    return actions$.pipe(
        ofType(SETTINGS_ACTIONS.createStateBackup),
        concatLatestFrom(() => store),
        tap(([ , state ]) => {
            const a = document.createElement('a');
            const blob = new Blob([ JSON.stringify(state) ], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            a.setAttribute('href', url);
            const fileName = `state-${new Date().toISOString()}.json`;
            a.setAttribute('download', fileName);
            a.click();
        })
    );
}, { functional: true, dispatch: false });
