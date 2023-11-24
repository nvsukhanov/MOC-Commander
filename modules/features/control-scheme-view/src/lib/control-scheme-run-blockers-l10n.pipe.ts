import { Pipe, PipeTransform } from '@angular/core';

import { SchemeRunBlocker } from './types';

@Pipe({
    standalone: true,
    name: 'controlSchemeRunBlockersL10nPipe',
    pure: true
})
export class ControlSchemeRunBlockersL10nPipe implements PipeTransform {
    private readonly l10nKeysMap: { [k in SchemeRunBlocker]: string } = {
        [SchemeRunBlocker.SchemeDoesNotExist]: 'controlScheme.runBlockerSchemeDoesNotExist',
        [SchemeRunBlocker.AlreadyRunning]: 'controlScheme.runBlockerAlreadyRunning',
        [SchemeRunBlocker.SchemeBindingsDoesNotExist]: 'controlScheme.runBlockerBindingsDoesNotExist',
        [SchemeRunBlocker.SomeControllersAreNotConnected]: 'controlScheme.runBlockerSomeControllersAreNotConnected',
        [SchemeRunBlocker.SomeIosAreNotConnected]: 'controlScheme.runBlockerSomeIosAreNotConnected',
        [SchemeRunBlocker.SomeHubsAreNotConnected]: 'controlScheme.runBlockerSomeHubsAreNotConnected',
        [SchemeRunBlocker.SomeIosHaveNoRequiredCapabilities]: 'controlScheme.runBlockerSomeIosHaveNoRequiredCapabilities'
    };

    public transform(
        value: SchemeRunBlocker
    ): string {
        return this.l10nKeysMap[value];
    }
}
