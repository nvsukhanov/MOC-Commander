import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DeepPartial, getEnumValues } from '@app/shared-misc';
import { AppStoreVersion, IState, MigrateStoreService } from '@app/store';

function isState(
    value: unknown
): value is DeepPartial<IState> {
    const storeVersions = getEnumValues(AppStoreVersion);
    // TODO: should be validated against the schema
    return typeof value === 'object' &&
        value !== null &&
        'storeVersion' in value &&
        storeVersions.includes((value as IState).storeVersion);
}

export const STATE_FILE_VALIDATION_ERRORS = {
    invalidFile: 'invalidFile',
    unsupportedStoreVersion: 'unsupportedStoreVersion',
};

export function createStateFileValidatorFn(
    migrationService: MigrateStoreService
): (control: AbstractControl<string>) => ValidationErrors | null {
    return (control: AbstractControl<string>): ValidationErrors | null => {
        const result: ValidationErrors = {};
        let parsedResult: unknown;
        try {
            parsedResult = JSON.parse(control.value);
        } catch {
            result[STATE_FILE_VALIDATION_ERRORS.invalidFile] = true;
        }

        if (isState(parsedResult)) {
            try {
                migrationService.migrateToVersion(parsedResult, AppStoreVersion.latest);
            } catch {
                result[STATE_FILE_VALIDATION_ERRORS.unsupportedStoreVersion] = true;
            }
        } else {
            result[STATE_FILE_VALIDATION_ERRORS.invalidFile] = true;
        }

        return Object.keys(result).length ? result : null;
    };
}
