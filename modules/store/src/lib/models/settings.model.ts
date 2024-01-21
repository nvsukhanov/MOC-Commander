import { Language } from '@app/shared-i18n';

export enum UserSelectedTheme {
    System,
    Dark,
    Light
}

export type SettingsModel = {
    appTheme: UserSelectedTheme;
    language: Language;
};
