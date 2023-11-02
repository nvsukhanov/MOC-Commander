import { PortModeName } from 'rxpoweredup';
import { WidgetType } from '@app/store';

const WIDGET_IO_MATCH_FNS: { [k in WidgetType]: (modes: PortModeName[]) => boolean } = {
    [WidgetType.Voltage]: (modes) => modes.some((mode) => mode === PortModeName.voltageL || mode === PortModeName.voltageS),
    [WidgetType.Tilt]: (modes) => modes.includes(PortModeName.position) && modes.includes(PortModeName.impact)
};

export function ioHasMatchingModeForWidget(
    widgetType: WidgetType,
    portInputModeNames: PortModeName[],
): boolean {
    return WIDGET_IO_MATCH_FNS[widgetType](portInputModeNames);
}
