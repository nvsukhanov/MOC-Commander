import { EntityState } from '@ngrx/entity';
import { ExtractEntitiesType, Override } from '@app/shared-misc';

import { AppStoreVersion } from '../app-store-version';
import { V25Store } from './v25-store';

export type V25ControlSchemesEntitiesState = ExtractEntitiesType<V25Store['controlSchemes']>;
export type V24ControlSchemeModelWithoutWidgets = Omit<V25ControlSchemesEntitiesState, 'widgets'>;

export type V24Store = Override<V25Store, {
    controlSchemes: Omit<V25Store['controlSchemes'], 'entities'> & EntityState<V24ControlSchemeModelWithoutWidgets>;
    storeVersion: AppStoreVersion.v24;
}>;
