import { Injectable } from '@angular/core';

import { ConsoleLoggingService } from '@app/shared';
import { ITaskExecutor } from './i-task-executor';
import { FakeTaskExecutor } from './fake-task-executor';

@Injectable({ providedIn: 'root' })
export class FakeTaskExecutorFactoryService {
    constructor(
        private readonly logger: ConsoleLoggingService
    ) {
    }

    public create(
        taskExecutionDuration: number = 50
    ): ITaskExecutor {
        return new FakeTaskExecutor(
            taskExecutionDuration,
            this.logger
        );
    }
}
