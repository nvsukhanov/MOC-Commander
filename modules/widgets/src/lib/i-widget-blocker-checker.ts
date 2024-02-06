import { PortModeName } from 'rxpoweredup';

export interface IWidgetBlockerChecker {
    canBeUsedWithInputModes(
        portModes: PortModeName[]
    ): boolean;
}
