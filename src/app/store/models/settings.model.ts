import { Language } from '@app/shared';

export enum UserSelectedTheme {
    System,
    Dark,
    Light
}

export type SettingsModel = {
    theme: UserSelectedTheme;
    language: Language;
};
