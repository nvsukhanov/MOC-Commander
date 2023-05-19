import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-feature-toolbar',
    templateUrl: './feature-toolbar.component.html',
    styleUrls: [ './feature-toolbar.component.scss' ],
    imports: [
        MatToolbarModule,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureToolbarComponent {
    @Input() public title = '';
}
