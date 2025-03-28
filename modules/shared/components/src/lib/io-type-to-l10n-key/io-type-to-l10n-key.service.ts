import { Injectable } from '@angular/core';
import { IOType } from 'rxpoweredup';
import { L10nScopes, composeL10nKey } from '@app/shared-i18n';

@Injectable({ providedIn: 'root' })
export class IoTypeToL10nKeyService {
  private readonly mapping: Readonly<{ [type in IOType]: string }> = {
    [IOType.motor]: composeL10nKey(L10nScopes.io, 'ioTypeMotor'),
    [IOType.systemTrainMotor]: composeL10nKey(L10nScopes.io, 'ioTypeSystemTrainMotor'),
    [IOType.button]: composeL10nKey(L10nScopes.io, 'ioTypeButton'),
    [IOType.ledLight]: composeL10nKey(L10nScopes.io, 'ioTypeLedLight'),
    [IOType.voltage]: composeL10nKey(L10nScopes.io, 'ioTypeVoltage'),
    [IOType.current]: composeL10nKey(L10nScopes.io, 'ioTypeCurrent'),
    [IOType.piezoTone]: composeL10nKey(L10nScopes.io, 'ioTypePiezoTone'),
    [IOType.rgbLight]: composeL10nKey(L10nScopes.io, 'ioTypeRgbLight'),
    [IOType.externalTiltSensor]: composeL10nKey(L10nScopes.io, 'ioTypeExternalTiltSensor'),
    [IOType.motionSensor]: composeL10nKey(L10nScopes.io, 'ioTypeMotionSensor'),
    [IOType.visionSensor]: composeL10nKey(L10nScopes.io, 'ioTypeVisionSensor'),
    [IOType.externalMotorWithTacho]: composeL10nKey(L10nScopes.io, 'ioTypeExternalMotorWithTacho'),
    [IOType.internalMotorWithTacho]: composeL10nKey(L10nScopes.io, 'ioTypeInternalMotorWithTacho'),
    [IOType.internalTilt]: composeL10nKey(L10nScopes.io, 'ioTypeInternalTilt'),
    [IOType.largeTechnicMotor]: composeL10nKey(L10nScopes.io, 'ioTypeLargeTechnicMotor'),
    [IOType.xLargeTechnicMotor]: composeL10nKey(L10nScopes.io, 'ioTypeXLargeTechnicMotor'),
    [IOType.mediumTechnicAngularMotor]: composeL10nKey(L10nScopes.io, 'ioTypeMediumTechnicAngularMotor'),
    [IOType.largeTechnicAngularMotor]: composeL10nKey(L10nScopes.io, 'ioTypeLargeTechnicAngularMotor'),
    [IOType.handsetButtonGroup]: composeL10nKey(L10nScopes.io, 'ioTypeHandsetButtonGroup'),
    [IOType.accelerometerSensor]: composeL10nKey(L10nScopes.io, 'ioTypeAccelerometerSensor'),
    [IOType.gyroscopeSensor]: composeL10nKey(L10nScopes.io, 'ioTypeGyroscopeSensor'),
    [IOType.tiltSensor]: composeL10nKey(L10nScopes.io, 'ioTypeTiltSensor'),
    [IOType.temperatureSensor]: composeL10nKey(L10nScopes.io, 'ioTypeTemperatureSensor'),
    [IOType.gestureSensor]: composeL10nKey(L10nScopes.io, 'ioTypeGestureSensor'),
  };

  private readonly unknownDeviceType = composeL10nKey(L10nScopes.io, 'unknownIoType');

  public getL10nKey(ioType?: IOType): string {
    if (!ioType || !this.mapping[ioType]) {
      return this.unknownDeviceType;
    }
    return this.mapping[ioType];
  }
}
