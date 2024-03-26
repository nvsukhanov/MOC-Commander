import { SHOW_ERROR_NOTIFICATION_EFFECT } from './show-error-notification.effect';
import { SHOW_GENERIC_ERROR_NOTIFICATION_EFFECT } from './show-generic-error-notification.effect';
import { SHOW_INFO_NOTIFICATION_EFFECT } from './show-info-notification.effect';
import { SHOW_APP_UPDATED_NOTIFICATION_EFFECT } from './show-app-updated-notification.effect';

export const NOTIFICATION_EFFECTS = {
    showErrorNotification: SHOW_ERROR_NOTIFICATION_EFFECT,
    showGenericErrorNotification: SHOW_GENERIC_ERROR_NOTIFICATION_EFFECT,
    showInfoNotification: SHOW_INFO_NOTIFICATION_EFFECT,
    showAppUpdatedNotification: SHOW_APP_UPDATED_NOTIFICATION_EFFECT,
} as const;
