import { HubIOType } from '../lego-hub';
import { CONFIGURE_HUB_I18N_SCOPE } from '../i18n';

export const MAPPING_HUB_IO_TYPE_TO_L10N: Readonly<{ [type in HubIOType]: string }> = {
    [HubIOType.Motor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeMotor' ].join('.'),
    [HubIOType.SystemTrainMotor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeSystemTrainMotor' ].join('.'),
    [HubIOType.Button]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeButton' ].join('.'),
    [HubIOType.LedLight]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeLedLight' ].join('.'),
    [HubIOType.Voltage]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeVoltage' ].join('.'),
    [HubIOType.Current]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeCurrent' ].join('.'),
    [HubIOType.PiezoTone]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypePiezoTone' ].join('.'),
    [HubIOType.RgbLight]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeRgbLight' ].join('.'),
    [HubIOType.ExternalTiltSensor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeExternalTiltSensor' ].join('.'),
    [HubIOType.MotionSensor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeMotionSensor' ].join('.'),
    [HubIOType.VisionSensor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeVisionSensor' ].join('.'),
    [HubIOType.ExternalMotorWithTacho]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeExternalMotorWithTacho' ].join('.'),
    [HubIOType.InternalMotorWithTacho]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeInternalMotorWithTacho' ].join('.'),
    [HubIOType.InternalTilt]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeInternalTilt' ].join('.'),
    [HubIOType.LargeTechnicMotor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeLargeTechnicMotor' ].join('.'),
    [HubIOType.XLargeTechnicMotor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeXLargeTechnicMotor' ].join('.'),
    [HubIOType.MediumTechicAngularMotor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeMediumTechicAngularMotor' ].join('.'),
    [HubIOType.LargeTechnicAngularMotor]: [ CONFIGURE_HUB_I18N_SCOPE, 'ioTypeLargeTechnicAngularMotor' ].join('.')
};
