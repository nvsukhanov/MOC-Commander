import { Pipe, PipeTransform } from '@angular/core';

import { SchemeRunBlocker } from './scheme-run-blocker';

@Pipe({
    standalone: true,
    name: 'runBlockerL10n',
    pure: true
})
export class RunBlockerL10nPipe implements PipeTransform {
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
