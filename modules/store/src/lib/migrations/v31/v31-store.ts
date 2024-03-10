import { IState } from '../../i-state';
import { AppStoreVersion } from '../../app-store-version';

export type V31Store = IState & {
    storeVersion: AppStoreVersion.latest;
};
