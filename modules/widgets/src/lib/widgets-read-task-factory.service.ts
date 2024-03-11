import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeWidgetsDataModel, IWidgetsReadTasksFactory, WidgetConfigModel } from '@app/store';
import { WidgetType } from '@app/shared-misc';

import { TemperatureWidgetReadTaskFactoryService } from './temperature';
import { VoltageWidgetReadTaskFactoryService } from './voltage';
import { IWidgetReadTaskFactory } from './i-widget-read-task-factory';
import { CommonTiltWidgetsReadTaskFactoryService } from './common';

@Injectable()
export class WidgetsReadTaskFactoryService implements IWidgetsReadTasksFactory {
    private readonly widgetReaderTaskFactories: { [k in WidgetType]: IWidgetReadTaskFactory<WidgetConfigModel & { widgetType: k }> } = {
        [WidgetType.Temperature]: this.temperatureWidgetReadTaskFactoryService,
        [WidgetType.Voltage]: this.voltageWidgetReadTaskFactoryService,
        [WidgetType.Pitch]: this.commonTiltWidgetReadTaskFactoryService,
        [WidgetType.Yaw]: this.commonTiltWidgetReadTaskFactoryService,
        [WidgetType.Roll]: this.commonTiltWidgetReadTaskFactoryService,
    };

    constructor(
        private readonly temperatureWidgetReadTaskFactoryService: TemperatureWidgetReadTaskFactoryService,
        private readonly voltageWidgetReadTaskFactoryService: VoltageWidgetReadTaskFactoryService,
        private readonly commonTiltWidgetReadTaskFactoryService: CommonTiltWidgetsReadTaskFactoryService
    ) {
    }

    public createReadTasks(
        configs: ReadonlyArray<WidgetConfigModel>,
    ): Array<Observable<{
        widgetId: number;
        data: ControlSchemeWidgetsDataModel;
    }>> {
        // TODO: we can group tilt widget tasks by hubId and portId and generate a single task for each group
        // to reduce the number of messages sent to the hub. But it's not a priority now.
        return configs.map((config) => this.getWidgetReaderTaskFactory(config.widgetType).createReadTask(config));
    }

    private getWidgetReaderTaskFactory<T extends WidgetType>(
        widgetType: T
    ): IWidgetReadTaskFactory<WidgetConfigModel & { widgetType: T }> {
        return this.widgetReaderTaskFactories[widgetType];
    }
}
