import { Action, ActionReducer } from '@ngrx/store';

import { SETTINGS_ACTIONS } from '../../actions';
import { IState } from '../../i-state';

export function stateResetMetaReducer(
    reducer: ActionReducer<IState>,
): ActionReducer<IState> {
    return (state: IState | undefined, action: Action): IState => {
        if (action.type === SETTINGS_ACTIONS.resetState.type) {
            return reducer(undefined, action);
        }
        return reducer(state, action);
    };
}
