import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'lib-cs-label',
    templateUrl: './label.component.html',
    styleUrls: [ './label.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelComponent {
}
