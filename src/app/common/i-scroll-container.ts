import { InjectionToken } from '@angular/core';

export interface IScrollContainer {
    scrollToBottom(): void;
}

export const SCROLL_CONTAINER = new InjectionToken<IScrollContainer>('SCROLL_CONTAINER');
