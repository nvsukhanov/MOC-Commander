import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-input-activity-indicator',
    templateUrl: './input-activity-indicator.component.html',
    styleUrls: [ './input-activity-indicator.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatIconModule,
        NgIf
    ]
})
export class InputActivityIndicatorComponent {
    @Input() public isActive = false;

    @Input() public activeTitle = '';

    @Input() public inactiveTitle = '';
}
