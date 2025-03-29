import { Inject, Injectable } from '@angular/core';
import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { DeepPartial } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeModel, attachedIosIdFn } from '@app/store';

import { ControlSchemeDecompressorService } from './control-scheme-decompressor.service';
import { BINDING_VALIDATOR, IBindingValidator } from '../i-binding-validator';
import { PortConfigFormBuilderService } from '../port-config-form-builder.service';
import { ControlSchemeFormBuilderService } from '../control-scheme-form-builder.service';

export enum ControlSchemeImportValidationErrors {
  CorruptedData = 'CorruptedData',
  CorruptedPortConfig = 'CorruptedPortConfig',
  MissingPortConfig = 'MissingPortConfig',
  CorruptedBindings = 'CorruptedBindings',
}

@Injectable()
export class ControlSchemeImportValidationService {
  constructor(
    private readonly commonFormBuilder: ControlSchemeFormBuilderService,
    private readonly portConfigFormBuilder: PortConfigFormBuilderService,
    private readonly decompressor: ControlSchemeDecompressorService,
    @Inject(BINDING_VALIDATOR) private readonly bindingValidator: IBindingValidator,
  ) {}

  public buildStringInputValidator(): ValidatorFn {
    return (control) => {
      let validationErrors: ValidationErrors | null = null;
      try {
        const model: DeepPartial<ControlSchemeModel> = this.decompressor.decompress(control.value);
        validationErrors = this.mergeValidationErrors(validationErrors, this.validateName(model.name));
        validationErrors = this.mergeValidationErrors(validationErrors, this.validatePortConfigs(model));
        validationErrors = this.mergeValidationErrors(validationErrors, this.validateBindings(model));
      } catch {
        validationErrors = this.mergeValidationErrors(validationErrors, {
          [ControlSchemeImportValidationErrors.CorruptedData]: true,
        });
      }
      return validationErrors;
    };
  }

  private validateName(name: string | undefined): ValidationErrors | null {
    const nameFormControl = this.commonFormBuilder.controlSchemeNameControl(false);
    nameFormControl.setValue(name ?? '');
    return nameFormControl.errors;
  }

  private validateBindings(controlScheme: DeepPartial<ControlSchemeModel>): ValidationErrors | null {
    if (!controlScheme.bindings || !Array.isArray(controlScheme.bindings)) {
      return { [ControlSchemeImportValidationErrors.CorruptedBindings]: true };
    }
    for (const binding of controlScheme.bindings) {
      if (!binding || binding.bindingType === undefined || !this.bindingValidator.isValid(binding)) {
        return { [ControlSchemeImportValidationErrors.CorruptedBindings]: true };
      }
    }
    return null;
  }

  private validatePortConfigs(controlScheme: DeepPartial<ControlSchemeModel>): ValidationErrors | null {
    if (!controlScheme.portConfigs || !controlScheme.bindings) {
      return { [ControlSchemeImportValidationErrors.CorruptedPortConfig]: true };
    }
    const requiresPortIdConfigsSet: Set<string> = new Set(
      (controlScheme.bindings ?? []).filter((b): b is ControlSchemeBinding => !!b).map((b) => attachedIosIdFn(b)),
    );

    for (const portConfig of controlScheme.portConfigs) {
      if (
        !portConfig ||
        portConfig.portId == undefined ||
        portConfig.hubId === undefined ||
        Number.isNaN(portConfig.portId)
      ) {
        return { [ControlSchemeImportValidationErrors.CorruptedPortConfig]: true };
      }
      const portConfigFormGroup = this.portConfigFormBuilder.build();
      portConfigFormGroup.patchValue(portConfig);
      if (portConfigFormGroup.invalid) {
        return { [ControlSchemeImportValidationErrors.CorruptedPortConfig]: true };
      }
      requiresPortIdConfigsSet.delete(attachedIosIdFn({ portId: portConfig.portId, hubId: portConfig.hubId }));
    }
    if (requiresPortIdConfigsSet.size) {
      return { [ControlSchemeImportValidationErrors.MissingPortConfig]: true };
    }
    return null;
  }

  private mergeValidationErrors(...errors: Array<ValidationErrors | null>): ValidationErrors | null {
    const result: ValidationErrors = {};
    errors.forEach((error) => {
      if (error) {
        Object.assign(result, error);
      }
    });
    return Object.keys(result).length ? result : null;
  }
}
