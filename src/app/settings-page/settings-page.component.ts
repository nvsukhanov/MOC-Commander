import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgForOf } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { PushPipe } from '@ngrx/component';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IState, SETTINGS_ACTIONS, SETTINGS_FEATURE, UserSelectedTheme } from '@app/store';
import { Language, TitleService, getEnumValues } from '@app/shared';

import { ThemeToL10nKeyPipe } from './theme-to-l10n-key.pipe';
import { LanguageToL10nKeyPipe } from './language-to-l10n-key.pipe';
import { RestoreStateFromBackupDialogComponent } from './restore-state-from-backup-dialog';
import { ResetStateDialogComponent } from './reset-state-dialog';

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
        LanguageToL10nKeyPipe,
        MatDividerModule,
        MatButtonModule,
        MatDialogModule,
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent implements OnInit {
    public readonly themes: ReadonlyArray<UserSelectedTheme> = getEnumValues(UserSelectedTheme);

    public readonly languages: ReadonlyArray<Language> = getEnumValues(Language);

    public readonly currentThemeSelection$ = this.store.select(SETTINGS_FEATURE.selectAppTheme);

    public readonly currentLanguageSelection$ = this.store.select(SETTINGS_FEATURE.selectLanguage);

    constructor(
        private readonly store: Store,
        private readonly matDialog: MatDialog,
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService
    ) {
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.settings'));
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

    public onStateDump(): void {
        this.store.dispatch(SETTINGS_ACTIONS.createStateBackup());
    }

    public onStateRestore(): void {
        this.matDialog.open<RestoreStateFromBackupDialogComponent, void, IState | undefined>(
            RestoreStateFromBackupDialogComponent
        ).afterClosed().subscribe((result) => {
            if (result) {
                this.store.dispatch(SETTINGS_ACTIONS.restoreStateFromBackup({ state: result }));
            }
        });
    }

    public onStateReset(): void {
        this.matDialog.open<ResetStateDialogComponent, void, boolean>(ResetStateDialogComponent).afterClosed().subscribe((result) => {
            if (result) {
                this.store.dispatch(SETTINGS_ACTIONS.resetState());
            }
        });
    }
}
