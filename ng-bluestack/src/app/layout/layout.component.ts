import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './layout.component.html',
    styleUrls: [ './layout.component.scss' ],
    imports: [
        RouterOutlet
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
}
