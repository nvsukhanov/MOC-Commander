import { HubType } from '@nvsukhanov/rxpoweredup';

export const HUB_TYPE_TO_L10N_MAPPING: Readonly<{ [type in HubType]: string }> = {
    [HubType.BoostHub]: 'hubTypeBoost',
    [HubType.WeDoHub]: 'hubTypeWeDo',
    [HubType.DuploTrain]: 'hubTypeDuploTrain',
    [HubType.TwoPortHub]: 'hubTypeTwoPortHub',
    [HubType.TwoPortHandset]: 'hubTypeTwoPortHandset',
    [HubType.Unknown]: 'hubTypeUnknown'
};
