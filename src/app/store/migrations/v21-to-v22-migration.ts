import { DeepPartial } from '@app/shared';

import { V21Store } from './v21-store';
import { IMigration } from './i-migration';
import { AppStoreVersion } from '../app-store-version';
import { V22Store } from './v22-store';

export class V21ToV22Migration implements IMigration<V21Store, V22Store> {
    public readonly fromVersion = AppStoreVersion.v21;

    public readonly toVersion = AppStoreVersion.v22;

    public migrate(
        prev: DeepPartial<V21Store>
    ): DeepPartial<V22Store> {
        const result: DeepPartial<V22Store> = {
            ...prev,
            settings: {}
        };
        if (prev?.settings?.theme !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result.settings!.appTheme = prev.settings.theme;
        }
        if (prev?.settings?.language !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result.settings!.language = prev.settings.language;
        }
        result.storeVersion = this.toVersion;
        return result;
    }
}
