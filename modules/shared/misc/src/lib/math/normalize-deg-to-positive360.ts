export function normalizeDegToPositive360(degrees: number): number {
  const normalizedDegrees = degrees % 360;
  return normalizedDegrees < 0 ? normalizedDegrees + 360 : normalizedDegrees;
}
