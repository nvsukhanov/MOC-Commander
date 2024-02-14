import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Language } from '@app/shared-i18n';
import { RoutesBuilderService, TitleService } from '@app/shared-misc';
import { IState, SETTINGS_ACTIONS, SETTINGS_FEATURE, UserSelectedTheme } from '@app/store';
import { FeatureToolbarBreadcrumbsDirective, FeatureToolbarControlsDirective, IBreadcrumbDefinition } from '@app/shared-ui';

import { RestoreStateFromBackupDialogComponent } from './restore-state-from-backup-dialog';
import { ResetStateDialogComponent } from './reset-state-dialog';
import { ThemeSelectComponent } from './theme-select';
import { LanguageSelectComponent } from './language-select';

@Component({
    standalone: true,
    selector: 'page-settings',
    templateUrl: './settings-page.component.html',
    styleUrls: [ './settings-page.component.scss' ],
    imports: [
        MatCardModule,
        TranslocoPipe,
        MatDividerModule,
        MatButtonModule,
        MatDialogModule,
        ThemeSelectComponent,
        LanguageSelectComponent,
        FeatureToolbarControlsDirective,
        FeatureToolbarBreadcrumbsDirective
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent implements OnInit {
    public readonly currentTheme = this.store.selectSignal(SETTINGS_FEATURE.selectAppTheme);

    public readonly currentLanguage = this.store.selectSignal(SETTINGS_FEATURE.selectLanguage);

    public readonly breadcrumbsDef: ReadonlyArray<IBreadcrumbDefinition> = [
        {
            label$: this.translocoService.selectTranslate('pageTitle.settings'),
            route: this.routeBuilderService.settings
        }
    ];

    constructor(
        private readonly store: Store,
        private readonly matDialog: MatDialog,
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService,
        private readonly routeBuilderService: RoutesBuilderService
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
