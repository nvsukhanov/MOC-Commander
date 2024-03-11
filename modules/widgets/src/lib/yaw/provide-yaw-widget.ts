import { Provider } from '@angular/core';

import { YawWidgetComponentFactoryService } from './yaw-widget-component-factory.service';

export function provideYawWidget(): Provider[] {
    return [
        YawWidgetComponentFactoryService
    ];
}
