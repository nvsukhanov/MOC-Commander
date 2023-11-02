import { WidgetConfigModel } from '@app/store';

export type AddWidgetDialogViewModel = {
    controlSchemeName: string;
    widgets: Array<WidgetConfigModel>;
};
