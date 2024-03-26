import { Override } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { V32Store } from '../v32';

export type V31Settings = Omit<V32Store['settings'], 'gamepadPollingRate'>;

export type V31Store = Override<V32Store, {
    settings: V31Settings;
    storeVersion: AppStoreVersion.v31;
}>;
