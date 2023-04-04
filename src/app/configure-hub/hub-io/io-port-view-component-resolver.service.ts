import { IOType } from '../../lego-hub';
import { Injectable, Type } from '@angular/core';
import { IIoPortRenderer, } from './i-io-port-renderer';
import { IoMotorComponent } from './renderers/motor';

@Injectable({ providedIn: 'root' })
export class IoPortViewComponentResolverService {
    private readonly componentMap = new Map<IOType, Type<IIoPortRenderer>>([
        [ IOType.largeTechnicMotor, IoMotorComponent ]
    ]);

    public resolveComponentType(ioType: IOType): Type<IIoPortRenderer> | undefined {
        return this.componentMap.get(ioType);
    }
}
