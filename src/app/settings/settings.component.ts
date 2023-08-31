import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgForOf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { PushPipe } from '@ngrx/component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { SETTINGS_ACTIONS, SETTINGS_SELECTORS, UserSelectedTheme } from '@app/store';

import { ThemeToL10nKeyPipe } from './theme-to-l10n-key.pipe';
import { Language } from '../i18n';
import { LanguageToL10nKeyPipe } from './language-to-l10n-key.pipe';

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
        MatSelectModule,
        LanguageToL10nKeyPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
    public readonly themes: ReadonlyArray<UserSelectedTheme> = [
        UserSelectedTheme.System,
        UserSelectedTheme.Light,
        UserSelectedTheme.Dark
    ];

    public readonly languages: ReadonlyArray<Language> = Object.values(Language) as Language[];

    public readonly currentThemeSelection$ = this.store.select(SETTINGS_SELECTORS.theme);

    public readonly currentLanguageSelection$ = this.store.select(SETTINGS_SELECTORS.language);

    constructor(
        private readonly store: Store
    ) {
    }

    public onThemeChange(
        nextTheme: UserSelectedTheme
    ): void {
        this.store.dispatch(SETTINGS_ACTIONS.setTheme({ theme: nextTheme }));
    }

    public onLanguageChange(
        nextLanguage: Language
    ): void {
        this.store.dispatch(SETTINGS_ACTIONS.setLanguage({ language: nextLanguage }));
    }
}
