import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NgIf } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-input-output-diagram',
    templateUrl: './input-output-diagram.component.html',
    styleUrls: [ './input-output-diagram.component.scss' ],
    imports: [
        TranslocoModule,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputOutputDiagramComponent {
    @Input() public min = -1;

    @Input() public max = 1;

    @Input() public rawValue? = 0;

    @Input() public outputValue? = 0;

    @Input() public activeZoneStart? = 0;

    @Input() public activeZoneEnd? = 0;

    @Input() public translocoTitle = '';

    @Input() public compact = false;

    public get shouldShowLeftActiveZone(): boolean {
        return this.min < 0;
    }

    public get rightActiveZoneStartOffsetPercent(): number {
        return this.normalizedActiveZoneStart * 50 + 50;
    }

    public get leftActiveZoneEndOffsetPercent(): number {
        return (1 - this.normalizedActiveZoneEnd) * 50;
    }

    public get activeZoneWidthPercent(): number {
        return (this.normalizedActiveZoneEnd - this.normalizedActiveZoneStart) * 50;
    }

    public get leftActiveZoneHighlight(): boolean {
        return this.normalizedRawValue < -this.normalizedActiveZoneStart && this.normalizedRawValue > -this.normalizedActiveZoneEnd;
    }

    public get rightActiveZoneHighlight(): boolean {
        return this.normalizedRawValue > this.normalizedActiveZoneStart && this.normalizedRawValue < this.normalizedActiveZoneEnd;
    }

    public get rawPositionPercent(): number {
        return (this.normalizedRawValue - this.min) / (this.max - this.min) * 100;
    }

    public get outputPositionPercent(): number {
        return (this.normalizedOutputValue - this.min) / (this.max - this.min) * 100;
    }

    public get humanReadableRawValue(): string {
        return `${Math.round(Math.abs(this.normalizedRawValue) * 100)}%`;
    }

    public get humanReadableOutputValue(): string {
        return `${Math.round(Math.abs(this.normalizedOutputValue) * 100)}%`;
    }

    private get normalizedRawValue(): number {
        if (this.rawValue === undefined) {
            return 0;
        }
        if (this.rawValue < this.min) {
            return this.min;
        }
        if (this.rawValue > this.max) {
            return this.max;
        }
        return this.rawValue;
    }

    private get normalizedOutputValue(): number {
        if (this.outputValue === undefined) {
            return 0;
        }
        if (this.outputValue < this.min) {
            return this.min;
        }
        if (this.outputValue > this.max) {
            return this.max;
        }
        return this.outputValue;
    }

    private get normalizedActiveZoneStart(): number {
        return this.activeZoneStart ?? 0;
    }

    private get normalizedActiveZoneEnd(): number {
        return this.activeZoneEnd ?? 1;
    }
}
