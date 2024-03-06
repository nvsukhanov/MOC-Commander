import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeGearboxBinding, ControllerInputModel, GearboxInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class GearboxBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Gearbox> {
    public extractInput(
        binding: ControlSchemeGearboxBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Gearbox> {
        const nextLevelInputId = controllerInputIdFn(binding.inputs[GearboxInputAction.NextGear]);
        const nextLevelInputResult = globalInput[nextLevelInputId];
        const prevLevelInputId = binding.inputs[GearboxInputAction.PrevGear];
        const prevLevelInputResult = prevLevelInputId ? globalInput[controllerInputIdFn(prevLevelInputId)] : null;
        const resetInputId = binding.inputs[GearboxInputAction.Reset];
        const resetInputResult = resetInputId ? globalInput[controllerInputIdFn(resetInputId)] : null;
        return {
            [GearboxInputAction.NextGear]: nextLevelInputResult ?? null,
            [GearboxInputAction.PrevGear]: prevLevelInputResult ?? null,
            [GearboxInputAction.Reset]: resetInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Gearbox>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Gearbox>
    ): boolean {
        return prevInput[GearboxInputAction.NextGear] !== nextInput[GearboxInputAction.NextGear]
            || prevInput[GearboxInputAction.PrevGear] !== nextInput[GearboxInputAction.PrevGear]
            || prevInput[GearboxInputAction.Reset] !== nextInput[GearboxInputAction.Reset];
    }

}
