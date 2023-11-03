import { PortModeName } from 'rxpoweredup';
import { WidgetType } from '@app/store';

const WIDGET_IO_MATCH_FNS: { [k in WidgetType]: (modes: PortModeName[]) => PortModeName | null } = {
    [WidgetType.Voltage]: (modes) => {
        if (modes.includes(PortModeName.voltageL)) {
            return PortModeName.voltageL;
        }
        if (modes.includes(PortModeName.voltageS)) {
            return PortModeName.voltageS;
        }
        return null;
    },
    [WidgetType.Tilt]: (modes) => {
        if (modes.includes(PortModeName.position) && modes.includes(PortModeName.impact)) {
            return PortModeName.position;
        }
        return null;
    },
    [WidgetType.Temperature]: (modes) => {
        if (modes.includes(PortModeName.temperature)) {
            return PortModeName.temperature;
        }
        return null;
    }
};

export function getWidgetDataPortModeName(
    widgetType: WidgetType,
    portInputModeNames: PortModeName[],
): PortModeName | null {
    return WIDGET_IO_MATCH_FNS[widgetType](portInputModeNames);
}
