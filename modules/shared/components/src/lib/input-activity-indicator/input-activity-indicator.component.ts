import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'lib-input-activity-indicator',
    templateUrl: './input-activity-indicator.component.html',
    styleUrl: './input-activity-indicator.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatIconModule,
    ]
})
export class InputActivityIndicatorComponent {
    @Input() public isActive = false;

    @Input() public activeTitle = '';

    @Input() public inactiveTitle = '';
}
