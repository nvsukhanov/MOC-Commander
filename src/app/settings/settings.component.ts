import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SETTINGS_ACTIONS, SETTINGS_SELECTORS, UserSelectedTheme } from '@app/store';
import { NgForOf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { PushPipe } from '@ngrx/component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ThemeToL10nKeyPipe } from './theme-to-l10n-key.pipe';

@Component({
    standalone: true,
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: [ './settings.component.scss' ],
    imports: [
        MatCardModule,
        NgForOf,
        ThemeToL10nKeyPipe,
        TranslocoModule,
        PushPipe,
        MatButtonToggleModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
    public readonly themes: ReadonlyArray<UserSelectedTheme> = [
        UserSelectedTheme.System,
        UserSelectedTheme.Light,
        UserSelectedTheme.Dark
    ];

    public readonly currentThemeSelection$ = this.store.select(SETTINGS_SELECTORS.theme);

    constructor(
        private readonly store: Store
    ) {
    }

    public onThemeChange(
        nextTheme: UserSelectedTheme
    ): void {
        this.store.dispatch(SETTINGS_ACTIONS.setTheme({ theme: nextTheme }));
    }
}
