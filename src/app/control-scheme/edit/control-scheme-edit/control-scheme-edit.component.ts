import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-control-scheme',
    templateUrl: './control-scheme-edit.component.html',
    styleUrls: [ './control-scheme-edit.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditComponent {
}
