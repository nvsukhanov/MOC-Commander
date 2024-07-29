import { TranslocoService } from '@jsverse/transloco';
import { instance, mock } from 'ts-mockito';

import { IControllersConfig } from '../i-controllers-config';
import { ControllerProfileJoyconLrService } from './controller-profile-joycon-lr.service';

describe('ControllerProfileJoyconLrService', () => {
    let translocoServiceMock: TranslocoService;
    let config: IControllersConfig;
    let subject: ControllerProfileJoyconLrService;

    beforeEach(() => {
        translocoServiceMock = mock(TranslocoService);
        config = {} as IControllersConfig;
        subject = new ControllerProfileJoyconLrService(
            instance(translocoServiceMock),
            config
        );
    });

    it('should identify JoyCon LR controller', () => {
        expect(subject.controllerIdMatch('Wireless Gamepad (STANDARD GAMEPAD Vendor: 057e Product: 200e)')).toBe(true);
    });
});
