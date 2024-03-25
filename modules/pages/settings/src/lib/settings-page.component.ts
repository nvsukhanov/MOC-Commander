import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { of } from 'rxjs';
import { Language } from '@app/shared-i18n';
import { RoutesBuilderService, TitleService } from '@app/shared-misc';
import { IState, SETTINGS_ACTIONS, SETTINGS_FEATURE, UserSelectedTheme } from '@app/store';
import { BreadcrumbsService } from '@app/shared-components';

import { RestoreStateFromBackupDialogComponent } from './restore-state-from-backup-dialog';
import { ResetStateDialogComponent } from './reset-state-dialog';
import { ThemeSelectComponent } from './theme-select';
import { LanguageSelectComponent } from './language-select';
import { UseLinuxCompatSelectComponent } from './use-linux-compat-select';

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
        MatSlideToggle,
        MatIcon,
        MatTooltip,
        UseLinuxCompatSelectComponent
    ],
    providers: [
        TitleService,
        BreadcrumbsService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent implements OnInit {
    public readonly currentTheme = this.store.selectSignal(SETTINGS_FEATURE.selectAppTheme);

    public readonly currentLanguage = this.store.selectSignal(SETTINGS_FEATURE.selectLanguage);

    public readonly useLinuxCompat = this.store.selectSignal(SETTINGS_FEATURE.selectUseLinuxCompat);

    constructor(
        private readonly store: Store,
        private readonly matDialog: MatDialog,
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService,
        private readonly routeBuilderService: RoutesBuilderService,
        private breadcrumbs: BreadcrumbsService
    ) {
        this.breadcrumbs.setBreadcrumbsDef(of([
            {
                label$: this.translocoService.selectTranslate('pageTitle.settings'),
                route: this.routeBuilderService.settings
            }
        ]));
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

    public onUseLinuxCompatChange(
        useLinuxCompat: boolean
    ): void {
        this.store.dispatch(SETTINGS_ACTIONS.setLinuxCompat({ useLinuxCompat }));
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
