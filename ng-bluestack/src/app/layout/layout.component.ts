import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CONNECT_CONTROLLER_ROUTE } from '../routes';

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './layout.component.html',
    styleUrls: [ './layout.component.scss' ],
    imports: [
        RouterOutlet,
        MatToolbarModule,
        MatButtonModule,
        RouterLink
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
    public readonly connectControllerRoute = CONNECT_CONTROLLER_ROUTE;
}
