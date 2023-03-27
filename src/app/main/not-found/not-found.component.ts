import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: [ './not-found.component.scss' ],
    imports: [
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {
}
