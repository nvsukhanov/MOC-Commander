import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { HintComponent, TitleService } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-bluetooth-unavailable-page',
    templateUrl: './bluetooth-unavailable-page.component.html',
    styleUrls: [ './bluetooth-unavailable-page.component.scss' ],
    imports: [
        HintComponent,
        TranslocoPipe,
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BluetoothUnavailablePageComponent implements OnInit {
    public readonly canIUseBluetoothLink = 'https://caniuse.com/web-bluetooth';

    constructor(
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService
    ) {
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.bluetoothUnavailable'));
    }
}
