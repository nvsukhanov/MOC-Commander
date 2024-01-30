import { Provider } from '@angular/core';

import { MostRecentTaskFilterService } from './most-recent-task-filter.service';
import { HashCompareFilterService } from './hash-compare-filter.service';
import { BindingTaskPayloadHashBuilderService } from '../binding-task-payload-hash-builder.service';

export function provideBindingCommonServices(): Provider[] {
    return [
        MostRecentTaskFilterService,
        HashCompareFilterService,
        BindingTaskPayloadHashBuilderService,
    ];
}
