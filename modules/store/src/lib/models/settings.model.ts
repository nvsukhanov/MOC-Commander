import { Language } from '@app/shared-i18n';

export enum UserSelectedTheme {
    System,
    Dark,
    Light
}

export type SettingsModel = {
    appTheme: UserSelectedTheme;
    language: Language | null; // null is set initially to trigger language detection effect, see DETECT_LANGUAGE_EFFECT
};
