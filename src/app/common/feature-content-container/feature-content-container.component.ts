import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-feature-content-container',
    templateUrl: './feature-content-container.component.html',
    styleUrls: [ './feature-content-container.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureContentContainerComponent {

}
