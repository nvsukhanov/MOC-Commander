import { Provider } from '@angular/core';

import { ControllerInputNameService } from './controller-input-name.service';
import { InputExtractorService } from './input-extractor.service';

export function provideBindingCommonServices(): Provider[] {
    return [
        ControllerInputNameService,
        InputExtractorService
    ];
}
