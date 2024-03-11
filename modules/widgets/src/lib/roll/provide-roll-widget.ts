import { Provider } from '@angular/core';

import { RollWidgetComponentFactoryService } from './roll-widget-component-factory.service';

export function provideRollWidget(): Provider[] {
    return [
        RollWidgetComponentFactoryService
    ];
}
