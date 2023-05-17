import { Injectable } from '@angular/core';
import { ITaskExecutor } from './i-task-executor';
import { FakeTaskExecutor } from './fake-task-executor';
import { ConsoleLoggingService } from '../../common';

@Injectable({ providedIn: 'root' })
export class FakeTaskExecutorFactoryService {
    constructor(
        private readonly logger: ConsoleLoggingService
    ) {
    }

    public create(
        taskExecutionDuration: number = 100,
    ): ITaskExecutor {
        return new FakeTaskExecutor(
            taskExecutionDuration,
            this.logger
        );
    }
}
