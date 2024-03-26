import { IState } from '../../i-state';
import { AppStoreVersion } from '../../app-store-version';

export type V32Store = IState & {
    storeVersion: AppStoreVersion.v32;
};

