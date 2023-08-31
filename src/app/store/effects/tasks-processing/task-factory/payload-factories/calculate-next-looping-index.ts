import { LoopingMode } from '@app/store';

export function calculateNextLoopingIndex(
    levels: number[],
    previousIndex: number,
    indexIncrement: 1 | -1 | 0,
    isLooping: boolean,
    loopingMode: LoopingMode,
): { nextIndex: number; isLooping: boolean } {
    if (levels[previousIndex + indexIncrement] !== undefined) {
        return {
            nextIndex: previousIndex + indexIncrement,
            isLooping
        };
    } else if (loopingMode === LoopingMode.Wrap) {
        return {
            nextIndex: indexIncrement === 1 ? 0 : levels.length - 1,
            isLooping: isLooping
        };
    } else if (loopingMode === LoopingMode.Mirror) {
        return {
            nextIndex: indexIncrement === 1 ? levels.length - 2 : 1,
            isLooping: !isLooping
        };
    }
    return {
        nextIndex: previousIndex,
        isLooping
    };
}
