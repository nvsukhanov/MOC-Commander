import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, createSelector } from '@ngrx/store';
import { PortModeName } from 'rxpoweredup';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    WidgetType,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn,
    attachedIosIdFn
} from '@app/store';

import { AddWidgetDialogViewModel, WidgetDefaultConfigFactoryService, ioHasMatchingModeForWidget } from '../components';

@Injectable()
export class AddWidgetDialogViewModelProvider {
    private readonly availableWidgetTypes: WidgetType[] = [
        WidgetType.Voltage
    ];

    constructor(
        private readonly store: Store,
        private readonly widgetDefaultConfigFactory: WidgetDefaultConfigFactoryService
    ) {
    }

    public getAddWidgetDialogViewModel(
        controlSchemeName: string
    ): Observable<AddWidgetDialogViewModel> {
        return this.store.select(this.selectAvailableWidgets(controlSchemeName));
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private readonly selectAvailableWidgets = (controlSchemeName: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(controlSchemeName),
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (controlScheme, attachedIos, ioPortModes, portModesInfo): AddWidgetDialogViewModel => {
            const result: AddWidgetDialogViewModel = {
                controlSchemeName,
                widgets: []
            };
            if (!controlScheme) {
                return result;
            }

            // There are certain limitations on IO value reading: only one IO mode can be used at a time.
            // This means that if an IO is used for a widget, it cannot be re-used for another widget.
            // And if an IO is used for a binding, it also cannot be used for a widget due to output mode not strictly matching to input mode.

            const existingIoWidgetIds = new Set(controlScheme.widgets.map((widget) => attachedIosIdFn(widget)));
            const iosWithoutWidgets = attachedIos.filter((attachedIo) => !existingIoWidgetIds.has(attachedIosIdFn(attachedIo)));

            const controlledIosIds = new Set(controlScheme.bindings.map((binding) => attachedIosIdFn(binding)));
            const remainingIos = iosWithoutWidgets.filter((attachedIo) => !controlledIosIds.has(attachedIosIdFn(attachedIo)));

            for (const io of remainingIos) {
                const portInputModes = (ioPortModes[attachedIoModesIdFn(io)]?.portInputModes ?? []).map((modeId) => {
                    return portModesInfo[attachedIoPortModeInfoIdFn({ ...io, modeId })]?.name;
                }).filter((mode): mode is PortModeName => !!mode);
                const availableIoWidgetTypes = this.availableWidgetTypes.filter((widgetType) => {
                    return ioHasMatchingModeForWidget(widgetType, portInputModes);
                });
                for (const widgetType of availableIoWidgetTypes) {
                    const defaultConfig = this.widgetDefaultConfigFactory.createDefaultConfig(widgetType, io.hubId, io.portId);
                    result.widgets.push(defaultConfig);
                }
            }
            return result;
        }
    );
}
