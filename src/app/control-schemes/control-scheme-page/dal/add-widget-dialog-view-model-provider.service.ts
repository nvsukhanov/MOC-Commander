import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, createSelector } from '@ngrx/store';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoPortModeInfoModel,
    CONTROL_SCHEME_SELECTORS,
    WidgetType,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn,
    attachedIosIdFn
} from '@app/store';
import { getEnumValues } from '@app/shared';

import { AddWidgetDialogViewModel, WidgetDefaultConfigFactoryService, getWidgetDataPortModeName } from '../components';

@Injectable()
export class AddWidgetDialogViewModelProvider {
    private readonly availableWidgetTypes: WidgetType[] = getEnumValues(WidgetType);

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

    public canAddWidgets(
        controlSchemeName: string
    ): Observable<boolean> {
        return this.store.select(this.selectCanAddWidgets(controlSchemeName));
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
                    return portModesInfo[attachedIoPortModeInfoIdFn({ ...io, modeId })];
                }).filter((modeInfo): modeInfo is AttachedIoPortModeInfoModel => !!modeInfo);

                for (const widgetType of this.availableWidgetTypes) {
                    const portModeName = getWidgetDataPortModeName(widgetType, portInputModes.map((info) => info.name));
                    if (!portModeName) {
                        continue;
                    }
                    const targetPortMode = portInputModes.find((info) => info.name === portModeName);
                    if (!targetPortMode) {
                        continue;
                    }
                    const defaultConfig = this.widgetDefaultConfigFactory.createDefaultConfig(
                        widgetType,
                        io,
                        targetPortMode.modeId
                    );
                    result.widgets.push(defaultConfig);
                }
            }
            return result;
        }
    );

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private readonly selectCanAddWidgets = (controlSchemeName: string) => createSelector(
        this.selectAvailableWidgets(controlSchemeName),
        CONTROL_SCHEME_SELECTORS.selectIsAnySchemeRunning,
        (availableWidgets, isAnySchemeRunning): boolean => {
            return !isAnySchemeRunning && availableWidgets.widgets.length > 0;
        }
    );
}
