import { Injectable } from '@angular/core';
import { HashService } from '@app/shared';

@Injectable({ providedIn: 'root' })
export class ControllerProfileGenericGamepadUidBuilderService {
    constructor(
        private readonly hashService: HashService
    ) {
    }

    public buildUid(
        id: string,
        axesCount: number,
        buttonsCount: number
    ): string {
        return [
            `[${this.hashService.murmur3(id)}]`,
            `[a${axesCount}]`,
            `[b${buttonsCount}]`
        ].join('');
    }

    public parseUid(
        uid: string
    ): { axesCount: number; buttonsCount: number } | null {
        const match = uid.match(/^\[([a-zA-Z0-9]*)]\[a(\d+)]\[b(\d+)]$/);
        if (match?.length !== 4) {
            return null;
        }
        const [ , , axesCount, buttonsCount ] = match;
        return {
            axesCount: parseInt(axesCount, 10),
            buttonsCount: parseInt(buttonsCount, 10)
        };
    }
}
