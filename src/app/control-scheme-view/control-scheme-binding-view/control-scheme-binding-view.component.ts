import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlSchemeBinding } from '../../store';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
    standalone: true,
    selector: 'app-control-scheme-binding-view',
    templateUrl: './control-scheme-binding-view.component.html',
    styleUrls: [ './control-scheme-binding-view.component.scss' ],
    imports: [
        JsonPipe,
        MatCardModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeBindingViewComponent {
    @Input() public binding: ControlSchemeBinding | undefined;
}
