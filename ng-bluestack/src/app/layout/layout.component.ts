import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { GamepadConnectListener, ExtractTokenType, GamepadMapperFactoryService, TICKER } from '../../engine';
import { map, switchMap } from 'rxjs';
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
    constructor(
    ) {
    }
}
