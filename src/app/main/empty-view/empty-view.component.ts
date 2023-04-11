import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { PushModule } from '@ngrx/component';

@Component({
    standalone: true,
    selector: 'app-empty-view',
    templateUrl: './empty-view.component.html',
    styleUrls: [ './empty-view.component.scss' ],
    imports: [
        NgIf,
        PushModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyViewComponent {
}
