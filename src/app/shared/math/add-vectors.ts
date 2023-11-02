import { Vector } from '../types';

export function addVectors(
    vector1: Readonly<Vector>,
    vector2: Readonly<Vector>
): Vector {
    return {
        x: vector1.x + vector2.x,
        y: vector1.y + vector2.y
    };
}
