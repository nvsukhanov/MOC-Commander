import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { filter, map } from 'rxjs';
import { NAVIGATOR, isOsLinux } from '@app/shared-misc';

import { SETTINGS_ACTIONS } from '../../actions';
import { SETTINGS_FEATURE } from '../../reducers';

export const DETECT_LINUX_COMPAT_EFFECT = createEffect((
    store: Store = inject(Store),
    navigator: Navigator = inject(NAVIGATOR)
) => {
    return store.select(SETTINGS_FEATURE.selectUseLinuxCompat).pipe(
        filter((useCompat) => useCompat === null),
        map(() => {
            const useLinuxCompat = isOsLinux(navigator);
            return SETTINGS_ACTIONS.setLinuxCompat({ useLinuxCompat });
        })
    );
}, { functional: true });
