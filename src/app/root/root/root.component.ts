import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LayoutComponent } from '../layout';
import { ThemingDirective } from '../theming.directive';

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: [ './root.component.scss' ],
    imports: [
        LayoutComponent,
        ThemingDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent {
}
