import { Language } from '@app/shared-misc';

export enum UserSelectedTheme {
    System,
    Dark,
    Light
}

export type SettingsModel = {
    appTheme: UserSelectedTheme;
    language: Language;
};
