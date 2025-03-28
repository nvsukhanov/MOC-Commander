export enum L10nScopes {
  io = 'io',
  controllerProfiles = 'controllerProfiles',
  controller = 'controller',
  motorServoEndState = 'motorServoEndState',
}

export function composeL10nKey(scope: L10nScopes, key: string): string {
  return `${scope}.${key}`;
}
