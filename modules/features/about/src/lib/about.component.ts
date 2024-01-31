import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { Observable, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { TitleService } from '@app/shared-misc';

@Component({
    standalone: true,
    selector: 'feat-about',
    templateUrl: './about.component.html',
    styleUrls: [ './about.component.scss' ],
    imports: [
        TranslocoPipe,
        PushPipe
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
    public readonly mocCommanderUrl = 'https://github.com/nvsukhanov/MOC-Commander';

    public readonly rxPoweredUpURL = 'https://github.com/nvsukhanov/rxPoweredUp';

    public readonly licenseURL = 'https://github.com/nvsukhanov/MOC-Commander/blob/main/LICENSE.md';

    public readonly version$: Observable<string>;

    constructor(
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService,
        private readonly route: ActivatedRoute
    ) {
        this.version$ = this.route.data.pipe(
            map((data) => data['appVersion'])
        );
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.about'));
    }
}
