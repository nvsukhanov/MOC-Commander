import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, DeepPartial, WidgetType } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { IMigration } from '../i-migration';
import {
    GearboxBindingInputAction,
    InputPipeType,
    ServoBindingInputAction,
    SetAngleBindingInputAction,
    SpeedBindingInputAction,
    StepperBindingInputAction,
    TrainBindingInputAction
} from '../../models';
import { V31Store } from '../v31';
import {
    OLD_TITLE_WIDGET_TYPE,
    OldInputGain,
    OldTiltWidgetConfigModel,
    V30ControlSchemesEntitiesState,
    V30GearboxBinding,
    V30InputConfig,
    V30ServoBinding,
    V30SetAngleBinding,
    V30SpeedBinding,
    V30StepperBinding,
    V30Store,
    V30TrainBinding,
    V30WidgetConfigModel,
    V31Binding,
    V31GearboxBinding,
    V31InputConfig,
    V31ServoBinding,
    V31SetAngleBinding,
    V31SpeedBinding,
    V31StepperBinding,
    V31TrainBinding,
    V31WidgetConfigModel
} from './v30-store';

@Injectable()
export class V30ToV31MigrationService implements IMigration<V30Store, V31Store> {
    public readonly fromVersion = AppStoreVersion.v30;

    public readonly toVersion = AppStoreVersion.v31;

    public migrate(
        prev: DeepPartial<V30Store>
    ): DeepPartial<V31Store> {
        const controlSchemes = prev.controlSchemes;
        if (!controlSchemes) {
            return {
                ...prev,
                controlSchemes: {},
                storeVersion: AppStoreVersion.v31
            };
        }
        const result: DeepPartial<V31Store> = {
            ...prev,
            controlSchemes: {
                ...controlSchemes,
                entities: {}
            },
            storeVersion: AppStoreVersion.v31
        };
        const controlSchemeEntities = Object.entries(controlSchemes.entities ?? {});
        controlSchemeEntities.forEach(([ k, controlScheme ]: [ string, V30ControlSchemesEntitiesState | undefined ]) => {
            if (!controlScheme) {
                return;
            }
            const bindings: V31Binding[] = controlScheme.bindings.map((b) => {
                switch (b.bindingType) {
                    case ControlSchemeBindingType.Speed:
                        return this.migrateSpeed(b);
                    case ControlSchemeBindingType.Servo:
                        return this.migrateServo(b);
                    case ControlSchemeBindingType.SetAngle:
                        return this.migrateSetAngle(b);
                    case ControlSchemeBindingType.Stepper:
                        return this.migrateStepper(b);
                    case ControlSchemeBindingType.Train:
                        return this.migrateTrain(b);
                    case ControlSchemeBindingType.Gearbox:
                        return this.migrateGearbox(b);
                }
            });

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result.controlSchemes!.entities![k] = {
                ...controlScheme,
                bindings,
                widgets: this.migrateWidgets(controlScheme.widgets)
            };
        });
        return result;
    }

    private migrateGearbox(
        b: V30GearboxBinding
    ): V31GearboxBinding {
        const result: V31GearboxBinding = {
            ...b,
            inputs: {
                [GearboxBindingInputAction.NextGear]: this.trimGain(b.inputs[GearboxBindingInputAction.NextGear])
            }
        };
        if (b.inputs[GearboxBindingInputAction.PrevGear]) {
            result.inputs[GearboxBindingInputAction.PrevGear] = this.trimGain(b.inputs[GearboxBindingInputAction.PrevGear]);
        }
        if (b.inputs[GearboxBindingInputAction.Reset]) {
            result.inputs[GearboxBindingInputAction.Reset] = this.trimGain(b.inputs[GearboxBindingInputAction.Reset]);
        }
        return result;
    }

    private migrateTrain(
        b: V30TrainBinding
    ): V31TrainBinding {
        const bindingResult: V31TrainBinding = {
            ...b,
            inputs: {
                [TrainBindingInputAction.NextSpeed]: this.trimGain(b.inputs[TrainBindingInputAction.NextSpeed])
            }
        };
        if (b.inputs[TrainBindingInputAction.PrevSpeed]) {
            bindingResult.inputs[TrainBindingInputAction.PrevSpeed] = this.trimGain(b.inputs[TrainBindingInputAction.PrevSpeed]);
        }
        if (b.inputs[TrainBindingInputAction.Reset]) {
            bindingResult.inputs[TrainBindingInputAction.Reset] = this.trimGain(b.inputs[TrainBindingInputAction.Reset]);
        }
        return bindingResult;
    }

