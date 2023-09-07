import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-not-found-page',
    templateUrl: './not-found-page.component.html',
    styleUrls: [ './not-found-page.component.scss' ],
    imports: [
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent {
}
