import { Pipe, PipeTransform } from '@angular/core';
import { IOType } from '@nvsukhanov/rxpoweredup';
import { HUB_IO_I18N_SCOPE } from './index';

@Pipe({
    name: 'ioTypeToL10nKey',
    pure: true,
    standalone: true
})
export class IoTypeToL10nKeyPipe implements PipeTransform {
    private readonly mapping: Readonly<{ [type in IOType]: string }> = {
        [IOType.motor]: [ HUB_IO_I18N_SCOPE, 'ioTypeMotor' ].join('.'),
        [IOType.systemTrainMotor]: [ HUB_IO_I18N_SCOPE, 'ioTypeSystemTrainMotor' ].join('.'),
        [IOType.button]: [ HUB_IO_I18N_SCOPE, 'ioTypeButton' ].join('.'),
        [IOType.ledLight]: [ HUB_IO_I18N_SCOPE, 'ioTypeLedLight' ].join('.'),
        [IOType.voltage]: [ HUB_IO_I18N_SCOPE, 'ioTypeVoltage' ].join('.'),
        [IOType.current]: [ HUB_IO_I18N_SCOPE, 'ioTypeCurrent' ].join('.'),
        [IOType.piezoTone]: [ HUB_IO_I18N_SCOPE, 'ioTypePiezoTone' ].join('.'),
        [IOType.rgbLight]: [ HUB_IO_I18N_SCOPE, 'ioTypeRgbLight' ].join('.'),
        [IOType.externalTiltSensor]: [ HUB_IO_I18N_SCOPE, 'ioTypeExternalTiltSensor' ].join('.'),
        [IOType.motionSensor]: [ HUB_IO_I18N_SCOPE, 'ioTypeMotionSensor' ].join('.'),
        [IOType.visionSensor]: [ HUB_IO_I18N_SCOPE, 'ioTypeVisionSensor' ].join('.'),
        [IOType.externalMotorWithTacho]: [ HUB_IO_I18N_SCOPE, 'ioTypeExternalMotorWithTacho' ].join('.'),
        [IOType.internalMotorWithTacho]: [ HUB_IO_I18N_SCOPE, 'ioTypeInternalMotorWithTacho' ].join('.'),
        [IOType.internalTilt]: [ HUB_IO_I18N_SCOPE, 'ioTypeInternalTilt' ].join('.'),
        [IOType.largeTechnicMotor]: [ HUB_IO_I18N_SCOPE, 'ioTypeLargeTechnicMotor' ].join('.'),
        [IOType.xLargeTechnicMotor]: [ HUB_IO_I18N_SCOPE, 'ioTypeXLargeTechnicMotor' ].join('.'),
        [IOType.mediumTechnicAngularMotor]: [ HUB_IO_I18N_SCOPE, 'ioTypeMediumTechnicAngularMotor' ].join('.'),
        [IOType.largeTechnicAngularMotor]: [ HUB_IO_I18N_SCOPE, 'ioTypeLargeTechnicAngularMotor' ].join('.')
    };

    private readonly unknownDeviceType = [ HUB_IO_I18N_SCOPE, 'unknownIOType' ].join('.');

    public transform(ioType: IOType): string {
        return this.mapping[ioType] ?? this.unknownDeviceType;
    }
}
