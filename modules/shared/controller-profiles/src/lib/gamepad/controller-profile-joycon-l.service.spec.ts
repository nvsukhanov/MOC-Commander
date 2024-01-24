import { TranslocoService } from '@ngneat/transloco';
import { instance, mock } from 'ts-mockito';

import { ControllerProfileJoyconLService } from './controller-profile-joycon-l.service';
import { IControllersConfig } from '../i-controllers-config';

describe('ControllerProfileJoyconLService', () => {
    let translocoServiceMock: TranslocoService;
    let config: IControllersConfig;
    let subject: ControllerProfileJoyconLService;

    beforeEach(() => {
        translocoServiceMock = mock(TranslocoService);
        config = {} as IControllersConfig;
        subject = new ControllerProfileJoyconLService(
            instance(translocoServiceMock),
            config
        );
    });

    it('should identify JoyCon L controller', () => {
        expect(subject.controllerIdMatch('Wireless Gamepad (STANDARD GAMEPAD Vendor: 057e Product: 2006)')).toBe(true);
    });
});
