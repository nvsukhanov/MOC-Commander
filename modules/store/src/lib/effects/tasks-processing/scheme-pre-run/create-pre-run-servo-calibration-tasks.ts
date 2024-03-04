import { Store } from '@ngrx/store';
import { Observable, map, tap } from 'rxjs';
import { ControlSchemeBindingType, IAppConfig } from '@app/shared-misc';

import { ControlSchemeModel } from '../../../models';
import { CalibrationResultType, HubServoCalibrationFacadeService } from '../../../hub-facades';
import { attachedIosIdFn } from '../../../reducers';
import { ATTACHED_IO_PROPS_ACTIONS } from '../../../actions';

export function createPreRunServoCalibrationTasks(
    scheme: ControlSchemeModel,
    hubServoCalibrationFacade: HubServoCalibrationFacadeService,
    store: Store,
    appConfig: IAppConfig
): Array<Observable<unknown>> {
    const calibrateIos: Map<string, { hubId: string; portId: number; speed: number; power: number }> = new Map();
    scheme.bindings.forEach((binding) => {
        if (binding.bindingType !== ControlSchemeBindingType.Servo || !binding.calibrateOnStart) {
            return;
        }
        calibrateIos.set(attachedIosIdFn(binding), {
            hubId: binding.hubId,
            portId: binding.portId,
            speed: binding.speed,
            power: binding.power
        });
    });
    const tasks: Array<Observable<unknown>> = [];

    calibrateIos.forEach(({ hubId, portId, speed, power }) => {
        const task = hubServoCalibrationFacade.calibrateServo(
            hubId, portId, speed, power, appConfig.servo.autoCalibrationRuns
        ).pipe(
            map((r) => {
                if (r.type === CalibrationResultType.error) {
                    throw r.error;
                }
                return r;
            }),
            tap((result) => {
                if (result.type === CalibrationResultType.finished) {
                    store.dispatch(ATTACHED_IO_PROPS_ACTIONS.startupServoCalibrationDataReceived({
                        hubId,
                        portId,
                        range: result.range,
                        aposCenter: result.aposCenter
                    }));
                }
            })
        );
        tasks.push(task);
    });
    return tasks;
}
