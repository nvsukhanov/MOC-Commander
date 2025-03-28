import { PortCommandTask } from './port-command-task';

export type PortTasksModel = {
  hubId: string;
  portId: number;
  pendingTask: PortCommandTask | null;
  runningTask: PortCommandTask | null;
  lastExecutedTask: PortCommandTask | null;
};
