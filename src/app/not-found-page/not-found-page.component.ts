import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { HintComponent } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-not-found-page',
    templateUrl: './not-found-page.component.html',
    styleUrls: [ './not-found-page.component.scss' ],
    imports: [
        TranslocoModule,
        HintComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent {
}
