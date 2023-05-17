import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlSchemeViewIOData } from '../../../store';
import { ControlSchemeViewIoComponent } from '../control-scheme-view-io';
import { NgForOf, NgIf } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-control-scheme-view-io-list',
    templateUrl: './control-scheme-view-io-list.component.html',
    styleUrls: [ './control-scheme-view-io-list.component.scss' ],
    imports: [
        ControlSchemeViewIoComponent,
        NgForOf,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeViewIoListComponent {
    @Input() public bindingsWithLatestExecutedTasks: Array<ControlSchemeViewIOData> | undefined;

    public trackByFn(index: number, item: { schemeId: string }): string {
        return item.schemeId;
    }
}
