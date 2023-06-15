import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { NgForOf, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, startWith } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { IOType } from '@nvsukhanov/rxpoweredup';

import { IOFullInfo, hubAttachedIosIdFn } from '../../store';
import { IoTypeToL10nKeyPipe } from '@app/shared';

export type CreateVirtualPortDialogData = {
    readonly hubId: string;
    readonly mergeableIOs: ReadonlyArray<IOFullInfo>;
    readonly portIdA?: number;
}

export type CreateVirtualPortDialogResult = {
    readonly name: string;
    readonly portIdA: number;
    readonly ioAType: IOType;
    readonly ioAHardwareRevision: string;
    readonly ioASoftwareRevision: string;
    readonly portIdB: number;
    readonly ioBType: IOType;
    readonly ioBHardwareRevision: string;
    readonly ioBSoftwareRevision: string;
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
        MatInputModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateVirtualPortConfigurationDialogComponent implements OnInit, OnDestroy {
    @Output() public readonly createVirtualPortConfiguration: EventEmitter<CreateVirtualPortDialogResult> = new EventEmitter<CreateVirtualPortDialogResult>();

    public readonly form = this.formBuilder.group({
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
        portIdA: this.formBuilder.control<number | null>(
            this.data.portIdA ?? null,
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

    public availableSecondIOs: ReadonlyArray<IOFullInfo> = [];

    private formUpdateSubscription?: Subscription;

    constructor(
        @Inject(MAT_DIALOG_DATA) public readonly data: CreateVirtualPortDialogData,
        private readonly formBuilder: FormBuilder
    ) {
    }

    public ngOnInit(): void {
        this.formUpdateSubscription = this.form.controls.portIdA.valueChanges.pipe(
            startWith(this.form.controls.portIdA.value)
        ).subscribe((portIdA) => {
            this.availableSecondIOs = this.data.mergeableIOs.filter((io) => {
                return io.portId !== portIdA;
            });
            this.form.controls.portIdB.setValue(this.availableSecondIOs[0].portId ?? null);
        });
    }

    public ngOnDestroy(): void {
        this.formUpdateSubscription?.unsubscribe();
    }

    public mergeableIOTrackByFn(
        _: number,
        io: IOFullInfo
    ): string {
        return hubAttachedIosIdFn(io);
    }

    public onConfirm(): void {
        if (!this.form.valid) {
            return;
        }
        const ioA = this.form.controls.portIdA.value !== null
                    ? this.findIOByPortId(this.form.controls.portIdA.value)
                    : undefined;
        const ioB = this.form.controls.portIdB.value !== null
                    ? this.findIOByPortId(this.form.controls.portIdB.value)
                    : undefined;
        if (!ioA || !ioB) {
            return;
        }
        this.createVirtualPortConfiguration.emit({
            name: this.form.controls.name.value,
            portIdA: ioA.portId,
            ioAType: ioA.ioType,
            ioAHardwareRevision: ioA.hardwareRevision,
            ioASoftwareRevision: ioA.softwareRevision,
            portIdB: ioB.portId,
            ioBType: ioB.ioType,
            ioBHardwareRevision: ioB.hardwareRevision,
            ioBSoftwareRevision: ioB.softwareRevision
        });
    }

    private findIOByPortId(
        portId: number
    ): IOFullInfo | undefined {
        return this.data.mergeableIOs.find((io) => {
            return io.portId === portId;
        });
    }
}
