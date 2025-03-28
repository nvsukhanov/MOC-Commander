import { TranslocoService } from '@jsverse/transloco';
import { instance, mock } from 'ts-mockito';

import { IControllersConfig } from '../i-controllers-config';
import { ControllerProfileDualshockService } from './controller-profile-dualshock.service';

describe('ControllerProfileDualshockService', () => {
  let translocoServiceMock: TranslocoService;
  let config: IControllersConfig;
  let subject: ControllerProfileDualshockService;

  beforeEach(() => {
    translocoServiceMock = mock(TranslocoService);
    config = {} as IControllersConfig;
    subject = new ControllerProfileDualshockService(instance(translocoServiceMock), config);
  });

  it('should identify Dualshock 4 controller', () => {
    expect(subject.controllerIdMatch('Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)')).toBe(true);
  });
});
