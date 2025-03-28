import { Override } from '@app/shared-misc';

import { V29Store } from '../v29-v30';
import { AppStoreVersion } from '../../app-store-version';

export type V29Settings = V29Store['settings'];
export type V28Settings = Omit<V29Settings, 'useLinuxCompat'>;

export type V28Store = Override<
  V29Store,
  {
    settings: V28Settings;
    storeVersion: AppStoreVersion.v28;
  }
>;
