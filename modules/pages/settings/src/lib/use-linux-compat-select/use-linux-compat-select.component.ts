import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    standalone: true,
    selector: 'page-settings-use-linux-compat-select',
    templateUrl: './use-linux-compat-select.component.html',
    styleUrls: [ './use-linux-compat-select.component.scss' ],
    imports: [
        MatSelectModule,
        TranslocoPipe,
        MatIcon,
        MatTooltip
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UseLinuxCompatSelectComponent {
    @Input() public useLinuxCompat: boolean | null = false;

    @Output() public readonly useLinuxCompatChange = new EventEmitter<boolean>();

    public onUseLinuxCompatChange(
        value: boolean
    ): void {
        this.useLinuxCompatChange.emit(value);
    }
}
