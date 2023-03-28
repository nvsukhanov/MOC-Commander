import { ChangeDetectionStrategy, Component, ComponentRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ControllerState, GamepadControllerConfig } from '../../store';
import { JsonPipe, NgIf } from '@angular/common';
import { GamepadPluginsService } from '../../plugins';
import { GamepadView } from '../../plugins/gamepads/gamepad-view';

@Component({
    standalone: true,
    selector: 'app-controller-gamepad-view',
    templateUrl: './controller-gamepad-view.component.html',
    styleUrls: [ './controller-gamepad-view.component.scss' ],
    imports: [
        JsonPipe,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerGamepadViewComponent {
    @ViewChild('gamepadView', { read: ViewContainerRef, static: true }) public viewContainer!: ViewContainerRef;

    private gamepadViewComponentRef?: ComponentRef<GamepadView>;

    private gamepadControllerConfig?: GamepadControllerConfig;

    private gamepadControllerState?: ControllerState;

    constructor(
        private readonly gamepadPlugins: GamepadPluginsService,
    ) {
    }

    @Input()
    public set controllerConfig(config: GamepadControllerConfig | null) {
        this.gamepadViewComponentRef?.destroy();
        if (config) {
            const plugin = this.gamepadPlugins.getPlugin(config.id);
            this.gamepadViewComponentRef = this.viewContainer.createComponent(plugin.configViewType);
            this.gamepadControllerConfig = config;
            this.gamepadViewComponentRef.instance.writeConfiguration(config);
            if (this.gamepadControllerState) {
                this.gamepadViewComponentRef.instance.writeGamepadState(this.gamepadControllerState);
            }
        }
    }

    @Input()
    public set controllerState(state: ControllerState | undefined) {
        const guardedState = state ?? { axes: {}, buttons: {} };
        if (this.gamepadViewComponentRef) {
            this.gamepadControllerState = guardedState;
            this.gamepadViewComponentRef.instance.writeGamepadState(guardedState);
        }
    }
}
