import { InjectionToken } from '@angular/core';

export interface ICopyToClipboardHandler {
    copy(text: string): void;
}

export const COPY_TO_CLIPBOARD_HANDLER = new InjectionToken<ICopyToClipboardHandler>('COPY_TO_CLIPBOARD_HANDLER');
