import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { SteamDeckManualComponent } from '@app/manuals';

@Component({
    standalone: true,
    selector: 'feat-help-steam-deck',
    templateUrl: './steam-deck-help.component.html',
    styleUrls: [ './steam-deck-help.component.scss' ],
    imports: [
        SteamDeckManualComponent,
        MatCard,
        MatCardContent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SteamDeckHelpComponent {

}
