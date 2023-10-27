import { FunctionalEffect } from '@ngrx/effects';

import { PRE_RUN_SCHEME_EFFECT } from './scheme-pre-run';
import { COMPOSE_TASKS_EFFECT } from './compose-tasks.effect';
import { STOP_SCHEME_ON_HUB_DISCONNECT_EFFECT } from './stop-scheme-on-hub-disconnect.effect';
import { STOP_SCHEME_EFFECT } from './stop-scheme.effect';
import { CONSUME_QUEUE_EFFECT } from './consume-queue.effect';
import { EXECUTE_TASK_EFFECT } from './execute-task.effect';

export { provideTaskFactories } from './task-factory';
export { provideTaskFilter } from './task-filter';
export { calculateSpeedPower } from './calculate-speed-power';

export const TASK_PROCESSING_EFFECTS: Record<string, FunctionalEffect> = {
    preRunScheme: PRE_RUN_SCHEME_EFFECT,
    composeTasks: COMPOSE_TASKS_EFFECT,
    stopSchemeOnHubDisconnect: STOP_SCHEME_ON_HUB_DISCONNECT_EFFECT,
    stopScheme: STOP_SCHEME_EFFECT,
    consumeQueue: CONSUME_QUEUE_EFFECT,
    executeTask: EXECUTE_TASK_EFFECT
};
