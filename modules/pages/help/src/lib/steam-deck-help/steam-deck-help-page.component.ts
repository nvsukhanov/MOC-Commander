import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { SteamDeckManualComponent } from '@app/manuals';

@Component({
    standalone: true,
    selector: 'page-help-steam-deck',
    templateUrl: './steam-deck-help-page.component.html',
    styleUrl: './steam-deck-help-page.component.scss',
    imports: [
        SteamDeckManualComponent,
        MatCard,
        MatCardContent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SteamDeckHelpPageComponent {

}
