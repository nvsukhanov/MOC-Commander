import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { getEnumValues } from '@app/shared-misc';
import { UserSelectedTheme } from '@app/store';

import { ThemeToL10nKeyPipe } from './theme-to-l10n-key.pipe';

@Component({
  standalone: true,
  selector: 'page-settings-theme-select',
  templateUrl: './theme-select.component.html',
  styleUrl: './theme-select.component.scss',
  imports: [MatSelectModule, ThemeToL10nKeyPipe, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelectComponent {
  @Input() public theme: UserSelectedTheme = UserSelectedTheme.System;

  @Output() public readonly themeChange = new EventEmitter<UserSelectedTheme>();

  public readonly themes: ReadonlyArray<UserSelectedTheme> = getEnumValues(UserSelectedTheme);

  public onThemeChange(theme: UserSelectedTheme): void {
    this.themeChange.emit(theme);
  }
}
