import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { InputPipeConfig, InputPipeType } from '@app/store';
import { DeepReadonly } from '@app/shared-misc';

import { SelectInputPipePresetComponent } from '../../select-input-pipes-preset';

export interface IInputSettingsDialogData {
    readonly supportedInputPipes: ReadonlyArray<InputPipeType>;
    readonly currentInputPipeConfigs: ReadonlyArray<DeepReadonly<InputPipeConfig>>;
}

export interface IInputSettingsDialogResult {
    readonly inputPipes: InputPipeConfig[];
}

@Component({
    standalone: true,
    selector: 'lib-cs-select-input-transform-dialog',
    templateUrl: './input-settings-dialog.component.html',
    styleUrl: './input-settings-dialog.component.scss',
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogTitle,
        TranslocoPipe,
        MatDialogContent,
        SelectInputPipePresetComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputSettingsDialogComponent {
    private nextPipeConfigs: InputPipeConfig[] = [...this.data.currentInputPipeConfigs];

    private _canSave = false;

    constructor(
        private readonly dialog: MatDialogRef<InputSettingsDialogComponent, IInputSettingsDialogResult>,
        @Inject(MAT_DIALOG_DATA) private readonly data: IInputSettingsDialogData
    ) {
    }

    public get availablePipes(): ReadonlyArray<InputPipeType> {
        return this.data.supportedInputPipes;
    }

    public get currentPipeConfigs(): ReadonlyArray<InputPipeConfig> {
        return this.data.currentInputPipeConfigs;
    }

    public get canSave(): boolean {
        return this._canSave;
    }

    public onPipeConfigsChange(
        pipeConfigs: ReadonlyArray<InputPipeConfig>
    ): void {
        this.nextPipeConfigs = [...pipeConfigs];
        this._canSave = true;
    }

    public onConfirm(): void {
        this.dialog.close({ inputPipes: this.nextPipeConfigs });
    }

    public onCancel(): void {
        this.dialog.close();
    }
}
