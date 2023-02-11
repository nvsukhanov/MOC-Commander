import { IControlAction } from './i-control-action';

export interface IControlMapper {
    getCurrentControls(): IControlAction | null;
}
