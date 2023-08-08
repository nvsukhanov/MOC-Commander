import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'activeZoneHumanReadableValue',
    pure: true
})
export class ActiveZoneHumanReadableValuePipe implements PipeTransform {
    public transform(
        value: number
    ): string {
        return `${Math.round(value * 100)}%`;
    }
}
