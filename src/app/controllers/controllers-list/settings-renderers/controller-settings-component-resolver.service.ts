import { Injectable, Type } from '@angular/core';
import { ControllerType } from '@app/shared';
import { ControllerSettingsModel } from '@app/store';

import { IControllerSettingsRenderer } from './i-controller-settings-renderer';
import { GamepadSettingsComponent } from './gamepad';
import { KeyboardsSettingsComponent } from './keyboard';
import { HubControllerSettingsComponent } from './hub';

type InferControllerSettings<T extends ControllerType> = ControllerSettingsModel & { controllerType: T };

@Injectable({ providedIn: 'root' })
export class ControllerSettingsComponentResolverService {
    private renderers: { [k in ControllerType]?: Type<IControllerSettingsRenderer<InferControllerSettings<k>>> } = {
        [ControllerType.Keyboard]: KeyboardsSettingsComponent,
        [ControllerType.Gamepad]: GamepadSettingsComponent,
        [ControllerType.Hub]: HubControllerSettingsComponent
    };

    public resolveComponentFor<T extends ControllerType>(
        controllerType: T
    ): Type<IControllerSettingsRenderer<InferControllerSettings<T>>> | null {
        return this.renderers[controllerType] ?? null;
    }
}
