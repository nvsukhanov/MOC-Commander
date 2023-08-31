import { Language } from '../../i18n';

export enum UserSelectedTheme {
    System,
    Dark,
    Light
}

export type SettingsModel = {
    theme: UserSelectedTheme;
    language: Language;
};
