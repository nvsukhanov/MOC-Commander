import { InjectionToken } from '@angular/core';

export interface IChangelog extends Array<{
    version: string;
    changeL10nKeys: Array<string>;
}> { }

export const CHANGELOG_TOKEN = new InjectionToken<IChangelog>('CHANGELOG');
