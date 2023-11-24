import { Actions, FunctionalEffect, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { WINDOW } from '@app/shared';

import { CONTROL_SCHEME_ACTIONS } from '../actions';

export const COPY_EXPORT_STRING_TO_CLIPBOARD = createEffect((
    actions: Actions = inject(Actions),
    window: Window = inject(WINDOW)
) => {
    return actions.pipe(
        ofType(CONTROL_SCHEME_ACTIONS.copyExportString),
        tap((action) => window.navigator.clipboard.writeText(action.exportString))
    );
}, { dispatch: false, functional: true });

export const CONTROL_SCHEME_EFFECTS: { [name: string]: FunctionalEffect } = {
    copyExportedStringToClipboard: COPY_EXPORT_STRING_TO_CLIPBOARD
};
