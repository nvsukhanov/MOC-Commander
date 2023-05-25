import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslocoModule } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { FeatureToolbarService } from './feature-toolbar-service';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { LetModule, PushModule } from '@ngrx/component';

@Component({
    standalone: true,
    selector: 'app-feature-toolbar',
    templateUrl: './feature-toolbar.component.html',
    styleUrls: [ './feature-toolbar.component.scss' ],
    imports: [
        MatToolbarModule,
        TranslocoModule,
        NgIf,
        NgTemplateOutlet,
        LetModule,
        PushModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureToolbarComponent {
    public readonly controlsTemplate$: Observable<TemplateRef<unknown> | null> = this.featureToolbarService.controlsTemplate$;

    constructor(
        private readonly featureToolbarService: FeatureToolbarService,
    ) {
    }
}
