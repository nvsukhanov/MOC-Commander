import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { UnknownControllerProfile } from './unknown-controller-profile';
import { IControllerProfile } from '../i-controller-profile';

@Injectable()
export class UnknownControllerProfileFactoryService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public fromUid(
        uid: string
    ): IControllerProfile<null> {
        return new UnknownControllerProfile(this.translocoService, uid);
    }
}
