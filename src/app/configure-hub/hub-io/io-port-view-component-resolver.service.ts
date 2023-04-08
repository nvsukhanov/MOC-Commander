import { IOType } from '../../lego-hub';
import { Injectable, Type } from '@angular/core';
import { IoPortRendererBase, } from './io-port-renderer';
import { IoCurrentSensorComponent, IoMotorComponent, RgbLightComponent } from './renderers';
import { VoltageSensorComponent } from './renderers/voltage/voltage-sensor.component';

@Injectable({ providedIn: 'root' })
export class IoPortViewComponentResolverService {
    private readonly componentMap = new Map<IOType, Type<IoPortRendererBase>>([
        [ IOType.largeTechnicMotor, IoMotorComponent ],
        [ IOType.current, IoCurrentSensorComponent ],
        [ IOType.rgbLight, RgbLightComponent ],
        [ IOType.voltage, VoltageSensorComponent ]
    ]);

    public resolveComponentType(ioType: IOType): Type<IoPortRendererBase> | undefined {
        return this.componentMap.get(ioType);
    }
}
