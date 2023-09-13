import { Provider } from '@angular/core';

import { HashCompareFilterService } from './hash-compare-filter.service';
import { MostRecentTaskFilterService } from './most-recent-task-filter.service';
import { SetSpeedFilterService } from './set-speed-filter.service';
import { TaskFilterService } from './task-filter.service';
import { TASK_FILTER } from '../i-task-filter';

export function provideTaskFilter(): Provider[] {
    return [
        HashCompareFilterService,
        MostRecentTaskFilterService,
        SetSpeedFilterService,
        { provide: TASK_FILTER, useClass: TaskFilterService }
    ];
}
