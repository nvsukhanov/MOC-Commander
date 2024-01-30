import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { ScreenSizeObserverService } from '@app/shared-misc';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-edit-sections-container',
    templateUrl: './binding-edit-sections-container.component.html',
    styleUrls: [ './binding-edit-sections-container.component.scss' ],
    imports: [
        PushPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingEditSectionsContainerComponent {
    public readonly useColumn$: Observable<boolean>;

    constructor(
        private readonly screenSizeObserverService: ScreenSizeObserverService
    ) {
        this.useColumn$ = this.screenSizeObserverService.isSmallScreen$;
    }
}
