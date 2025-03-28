import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    standalone: true,
    selector: 'lib-battery-indicator',
    templateUrl: './battery-indicator.component.html',
    styleUrl: './battery-indicator.component.scss',
    imports: [
        MatIcon,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatteryIndicatorComponent {
    @Input() public batteryLevel: number | null = null;

    private batteryLevelWarningThreshold = 60;

    public get batteryLevelIcon(): string {
        if (this.batteryLevel === null) {
            return 'battery_unknown';
        }

        if (this.batteryLevel >= 90) {
            return 'battery_full';
        }
        if (this.batteryLevel >= 75) {
            return 'battery_6_bar';
        }
        if (this.batteryLevel >= 60) {
            return 'battery_5_bar';
        }
        if (this.batteryLevel >= 45) {
            return 'battery_4_bar';
        }
        if (this.batteryLevel >= 30) {
            return 'battery_3_bar';
        }
        if (this.batteryLevel >= 15) {
            return 'battery_2_bar';
        }
        return 'battery_0_bar';
    }

    public get batteryLevelColor(): 'warn' | undefined {
        if (this.batteryLevel === null) {
            return 'warn';
        }

        if (this.batteryLevel >= this.batteryLevelWarningThreshold) {
            return undefined;
        }
        return 'warn';
    }
}
