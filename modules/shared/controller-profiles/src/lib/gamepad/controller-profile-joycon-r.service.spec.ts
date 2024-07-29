import { TranslocoService } from '@jsverse/transloco';
import { instance, mock } from 'ts-mockito';

import { IControllersConfig } from '../i-controllers-config';
import { ControllerProfileJoyconRService } from './controller-profile-joycon-r.service';

describe('ControllerProfileJoyconRService', () => {
    let translocoServiceMock: TranslocoService;
    let config: IControllersConfig;
    let subject: ControllerProfileJoyconRService;

    beforeEach(() => {
        translocoServiceMock = mock(TranslocoService);
        config = {} as IControllersConfig;
        subject = new ControllerProfileJoyconRService(
            instance(translocoServiceMock),
            config
        );
    });

    it('should identify JoyCon R controller', () => {
        expect(subject.controllerIdMatch('Wireless Gamepad (STANDARD GAMEPAD Vendor: 057e Product: 2007)')).toBe(true);
    });
});
