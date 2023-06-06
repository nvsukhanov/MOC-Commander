import { PortCommandTaskType } from './types';

export const PORT_TASK_TYPE_TO_L10N: { [k in PortCommandTaskType]: string } = {
    [PortCommandTaskType.SetSpeed]: 'portCommandTaskTypeSetLinearSpeed',
    [PortCommandTaskType.Servo]: 'portCommandTaskTypeServo',
    [PortCommandTaskType.SetAngle]: 'portCommandTaskTypeSetAngle',
} as const;

