import { FunctionalEffect } from '@ngrx/effects';

import { SET_LANGUAGE_EFFECT } from './set-language.effect';
import { SET_PAGE_LANGUAGE_EFFECT } from './set-page-language.effect';
import { CREATE_STATE_BACKUP_EFFECT } from './create-state-backup.effect';
import { RESTORE_STATE_FROM_BACKUP_EFFECT } from './restore-state-from-backup.effect';

export const SETTINGS_EFFECTS: { [k in string]: FunctionalEffect } = {
    setLanguage: SET_LANGUAGE_EFFECT,
    setPageLanguage: SET_PAGE_LANGUAGE_EFFECT,
    createStateBackup: CREATE_STATE_BACKUP_EFFECT,
    restoreStateFromBackup: RESTORE_STATE_FROM_BACKUP_EFFECT
};
