import { Vector } from '../types';
import { degToRad } from './deg-to-rad';

export function unitVectorFromAngle(angleDegrees: number): Vector {
  return {
    x: Math.cos(degToRad(angleDegrees)),
    y: Math.sin(degToRad(angleDegrees)),
  };
}
