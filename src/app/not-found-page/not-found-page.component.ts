import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { HintComponent } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-not-found-page',
    templateUrl: './not-found-page.component.html',
    styleUrls: [ './not-found-page.component.scss' ],
    imports: [
        TranslocoPipe,
        HintComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent {
}
