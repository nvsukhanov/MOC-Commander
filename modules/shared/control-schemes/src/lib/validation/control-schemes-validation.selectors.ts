/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';
import { CONTROL_SCHEME_SELECTORS } from '@app/store';

export const CONTROL_SCHEMES_VALIDATION_SELECTORS = {
  selectControlSchemeNameIsNotUnique: (schemeName: string) =>
    createSelector(CONTROL_SCHEME_SELECTORS.selectAll, (schemes): boolean => schemes.some((scheme) => scheme.name === schemeName)),
};
