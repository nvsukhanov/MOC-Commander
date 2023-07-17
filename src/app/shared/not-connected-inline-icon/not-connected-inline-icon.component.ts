import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-not-connected-inline-icon[notification]',
    templateUrl: './not-connected-inline-icon.component.html',
    styleUrls: [ './not-connected-inline-icon.component.scss' ],
    imports: [
        NgIf,
        MatIconModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotConnectedInlineIconComponent {
    @Input() public notification = '';
}
