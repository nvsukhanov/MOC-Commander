import { provideRouter } from '@angular/router';
import { ROUTES } from './routes';
import { EnvironmentProviders } from '@angular/core';

export function provideRouting(): EnvironmentProviders {
    return provideRouter(ROUTES);
}
