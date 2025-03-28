import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { CodeBlockComponent } from '@app/shared-components';

import { COMMON_RESOURCES } from '../common-resources';

@Component({
  standalone: true,
  selector: 'lib-steam-deck-manual',
  templateUrl: './steam-deck-manual.component.html',
  styleUrl: '../common-styles.scss',
  imports: [NgOptimizedImage, MatDivider, TranslocoDirective, CodeBlockComponent, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SteamDeckManualComponent {
  public readonly resources = COMMON_RESOURCES;

  public readonly flatpakCode =
    'flatpak --user override --filesystem=/run/udev:ro --filesystem=~/.local/share/applications --filesystem=~/.local/share/icons com.google.Chrome';

  public readonly kioskModeOption = '--kiosk';
}
