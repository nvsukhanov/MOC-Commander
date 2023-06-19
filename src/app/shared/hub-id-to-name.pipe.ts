import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HUBS_SELECTORS } from '../store';

@Pipe({
    standalone: true,
    name: 'hubIdToName',
    pure: true
})
export class HubIdToNamePipe implements PipeTransform {
    constructor(
        private readonly store: Store
    ) {
    }

    public transform(hubId: string): Observable<string | undefined> {
        return this.store.select(HUBS_SELECTORS.selectHubName(hubId));
    }
}
