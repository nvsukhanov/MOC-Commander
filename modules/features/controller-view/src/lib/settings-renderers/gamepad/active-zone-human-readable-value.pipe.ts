import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'inputValuePercentHumanReadableValue',
    pure: true
})
export class InputValuePercentHumanReadableValuePipe implements PipeTransform {
    public transform(
        value: number
    ): string {
        return `${Math.round(value * 100)}%`;
    }
}
