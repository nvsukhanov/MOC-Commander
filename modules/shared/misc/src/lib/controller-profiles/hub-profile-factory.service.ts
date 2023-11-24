import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ControllerProfileHubFactoryService } from './hub';
import { IControllerProfile } from './i-controller-profile';
import { HubControllerSettings } from './controller-settings';

@Injectable()
export class HubProfileFactoryService {
    constructor(
        private readonly hubProfileFactory: ControllerProfileHubFactoryService,
    ) {
    }

    public getHubProfile(
        hubId: string,
        hubName$?: Observable<string>
    ): IControllerProfile<HubControllerSettings> {
        const profile = this.hubProfileFactory.build(hubId);
        if (hubName$) {
            profile.setName(hubName$ ?? of(hubId));
        }
        return profile;
    }
}
