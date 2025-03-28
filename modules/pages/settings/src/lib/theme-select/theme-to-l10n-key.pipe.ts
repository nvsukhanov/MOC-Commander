import { Pipe, PipeTransform } from '@angular/core';
import { UserSelectedTheme } from '@app/store';

@Pipe({
  standalone: true,
  name: 'themeToL10nKey',
  pure: true,
})
export class ThemeToL10nKeyPipe implements PipeTransform {
  private readonly themeToL10nKeyMap: Record<UserSelectedTheme, string> = {
    [UserSelectedTheme.System]: 'settings.themeSystem',
    [UserSelectedTheme.Light]: 'settings.themeLight',
    [UserSelectedTheme.Dark]: 'settings.themeDark',
  };

  public transform(theme: UserSelectedTheme): string {
    return this.themeToL10nKeyMap[theme];
  }
}
