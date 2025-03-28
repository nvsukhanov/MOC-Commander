import { EntityState } from '@ngrx/entity';
import { ControlSchemeBindingType, ExtractArrayType, ExtractEntitiesType, Override } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { V24Store } from '../v24-v25/v24-store';

export type V24ControlSchemesEntitiesState = ExtractEntitiesType<V24Store['controlSchemes']>;
export type V24Bindings = ExtractArrayType<V24ControlSchemesEntitiesState['bindings']>;
export type V24ServoBinding = V24Bindings & { bindingType: ControlSchemeBindingType.Servo };
export type V24BindingsWithoutServo = Exclude<V24Bindings, V24ServoBinding>;
export type V23ServoBinding = Omit<V24ServoBinding, 'calibrateOnStart'>;
export type V23Bindings = V24BindingsWithoutServo | V23ServoBinding;
export type V23ControlSchemesEntitiesState = Omit<V24ControlSchemesEntitiesState, 'bindings'> & {
  bindings: V23Bindings[];
};

export type V23Store = Override<
  V24Store,
  {
    controlSchemes: Omit<V24Store['controlSchemes'], 'entities'> & EntityState<V23ControlSchemesEntitiesState>;
    storeVersion: AppStoreVersion.v23;
  }
>;
