import { DeepPartial } from '@app/shared-misc';

import { V21Store } from './v21-store';
import { IMigration } from '../i-migration';
import { AppStoreVersion } from '../../app-store-version';
import { V22Store } from '../v22-v23';

export class V21ToV22MigrationService implements IMigration<V21Store, V22Store> {
    public readonly fromVersion = AppStoreVersion.v21;

    public readonly toVersion = AppStoreVersion.v22;

    public migrate(
        prev: DeepPartial<V21Store>
    ): DeepPartial<V22Store> {
        const result: DeepPartial<V22Store> = {
            ...prev,
            settings: {},
            storeVersion: this.toVersion
        };
        if (prev?.settings?.theme !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result.settings!.appTheme = prev.settings.theme;
        }
        if (prev?.settings?.language !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result.settings!.language = prev.settings.language;
        }
        return result;
    }
}
