import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlSchemeBinding, IOBindingValidationResults } from '../../../store';
import { JsonPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { PortCommandTask } from '../../../common';
import { PORT_TASK_TYPE_TO_L10N } from '../../../i18n';

type LastExecutedTaskTemplateDate = {
    taskTypeL10nKey: string;
    task: PortCommandTask;
}

@Component({
    standalone: true,
    selector: 'app-control-scheme-view-io',
    templateUrl: './control-scheme-view-io.component.html',
    styleUrls: [ './control-scheme-view-io.component.scss' ],
    imports: [
        NgIf,
        JsonPipe,
        MatCardModule,
        TranslocoModule,
        MatIconModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeViewIoComponent {
    @Input() public binding?: ControlSchemeBinding;

    @Input() public validation?: IOBindingValidationResults;

    private _lastExecutedTaskTemplateData?: LastExecutedTaskTemplateDate;

    @Input()
    public set lastExecutedTask(v: PortCommandTask | undefined) {
        if (v) {
            this._lastExecutedTaskTemplateData = {
                taskTypeL10nKey: PORT_TASK_TYPE_TO_L10N[v.taskType],
                task: v
            };
        } else {
            this._lastExecutedTaskTemplateData = undefined;
        }
    }

    public get lastExecutedTaskTemplateData(): LastExecutedTaskTemplateDate | undefined {
        return this._lastExecutedTaskTemplateData;
    }
}
