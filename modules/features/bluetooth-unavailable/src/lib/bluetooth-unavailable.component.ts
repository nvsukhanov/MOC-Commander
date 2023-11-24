import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { HintComponent } from '@app/shared-ui';
import { TitleService } from '@app/shared-misc';

@Component({
    standalone: true,
    selector: 'feat-bluetooth-unavailable',
    templateUrl: './bluetooth-unavailable.component.html',
    styleUrls: [ './bluetooth-unavailable.component.scss' ],
    imports: [
        HintComponent,
        TranslocoPipe,
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BluetoothUnavailableComponent implements OnInit {
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
