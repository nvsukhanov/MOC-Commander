import { Vector } from '../types';

export function scalarMultiply(
    scalar: number,
    vector: Readonly<Vector>
): Vector {
    return {
        x: scalar * vector.x,
        y: scalar * vector.y
    };
}
