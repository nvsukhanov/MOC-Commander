import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-empty-view',
    templateUrl: './empty-view.component.html',
    styleUrls: [ './empty-view.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyViewComponent {

}
