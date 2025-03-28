import { getTranslationArcs, transformRelativeDegToAbsoluteDeg } from './servo-math';

describe('transformRelativeDegToAbsoluteDeg', () => {
  it('should return the correct absolute degrees', () => {
    expect(transformRelativeDegToAbsoluteDeg(0)).toEqual(0);
    expect(transformRelativeDegToAbsoluteDeg(-0)).toEqual(0);
    expect(transformRelativeDegToAbsoluteDeg(90)).toEqual(90);
    expect(transformRelativeDegToAbsoluteDeg(180)).toEqual(180);
    expect(transformRelativeDegToAbsoluteDeg(181)).toEqual(-179);
    expect(transformRelativeDegToAbsoluteDeg(359)).toEqual(-1);
    expect(transformRelativeDegToAbsoluteDeg(360)).toEqual(0);
    expect(transformRelativeDegToAbsoluteDeg(361)).toEqual(1);
    expect(transformRelativeDegToAbsoluteDeg(-90)).toEqual(-90);
    expect(transformRelativeDegToAbsoluteDeg(-179)).toEqual(-179);
    expect(transformRelativeDegToAbsoluteDeg(-180)).toEqual(180);
    expect(transformRelativeDegToAbsoluteDeg(-360)).toEqual(0);
    expect(transformRelativeDegToAbsoluteDeg(-361)).toEqual(-1);
  });
});

describe('getTranslationArcs', () => {
  it('should return the correct translation paths', () => {
    expect(getTranslationArcs(0, 0)).toEqual({ cw: 0, ccw: 0 });
    expect(getTranslationArcs(-0, -0)).toEqual({ cw: 0, ccw: 0 });
    expect(getTranslationArcs(1, 2)).toEqual({ cw: 1, ccw: 359 });
    expect(getTranslationArcs(2, 1)).toEqual({ cw: 359, ccw: 1 });
    expect(getTranslationArcs(-1, -2)).toEqual({ cw: 359, ccw: 1 });
  });
});
