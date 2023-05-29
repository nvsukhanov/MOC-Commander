export enum L10nScopes {
    io = 'io',
    controllerPlugins = 'controllerPlugins',
    controller = 'controller'
}

export function composeL10nKey(
    scope: L10nScopes,
    key: string
): string {
    return `${scope}.${key}`;
}
