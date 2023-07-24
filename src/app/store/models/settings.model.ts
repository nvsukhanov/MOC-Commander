export enum UserSelectedTheme {
    System,
    Dark,
    Light
}

export type SettingsModel = {
    theme: UserSelectedTheme;
};
