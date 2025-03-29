import { TranslocoService } from '@jsverse/transloco';
import { instance, mock } from 'ts-mockito';

import { IControllersConfig } from '../i-controllers-config';
import { ControllerProfileXbox360Service } from './controller-profile-xbox360.service';

describe('ControllerProfileXbox360Service', () => {
  let translocoServiceMock: TranslocoService;
  let config: IControllersConfig;
  let subject: ControllerProfileXbox360Service;

  beforeEach(() => {
    translocoServiceMock = mock(TranslocoService);
    config = {} as IControllersConfig;
    subject = new ControllerProfileXbox360Service(instance(translocoServiceMock), config);
  });

  it('should identify XBox360 controller by vendor&product ids', () => {
    expect(
      subject.controllerIdMatch('HID-compliant game controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)'),
    ).toBe(true);
  });

  it("should identify XBox360 controller by it's legacy id", () => {
    expect(subject.controllerIdMatch('Xbox 360 Controller (XInput STANDARD GAMEPAD)')).toBe(true);
  });
});
