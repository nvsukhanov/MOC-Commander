import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { TiltGaugeSectorDefinition, TiltGaugeSectorsComponent } from './tilt-gauge-sectors';
import { TiltGaugeTickLineDefinition } from './tilt-gauge-ticks';
import { TiltGaugeTicksDefBuilderService } from './tilt-gauge-ticks-def-builder.service';
import { TiltGaugeSectorDefBuilderService } from './tilt-gauge-sector-def-builder.service';
import { TiltGaugeOptions } from './tilt-gauge-options';
import { TiltGaugeBracketsDefBuilderService } from './tilt-gauge-brackets-def-builder.service';
import { TiltGaugeValueComponent } from './tilt-gauge-value';

@Component({
    standalone: true,
    selector: 'lib-tilt-gauge',
    templateUrl: './tilt-gauge.component.html',
    styleUrl: './tilt-gauge.component.scss',
    imports: [
        TiltGaugeSectorsComponent,
        NgTemplateOutlet,
        TiltGaugeValueComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TiltGaugeComponent implements OnInit {
    @Input() public iconTemplate?: TemplateRef<unknown>;

    @Input() public valueClickable = false;

    @Output() public readonly valueClicked = new EventEmitter<Event>();

    private readonly baseOptions: TiltGaugeOptions = {
        chartRotation: 0,
        gaugeStepSizeDegrees: 10,
        gaugeSteps: 6,
        bracketWidth: 3,
        bracketAngleSizeDegrees: 130,
        gaugeStrokeWidth: 12,
        gaugeSectorPaddingDegrees: 1,
        chartRadius: 50,
        bracketGaugePadding: 2,
        bracketCenterLineStrokeWidth: 1
    };

    private _options?: TiltGaugeOptions;

    private _sectors: TiltGaugeSectorDefinition[] = [];

    private _brackets: TiltGaugeSectorDefinition[] = [];

    private _ticks: TiltGaugeTickLineDefinition[] = [];

    private _nestedViewBox: string;

    private _viewBox: string;

    private _tiltDegrees: number | null = null;

    private _iconTransform = 'rotate(0)';

    constructor(
        private readonly sectorDefService: TiltGaugeSectorDefBuilderService,
        private readonly lineDefService: TiltGaugeTicksDefBuilderService,
        private readonly bracketDefService: TiltGaugeBracketsDefBuilderService,
    ) {
        const radius = this.baseOptions.chartRadius;
        this._nestedViewBox = `-${radius} -${radius} ${radius * 2} ${radius * 2}`;
        this._viewBox = `0 0 ${radius * 2} ${radius * 2}`;
    }

    @Input()
    public set tiltDegrees(
        v: number | null
    ) {
        this._tiltDegrees = v;
        this.updateIconTransform();
    }

    public get tiltDegrees(): number | null {
        return this._tiltDegrees;
    }

    @Input()
    public set options(
        value: Partial<TiltGaugeOptions>
    ) {
        this._options = {
            ...this.baseOptions,
            ...value
        };
        this.updateChart();
        this.updateIconTransform();
    }

    public get options(): TiltGaugeOptions {
        return this._options || this.baseOptions;
    }

    public get iconTransform(): string {
        return this._iconTransform;
    }

    public get ticks(): TiltGaugeTickLineDefinition[] {
        return this._ticks;
    }

    public get sectors(): TiltGaugeSectorDefinition[] {
        return this._sectors;
    }

    public get brackets(): TiltGaugeSectorDefinition[] {
        return this._brackets;
    }

    public get viewBox(): string {
        return this._viewBox;
    }

    public get nestedViewBox(): string {
        return this._nestedViewBox;
    }

    public ngOnInit(): void {
        this.updateChart();
    }

    public onValueClicked(
        event: Event
    ): void {
        if (this.valueClickable) {
            this.valueClicked.emit(event);
        }
    }

    private updateIconTransform(): void {
        if (this._tiltDegrees === undefined) {
            this._iconTransform = 'rotate(0)';
            return;
        }
        const cumulativeRotation = this._tiltDegrees;
        this._iconTransform = `rotate(${cumulativeRotation} 50 50)`;
    }

    private updateChart(): void {
        const radius = this.options.chartRadius;
        this._nestedViewBox = `-${radius} -${radius} ${radius * 2} ${radius * 2}`;
        this._viewBox = `0 0 ${radius * 2} ${radius * 2}`;
        this._brackets = this.bracketDefService.createBracketsSectorDefs(this.options);
        this._sectors = this.sectorDefService.createSequentialSectorDefinitions(this.options);
        this._ticks = this.lineDefService.buildCenterLines(this.options);
    }
}
