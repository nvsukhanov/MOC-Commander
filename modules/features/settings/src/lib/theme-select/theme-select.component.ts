import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { getEnumValues } from '@app/shared';
import { UserSelectedTheme } from '@app/store';

import { ThemeToL10nKeyPipe } from './theme-to-l10n-key.pipe';

@Component({
    standalone: true,
    selector: 'feat-settings-theme-select',
    templateUrl: './theme-select.component.html',
    styleUrls: [ './theme-select.component.scss' ],
    imports: [
        MatSelectModule,
        NgForOf,
        ThemeToL10nKeyPipe,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSelectComponent {
    @Input() public theme: UserSelectedTheme = UserSelectedTheme.System;

    @Output() public readonly themeChange = new EventEmitter<UserSelectedTheme>();

    public readonly themes: ReadonlyArray<UserSelectedTheme> = getEnumValues(UserSelectedTheme);

    public onThemeChange(
        theme: UserSelectedTheme
    ): void {
        this.themeChange.emit(theme);
    }
}
