import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ICopyToClipboardHandler } from '@app/shared-ui';

import { COMMON_ACTIONS } from './actions';

@Injectable()
export class CopyToClipboardHandlerService implements ICopyToClipboardHandler {
    constructor(
        private readonly store: Store
    ) {
    }

    public copy(
        content: string
    ): void {
        this.store.dispatch(COMMON_ACTIONS.copyToClipboard({ content }));
    }
}
