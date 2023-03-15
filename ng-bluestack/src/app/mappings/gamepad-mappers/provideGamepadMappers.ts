import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { GAMEPAD_MAPPER } from '../../store';
import { SonyDualshockMapperService } from './sony-dualshock-mapper.service';

export function provideGamepadMappers(): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: GAMEPAD_MAPPER, useClass: SonyDualshockMapperService, multi: true }
    ])
}
