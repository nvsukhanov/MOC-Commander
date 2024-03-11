import { Provider } from '@angular/core';

import { PitchWidgetComponentFactoryService } from './pitch-widget-component-factory.service';

export function providePitchWidget(): Provider[] {
    return [
        PitchWidgetComponentFactoryService
    ];
}
