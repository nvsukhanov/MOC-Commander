import { TranslocoService } from '@jsverse/transloco';
import { instance, mock } from 'ts-mockito';

import { IControllersConfig } from '../i-controllers-config';
import { ControllerProfileSteamDeckService } from './controller-profile-steam-deck.service';

describe('ControllerProfileSteamDeckService', () => {
  let translocoServiceMock: TranslocoService;
  let config: IControllersConfig;
  let subject: ControllerProfileSteamDeckService;

  beforeEach(() => {
    translocoServiceMock = mock(TranslocoService);
    config = {} as IControllersConfig;
    subject = new ControllerProfileSteamDeckService(instance(translocoServiceMock), config);
  });

  it('should identify Steam Deck controller', () => {
    expect(subject.controllerIdMatch('Microsoft X-Box pad 0 (STANDARD GAMEPAD Vendor: 28de Product: 11ff)')).toBe(true);
  });
});
