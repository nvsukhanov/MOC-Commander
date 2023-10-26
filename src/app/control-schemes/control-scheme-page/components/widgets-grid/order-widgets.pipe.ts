import { Pipe, PipeTransform } from '@angular/core';
import { WidgetConfigModel } from '@app/store';

@Pipe({
    standalone: true,
    name: 'orderWidgets',
    pure: true,
})
export class OrderWidgetsPipe implements PipeTransform {
    public transform(
        widgetsWithData: WidgetConfigModel[]
    ): WidgetConfigModel[] {
        return widgetsWithData.sort((a, b) => a.order - b.order);
    }
}
