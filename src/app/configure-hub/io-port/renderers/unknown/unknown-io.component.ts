import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-unknown-io',
    templateUrl: './unknown-io.component.html',
    styleUrls: [ './unknown-io.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnknownIoComponent {
}
