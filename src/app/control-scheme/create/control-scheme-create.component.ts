import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';
import { PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { ControlSchemeEditFormComponent } from '../edit/control-scheme-edit-form';

@Component({
    standalone: true,
    selector: 'app-control-scheme',
    templateUrl: './control-scheme-create.component.html',
    styleUrls: [ './control-scheme-create.component.scss' ],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        NgIf,
        PushModule,
        TranslocoModule,
        ControlSchemeEditFormComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeCreateComponent {
}
