import { Injectable } from '@angular/core';

import { ConsoleLoggingService } from '@app/shared';
import { ITaskRunner } from './i-task-runner';
import { FakeTaskRunner } from './fake-task-runner';

@Injectable({ providedIn: 'root' })
export class FakeTaskRunnerFactoryService {
    constructor(
        private readonly logger: ConsoleLoggingService
    ) {
    }

    public create(
        taskExecutionDuration: number = 50
    ): ITaskRunner {
        return new FakeTaskRunner(
            taskExecutionDuration,
            this.logger
        );
    }
}
