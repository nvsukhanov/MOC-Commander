import { LoopingMode } from '../../../../models';

export function calculateNextLoopingIndex(
    levels: number[],
    previousIndex: number,
    indexIncrement: 1 | -1 | 0,
    isLooping: boolean,
    loopingMode: LoopingMode,
): { nextIndex: number; isLooping: boolean } {
    const evaluatedIndexIncrement = isLooping ? -indexIncrement : indexIncrement;
    if (levels[previousIndex + evaluatedIndexIncrement] !== undefined) {
        return {
            nextIndex: previousIndex + evaluatedIndexIncrement,
            isLooping: loopingMode !== LoopingMode.None ? isLooping : false
        };
    } else if (loopingMode === LoopingMode.Wrap) {
        return {
            nextIndex: evaluatedIndexIncrement === 1 ? 0 : levels.length - 1,
            isLooping: false
        };
    } else if (loopingMode === LoopingMode.Mirror) {
        return {
            nextIndex: evaluatedIndexIncrement === 1 ? levels.length - 2 : 1,
            isLooping: !isLooping
        };
    }
    return {
        nextIndex: previousIndex,
        isLooping
    };
}
