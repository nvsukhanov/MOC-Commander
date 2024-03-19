import { map, tap } from 'rxjs';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '@app/shared-misc';

import { UserSelectedTheme } from '../../models';
import { SETTINGS_FEATURE } from '../../reducers';

enum AppTheme {
    Light,
    Dark
}

const THEME_CLASS_NAMES: { [s in AppTheme]: string } = {
    [AppTheme.Light]: 'theme-light',
    [AppTheme.Dark]: 'theme-dark'
};

export const SET_THEME_EFFECT = createEffect((
    store: Store = inject(Store),
    document: Document = inject(DOCUMENT),
    window: Window = inject(WINDOW)
) => {
    return store.select(SETTINGS_FEATURE.selectAppTheme).pipe(
        map((userSelectedTheme) => {
            switch (userSelectedTheme) {
                case UserSelectedTheme.Light:
                    return AppTheme.Light;
                case UserSelectedTheme.Dark:
                    return AppTheme.Dark;
                case UserSelectedTheme.System:
                    return window.matchMedia('(prefers-color-scheme: dark)').matches ? AppTheme.Dark : AppTheme.Light;
            }
        }),
        tap((theme) => {
            const body = document.body;
            const themeName = THEME_CLASS_NAMES[theme];
            body.classList.remove(THEME_CLASS_NAMES[AppTheme.Light]);
            body.classList.remove(THEME_CLASS_NAMES[AppTheme.Dark]);
            body.classList.add(themeName);
            const themeMeta = document.querySelector('meta[name="theme-color"]');
            if (themeMeta) {
                themeMeta.setAttribute('content', window.getComputedStyle(body).backgroundColor);
            }
        })
    );
}, { functional: true, dispatch: false });
