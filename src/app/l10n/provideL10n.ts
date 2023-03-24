import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { L10nService } from './l10n.service';

export function provideL10n(): EnvironmentProviders {
    return makeEnvironmentProviders([
        L10nService
    ]);
}
