import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { EnvironmentProviders } from '@angular/core';

import { ROUTES } from './routes';

export function provideRouting(): EnvironmentProviders {
    return provideRouter(ROUTES, withPreloading(PreloadAllModules));
}
