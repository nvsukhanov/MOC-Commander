import { WidgetConfigModel } from '@app/store';

export type AddWidgetDialogViewModel = {
  controlSchemeName: string;
  addableWidgetConfigs: WidgetConfigModel[];
};
