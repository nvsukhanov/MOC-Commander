import { Language } from '@app/shared-i18n';

export enum UserSelectedTheme {
  System,
  Dark,
  Light,
}

export enum GamepadPollingRate {
  Default,
  Low,
}

export type SettingsModel = {
  appTheme: UserSelectedTheme;
  language: Language | null; // null is set initially to trigger language detection effect, see DETECT_LANGUAGE_EFFECT
  useLinuxCompat: boolean | null; // null is set initially to trigger linux compat detection effect, see DETECT_LINUX_COMPAT_EFFECT
  gamepadPollingRate: GamepadPollingRate;
};
