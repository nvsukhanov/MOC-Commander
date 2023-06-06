import { L10nScopes, composeL10nKey } from '../../i18n';

export function createScopedControllerL10nKey(
    scope: string,
    key: string
): string {
    return `${createControllerL10nKey(scope)}.${key}`;
}

export function createControllerL10nKey(
    key: string
): string {
    return composeL10nKey(L10nScopes.controllerPlugins, key);
}
