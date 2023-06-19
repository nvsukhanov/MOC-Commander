import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged, merge } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { IOType } from '@nvsukhanov/rxpoweredup';

import { AttachedIO, HubWithSynchronizableIOs, hubAttachedIosIdFn } from '../../store';
import { IoTypeToL10nKeyPipe } from '@app/shared';

type VirtualPortConfigurationForm = FormGroup<{
    name: FormControl<string>;
    hubId: FormControl<string | null>;
    portIdA: FormControl<number | null>;
    portIdB: FormControl<number | null>;
}>

export type CreateVirtualPortDialogResult = {
    name: string;
    hubId: string;
    ioAType: IOType;
    portIdA: number;
    ioBType: IOType;
    portIdB: number;
}

@Component({
    standalone: true,
    selector: 'app-create-virtual-port-configuration-dialog',
    templateUrl: './create-virtual-port-configuration-dialog.component.html',
    styleUrls: [ './create-virtual-port-configuration-dialog.component.scss' ],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        IoTypeToL10nKeyPipe,
        TranslocoModule,
        NgIf,
        NgForOf,
        ReactiveFormsModule,
        MatInputModule,
        JsonPipe,
        FormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateVirtualPortConfigurationDialogComponent implements OnInit, OnDestroy {
    @Output() public readonly confirm: EventEmitter<CreateVirtualPortDialogResult> = new EventEmitter<CreateVirtualPortDialogResult>();

    public readonly form: VirtualPortConfigurationForm = this.formBuilder.group({
        name: this.formBuilder.control<string>(
            '',
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.maxLength(20)
                ]
            }
        ),
        hubId: this.formBuilder.control<string | null>(
            null,
            {
                nonNullable: false,
                validators: [ Validators.required ]
            }
        ),
        portIdA: this.formBuilder.control<number | null>(
            null,
            {
                nonNullable: false,
                validators: [ Validators.required ]
            }
        ),
        portIdB: this.formBuilder.control<number | null>(
            null,
            {
                nonNullable: false,
                validators: [ Validators.required ]
            }
        )
    });

    private _portAAvailableIOs: AttachedIO[] = [];

    private _portBAvailableIOs: AttachedIO[] = [];

    private formUpdateSubscription = new Subscription();

    constructor(
        @Inject(MAT_DIALOG_DATA) public readonly data: ReadonlyArray<HubWithSynchronizableIOs>,
        private readonly formBuilder: FormBuilder
    ) {
        this.form.controls.portIdA.addValidators(this.nonEqualsPortsValidator);
        this.form.controls.portIdB.addValidators(this.nonEqualsPortsValidator);
    }

    public get portAAvailableIOs(): ReadonlyArray<AttachedIO> {
        return this._portAAvailableIOs;
    }

    public get portBAvailableIOs(): ReadonlyArray<AttachedIO> {
        return this._portBAvailableIOs;
    }

    public ngOnInit(): void {
        if (this.data.length) {
            this.form.controls.hubId.setValue(this.data[0].hubId);
            this.form.controls.portIdA.setValue(this.data[0].synchronizableIOs[0].portId);
            this.form.controls.portIdB.setValue(this.data[0].synchronizableIOs[1].portId);
            this.updateAvailableIOs(
                this.form.controls.hubId.value,
                this.form.controls.portIdA.value
            );
        }
        this.formUpdateSubscription.add(
            merge(
                this.form.controls.hubId.valueChanges.pipe(distinctUntilChanged()),
                this.form.controls.portIdA.valueChanges.pipe(distinctUntilChanged())
            ).subscribe(() => {
                this.updateAvailableIOs(
                    this.form.controls.hubId.value,
                    this.form.controls.portIdA.value
                );
                if (this.form.controls.portIdA.value === this.form.controls.portIdB.value) {
                    this.form.controls.portIdB.setValue(this.portBAvailableIOs[0].portId);
                }
            })
        );
        this.formUpdateSubscription.add(
            this.form.controls.portIdA.valueChanges.pipe(distinctUntilChanged()).subscribe(() => this.form.controls.portIdB.updateValueAndValidity())
        );
        this.formUpdateSubscription.add(
            this.form.controls.portIdB.valueChanges.pipe(distinctUntilChanged()).subscribe(() => this.form.controls.portIdA.updateValueAndValidity())
        );
    }

    public ngOnDestroy(): void {
        this.formUpdateSubscription.unsubscribe();
    }

    public onConfirm(): void {
        if (!this.form.valid) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ioA = this.portAAvailableIOs.find((io) => io.portId === this.form.controls.portIdA.value)!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ioB = this.portBAvailableIOs.find((io) => io.portId === this.form.controls.portIdB.value)!;

        this.confirm.emit({
            name: this.form.controls.name.value,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            hubId: this.form.controls.hubId.value!,
            ioAType: ioA.ioType,
            portIdA: ioA.portId,
            ioBType: ioB.ioType,
            portIdB: ioB.portId
        });
    }

    public attachedIOTrackByFn(
        _: number,
        io: AttachedIO
    ): string {
        return hubAttachedIosIdFn(io);
    }

    public hubTrackByFn(
        _: number,
        hub: HubWithSynchronizableIOs
    ): string {
        return hub.hubId;
    }

    private nonEqualsPortsValidator: ValidatorFn = () => {
        if (this.form.controls.portIdA.value === this.form.controls.portIdB.value) {
            return {
                nonEqualsPorts: true
            };
        }
        return null;
    };

    private updateAvailableIOs(
        selectedHubId: string | null,
        selectedPortIdA: number | null
    ): void {
        if (!selectedHubId) {
            this._portAAvailableIOs = [];
            this._portBAvailableIOs = [];
            return;
        }
        const hubData = this.data.find((data) => data.hubId === selectedHubId);
        this._portAAvailableIOs = hubData?.synchronizableIOs ?? [];
        const portASelectedIO = this._portAAvailableIOs.find((io) => io.portId === selectedPortIdA);
        if (portASelectedIO) {
            this._portBAvailableIOs = this._portAAvailableIOs.filter((io) => io.portId !== selectedPortIdA);
        } else {
            this._portBAvailableIOs = [];
        }
    }
}
