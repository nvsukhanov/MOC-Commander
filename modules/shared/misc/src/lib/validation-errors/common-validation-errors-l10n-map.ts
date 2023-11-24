import { ValidationErrorsL10nMap } from './validation-errors-l10n-map';
import { GlobalValidationErrors } from './global-validation-errors';

export const COMMON_VALIDATION_ERRORS_L10N_MAP: ValidationErrorsL10nMap = {
    [GlobalValidationErrors.required]: 'validation.required',
    [GlobalValidationErrors.max]: 'validation.max',
    [GlobalValidationErrors.min]: 'validation.min',
    [GlobalValidationErrors.minlength]: 'validation.minLength',
    [GlobalValidationErrors.valueShouldNotBeZero]: 'validation.valueShouldNotBeZero',
    [GlobalValidationErrors.valueShouldBeInteger]: 'validation.valueShouldBeInteger'
} as const;
