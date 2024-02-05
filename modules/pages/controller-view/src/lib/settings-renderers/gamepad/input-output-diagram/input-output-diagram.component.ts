import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { NgIf } from '@angular/common';
import { CONTROLLERS_CONFIG, IControllersConfig } from '@app/controller-profiles';

@Component({
    standalone: true,
    selector: 'page-controller-view-input-output-diagram',
    templateUrl: './input-output-diagram.component.html',
    styleUrls: [ './input-output-diagram.component.scss' ],
    imports: [
        TranslocoPipe,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputOutputDiagramComponent {
    @Input() public min = this.config.minInputValue;

    @Input() public max = this.config.maxInputValue;

    @Input() public rawValue? = this.config.nullInputValue;

    @Input() public outputValue? = this.config.nullInputValue;

    @Input() public activeZoneStart? = 0;

    @Input() public activeZoneEnd? = 0;

    @Input() public translocoTitle = '';

    @Input() public compact = false;

    constructor(
        @Inject(CONTROLLERS_CONFIG) private readonly config: IControllersConfig
    ) {
    }

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
        return this.normalizedRawValue <= -this.normalizedActiveZoneStart && this.normalizedRawValue >= -this.normalizedActiveZoneEnd;
    }

    public get rightActiveZoneHighlight(): boolean {
        return this.normalizedRawValue >= this.normalizedActiveZoneStart && this.normalizedRawValue <= this.normalizedActiveZoneEnd;
    }

    public get rawPositionPercent(): number {
        return (this.normalizedRawValue - this.min) / (this.max - this.min) * 100;
    }

    public get outputPositionPercent(): number {
        return (this.normalizedOutputValue - this.min) / (this.max - this.min) * 100;
    }

    public get humanReadableRawValue(): string {
        return `${Math.round(this.normalizedRawValue * 100)}%`;
    }

    public get humanReadableOutputValue(): string {
        return `${Math.round(this.normalizedOutputValue * 100)}%`;
    }

    private get normalizedRawValue(): number {
        if (this.rawValue === undefined) {
            return this.config.nullInputValue;
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
