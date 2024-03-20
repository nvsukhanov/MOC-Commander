import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { FeatureToolbarControlsDirective } from '@app/shared-ui';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-toolbar-controls',
    templateUrl: './toolbar-controls.component.html',
    styleUrls: [ './toolbar-controls.component.scss' ],
    imports: [
        MatButtonModule,
        TranslocoPipe,
        FeatureToolbarControlsDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarControlsComponent {
    @Input() public canRun = false;

    @Input() public canStop = false;

    @Input() public canDelete = false;

    @Output() public readonly run = new EventEmitter<void>();

    @Output() public readonly stop = new EventEmitter<void>();

    public onRun(): void {
        this.run.emit();
    }

    public onStop(): void {
        this.stop.emit();
    }
}
