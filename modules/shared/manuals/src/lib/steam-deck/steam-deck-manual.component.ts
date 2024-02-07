import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { CodeBlockComponent } from '@app/shared-ui';

import { COMMON_RESOURCES } from '../common-resources';

@Component({
    standalone: true,
    selector: 'lib-steam-deck-manual',
    templateUrl: './steam-deck-manual.component.html',
    styleUrls: [ '../common-styles.scss' ],
    imports: [
        NgOptimizedImage,
        MatDivider,
        TranslocoPipe,
        TranslocoDirective,
        CodeBlockComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SteamDeckManualComponent {
    public readonly resources = COMMON_RESOURCES;

    public readonly flatpakCode =
        'flatpak --user override --filesystem=/run/udev:ro --filesystem=~/.local/share/applications --filesystem=~/.local/share/icons com.google.Chrome';

    public readonly kioskModeOption = '--kiosk';
}
