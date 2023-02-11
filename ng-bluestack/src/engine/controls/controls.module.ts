import { NgModule } from '@angular/core';
import { GamepadConnectListener, ExampleGamepadProfileService, GamepadMapperFactoryService } from './gamepad';

@NgModule({
    providers: [
        GamepadConnectListener,
        GamepadMapperFactoryService,
        ExampleGamepadProfileService
    ]
})
export class ControlsModule {
}
