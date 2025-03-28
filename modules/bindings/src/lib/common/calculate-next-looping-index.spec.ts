import { LoopingMode } from '@app/store';

import { calculateNextLoopingIndex } from './calculate-next-looping-index';

describe('calculateNextLoopingIndex', () => {
  describe('should not cross the boundaries of the levels array if looping is disabled', () => {
    it('when incrementing', () => {
      const levels = [1, 2, 3, 4, 5];
      const previousIndex = 4;
      const indexIncrement = 1;
      const isLooping = false;
      const loopingMode = LoopingMode.None;
      const result = calculateNextLoopingIndex(levels, previousIndex, indexIncrement, isLooping, loopingMode);
      expect(result.nextIndex).toBe(4);
      expect(result.isLooping).toBe(false);
    });

    it('when decrementing', () => {
      const levels = [1, 2, 3, 4, 5];
      const previousIndex = 0;
      const indexIncrement = -1;
      const isLooping = false;
      const loopingMode = LoopingMode.None;
      const result = calculateNextLoopingIndex(levels, previousIndex, indexIncrement, isLooping, loopingMode);
      expect(result.nextIndex).toBe(0);
      expect(result.isLooping).toBe(false);
    });
  });

  describe('should jump to the other end of the levels array if looping mode is Wrap and the index is out of bounds', () => {
    it('when incrementing previously not looping', () => {
      const levels = [1, 2, 3, 4, 5];
      const previousIndex = 4;
      const indexIncrement = 1;
      const isLooping = false;
      const loopingMode = LoopingMode.Cycle;
      const result = calculateNextLoopingIndex(levels, previousIndex, indexIncrement, isLooping, loopingMode);
      expect(result.nextIndex).toBe(0);
      expect(result.isLooping).toBe(false);
    });

    it('when decrementing', () => {
      const levels = [1, 2, 3, 4, 5];
      const previousIndex = 0;
      const indexIncrement = -1;
      const isLooping = false;
      const loopingMode = LoopingMode.Cycle;
      const result = calculateNextLoopingIndex(levels, previousIndex, indexIncrement, isLooping, loopingMode);
      expect(result.nextIndex).toBe(4);
      expect(result.isLooping).toBe(false);
    });
  });

  describe('should mirror the traversal of the levels array if looping mode is Mirror and the index is out of bounds', () => {
    it('when incrementing previously not looping', () => {
      const levels = [1, 2, 3, 4, 5];
      const previousIndex = 4;
      const indexIncrement = 1;
      const isLooping = false;
      const loopingMode = LoopingMode.PingPong;
      const result = calculateNextLoopingIndex(levels, previousIndex, indexIncrement, isLooping, loopingMode);
      expect(result.nextIndex).toBe(3);
      expect(result.isLooping).toBe(true);
    });

    it('when decrementing previously not looping', () => {
      const levels = [1, 2, 3, 4, 5];
      const previousIndex = 0;
      const indexIncrement = -1;
      const isLooping = false;
      const loopingMode = LoopingMode.PingPong;
      const result = calculateNextLoopingIndex(levels, previousIndex, indexIncrement, isLooping, loopingMode);
      expect(result.nextIndex).toBe(1);
      expect(result.isLooping).toBe(true);
    });
  });

  describe('should invert increment direction if using Mirror looping mode and previously looping', () => {
    it('when incrementing', () => {
      const levels = [1, 2, 3, 4, 5];
      const previousIndex = 4;
      const indexIncrement = 1;
      const isLooping = true;
      const loopingMode = LoopingMode.PingPong;
      const result = calculateNextLoopingIndex(levels, previousIndex, indexIncrement, isLooping, loopingMode);
      expect(result.nextIndex).toBe(3);
      expect(result.isLooping).toBe(true);
    });

    it('when decrementing', () => {
      const levels = [1, 2, 3, 4, 5];
      const previousIndex = 0;
      const indexIncrement = -1;
      const isLooping = true;
      const loopingMode = LoopingMode.PingPong;
      const result = calculateNextLoopingIndex(levels, previousIndex, indexIncrement, isLooping, loopingMode);
      expect(result.nextIndex).toBe(1);
      expect(result.isLooping).toBe(true);
    });
  });
});
