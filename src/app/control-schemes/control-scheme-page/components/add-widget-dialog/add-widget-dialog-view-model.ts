import { WidgetConfigModel } from '@app/store';

export type AddWidgetDialogViewModel = {
    controlSchemeName: string;
    widgets: Array<Omit<WidgetConfigModel, 'order'>>;
};