    private migrateSetAngle(
        b: V30SetAngleBinding
    ): V31SetAngleBinding {
        return {
            ...b,
            inputs: {
                [SetAngleBindingInputAction.SetAngle]: this.trimGain(b.inputs[SetAngleBindingInputAction.SetAngle])
            }
        };
    }

    private migrateServo(
        b: V30ServoBinding
    ): V31ServoBinding {
        const bindingResult: V31ServoBinding = {
            ...b,
            inputs: {}
        };
        if (b.inputs[ServoBindingInputAction.Cw]) {
            bindingResult.inputs[ServoBindingInputAction.Cw] = this.migrateInput(b.inputs[ServoBindingInputAction.Cw]);
        }
        if (b.inputs[ServoBindingInputAction.Ccw]) {
            bindingResult.inputs[ServoBindingInputAction.Ccw] = this.migrateInput(b.inputs[ServoBindingInputAction.Ccw]);
        }
        return bindingResult;
    }

    private migrateSpeed(
        b: V30SpeedBinding
    ): V31SpeedBinding {
        const bindingResult: V31SpeedBinding = {
            ...b,
            inputs:{}
        };
        if (b.inputs[SpeedBindingInputAction.Brake]) {
            bindingResult.inputs[SpeedBindingInputAction.Brake] = this.migrateInput(b.inputs[SpeedBindingInputAction.Brake]);
        }
        if (b.inputs[SpeedBindingInputAction.Forwards]) {
            bindingResult.inputs[SpeedBindingInputAction.Forwards] = this.migrateInput(b.inputs[SpeedBindingInputAction.Forwards]);
        }
        return bindingResult;
    }

    private migrateStepper(
        b: V30StepperBinding
    ): V31StepperBinding {
        const bindingResult: V31StepperBinding = {
            ...b,
            inputs: {}
        };
        if (b.inputs[StepperBindingInputAction.Cw]) {
            bindingResult.inputs[StepperBindingInputAction.Cw] = this.trimGain(b.inputs[StepperBindingInputAction.Cw]);
        }
        if (b.inputs[StepperBindingInputAction.Ccw]) {
            bindingResult.inputs[StepperBindingInputAction.Ccw] = this.trimGain(b.inputs[StepperBindingInputAction.Ccw]);
        }
        return bindingResult;
    }

    private migrateInput(
        input: V30InputConfig
    ): V31InputConfig {
        const { gain, ...rest } = input;
        switch (gain) {
            case OldInputGain.Exponential:
                return {
                    ...rest,
                    inputPipes: [{
                        type: InputPipeType.ExponentialGain,
                    }]
                };
            case OldInputGain.Logarithmic:
                return {
                    ...rest,
                    inputPipes: [{
                        type: InputPipeType.LogarithmicGain,
                    }]
                };
            case OldInputGain.Linear:
                return {
                    ...rest,
                    inputPipes: []
                };
        }
    }

    private trimGain(
        input: V30InputConfig
    ): V31InputConfig {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { gain, ...rest } = input;
        return {
            ...rest,
            inputPipes: []
        };
    }

    private migrateWidgets(
        widgets: V30WidgetConfigModel[]
    ): V31WidgetConfigModel[] {
        const result: V31WidgetConfigModel[] = [];
        let id = 1;
        widgets.forEach((w) => {
            if (this.isOldTiltWidget(w)) {
                result.push({
                    widgetType: WidgetType.Pitch,
                    hubId: w.hubId,
                    portId: w.portId,
                    modeId: w.modeId,
                    valueChangeThreshold: w.valueChangeThreshold,
                    title: 'Pitch',
                    id: id++,
                    width: 1,
                    height: 1,
                    invert: w.invertPitch
                });
                result.push({
                    widgetType: WidgetType.Roll,
                    hubId: w.hubId,
                    portId: w.portId,
                    modeId: w.modeId,
                    valueChangeThreshold: w.valueChangeThreshold,
                    title: 'Roll',
                    id: id++,
                    width: 1,
                    height: 1,
                    invert: w.invertRoll
                });
                result.push({
                    widgetType: WidgetType.Yaw,
                    hubId: w.hubId,
                    portId: w.portId,
                    modeId: w.modeId,
                    valueChangeThreshold: w.valueChangeThreshold,
                    title: 'Yaw',
                    id: id++,
                    width: 1,
                    height: 1,
                    invert: w.invertYaw
                });
            } else {
                result.push({
                    ...w,
                    id: id++
                });
            }
        });
        return result;
    }

    private isOldTiltWidget(
        w: V30WidgetConfigModel
    ): w is OldTiltWidgetConfigModel {
        return w.widgetType === OLD_TITLE_WIDGET_TYPE;
    }
}
