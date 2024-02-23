import { Action, ActionReducer } from '@ngrx/store';

import { SETTINGS_ACTIONS } from '../../actions';
import { IState } from '../../i-state';

export function stateRestoreMetaReducer(
    reducer: ActionReducer<IState>,
): ActionReducer<IState> {
    return (state: IState | undefined, action: Action): IState => {
        if (action.type === SETTINGS_ACTIONS.restoreStateFromBackup.type) {
            // The backup contains the whole state, including the app version, which we don't want to restore
            return {
                ...(action as ReturnType<typeof SETTINGS_ACTIONS.restoreStateFromBackup>).state,
                appVersion: state?.appVersion ?? ''
            };
        }
        return reducer(state, action);
    };
}
