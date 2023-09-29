import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgForOf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { PushPipe } from '@ngrx/component';
import { MatSelectModule } from '@angular/material/select';
import { SETTINGS_ACTIONS, SETTINGS_FEATURE, UserSelectedTheme } from '@app/store';
import { Language, getEnumValues } from '@app/shared';

import { ThemeToL10nKeyPipe } from './theme-to-l10n-key.pipe';
import { LanguageToL10nKeyPipe } from './language-to-l10n-key.pipe';

@Component({
    standalone: true,
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: [ './settings-page.component.scss' ],
    imports: [
        MatCardModule,
        NgForOf,
        ThemeToL10nKeyPipe,
        TranslocoPipe,
        PushPipe,
        MatSelectModule,
        LanguageToL10nKeyPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
    public readonly themes: ReadonlyArray<UserSelectedTheme> = getEnumValues(UserSelectedTheme);

    public readonly languages: ReadonlyArray<Language> = getEnumValues(Language);

    public readonly currentThemeSelection$ = this.store.select(SETTINGS_FEATURE.selectAppTheme);

    public readonly currentLanguageSelection$ = this.store.select(SETTINGS_FEATURE.selectLanguage);

    constructor(
        private readonly store: Store
    ) {
    }

    public onThemeChange(
        nextTheme: UserSelectedTheme
    ): void {
        this.store.dispatch(SETTINGS_ACTIONS.setTheme({ appTheme: nextTheme }));
    }

    public onLanguageChange(
        nextLanguage: Language
    ): void {
        this.store.dispatch(SETTINGS_ACTIONS.setLanguage({ language: nextLanguage }));
    }
}
