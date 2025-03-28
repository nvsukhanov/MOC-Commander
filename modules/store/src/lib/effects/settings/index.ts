import { FunctionalEffect } from '@ngrx/effects';

import { SET_LANGUAGE_EFFECT } from './set-language.effect';
import { SET_PAGE_LANGUAGE_EFFECT } from './set-page-language.effect';
import { CREATE_STATE_BACKUP_EFFECT } from './create-state-backup.effect';
import { RESTORE_STATE_FROM_BACKUP_EFFECT } from './restore-state-from-backup.effect';
import { RESET_STATE_EFFECT } from './reset-state.effect';
import { SET_THEME_EFFECT } from './set-theme.effect';
import { DETECT_LANGUAGE_EFFECT } from './detect-language.effect';
import { DETECT_LINUX_COMPAT_EFFECT } from './detect-linux-compat.effect';

export const SETTINGS_EFFECTS: { [k in string]: FunctionalEffect } = {
  setLanguage: SET_LANGUAGE_EFFECT,
  setPageLanguage: SET_PAGE_LANGUAGE_EFFECT,
  createStateBackup: CREATE_STATE_BACKUP_EFFECT,
  restoreStateFromBackup: RESTORE_STATE_FROM_BACKUP_EFFECT,
  resetState: RESET_STATE_EFFECT,
  setTheme: SET_THEME_EFFECT,
  detectLanguage: DETECT_LANGUAGE_EFFECT,
  detectLinuxCompat: DETECT_LINUX_COMPAT_EFFECT,
};
