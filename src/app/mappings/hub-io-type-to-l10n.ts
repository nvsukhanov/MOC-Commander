import { IOType } from '../lego-hub';
import { CONFIGURE_HUB_I18N_SCOPE } from '../i18n';

export const MAPPING_HUB_IO_TYPE_TO_L10N: Readonly<{ [type in IOType]: string }> = {
    [IOType.motor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeMotor' ].join('.'),
    [IOType.systemTrainMotor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeSystemTrainMotor' ].join('.'),
    [IOType.button]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeButton' ].join('.'),
    [IOType.ledLight]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeLedLight' ].join('.'),
    [IOType.voltage]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeVoltage' ].join('.'),
    [IOType.current]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeCurrent' ].join('.'),
    [IOType.piezoTone]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypePiezoTone' ].join('.'),
    [IOType.rgbLight]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeRgbLight' ].join('.'),
    [IOType.externalTiltSensor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeExternalTiltSensor' ].join('.'),
    [IOType.motionSensor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeMotionSensor' ].join('.'),
    [IOType.visionSensor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeVisionSensor' ].join('.'),
    [IOType.externalMotorWithTacho]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeExternalMotorWithTacho' ].join('.'),
    [IOType.internalMotorWithTacho]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeInternalMotorWithTacho' ].join('.'),
    [IOType.internalTilt]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeInternalTilt' ].join('.'),
    [IOType.largeTechnicMotor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeLargeTechnicMotor' ].join('.'),
    [IOType.xLargeTechnicMotor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeXLargeTechnicMotor' ].join('.'),
    [IOType.mediumTechnicAngularMotor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeMediumTechnicAngularMotor' ].join('.'),
    [IOType.largeTechnicAngularMotor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeLargeTechnicAngularMotor' ].join('.')
};
