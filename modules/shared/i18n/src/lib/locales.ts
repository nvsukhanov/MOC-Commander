import { Language } from './language';

export const LOCALES: { [k in Language]: string } = {
    [Language.English]: 'en-Us',
    [Language.Russian]: 'ru-Ru'
};

export const BROWSER_LANGUAGES: { [k in string]: Language } = {
    en: Language.English,
    ru: Language.Russian
};

export const DEFAULT_LANGUAGE = Language.English;
