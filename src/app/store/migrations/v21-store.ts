import { AppStoreVersion, IState, UserSelectedTheme } from '@app/store';
import { Language, Override } from '@app/shared';

export type V21Store = Override<IState, {
    settings: {
        theme: UserSelectedTheme;
        language: Language;
    };
    storeVersion: AppStoreVersion.v21;
}>;
