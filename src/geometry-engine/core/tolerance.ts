/**
 * Numerical tolerance and precision utilities
 */

/**
 * Epsilon for floating-point comparisons
 */
export const EPSILON = 1e-10;

/**
 * Tolerance for considering values equal
 */
export const EQUALITY_TOLERANCE = 1e-8;

/**
 * Check if two numbers are approximately equal
 */
export function approxEqual(a: number, b: number, tolerance = EPSILON): boolean {
  return Math.abs(a - b) < tolerance;
}

/**
 * Check if a number is approximately zero
 */
export function approxZero(value: number, tolerance = EPSILON): boolean {
  return Math.abs(value) < tolerance;
}

/**
 * Check if a number is positive (greater than epsilon)
 */
export function isPositive(value: number): boolean {
  return value > EPSILON;
}

/**
 * Check if a number is negative (less than negative epsilon)
 */
export function isNegative(value: number): boolean {
  return value < -EPSILON;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Round a number to specified decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Round a number to significant figures
 */
export function roundToSignificant(value: number, sigFigs: number): number {
  if (value === 0) return 0;
  const magnitude = Math.floor(Math.log10(Math.abs(value)));
  const scale = Math.pow(10, sigFigs - magnitude - 1);
  return Math.round(value * scale) / scale;
}

/**
 * Smart rounding for display - adjusts precision based on magnitude
 */
export function smartRound(value: number): number {
  if (approxZero(value)) return 0;
  
  const absValue = Math.abs(value);
  
  // Very small numbers - more precision
  if (absValue < 0.001) {
    return roundTo(value, 6);
  }
  // Small numbers - medium precision
  if (absValue < 1) {
    return roundTo(value, 4);
  }
  // Medium numbers - standard precision
  if (absValue < 1000) {
    return roundTo(value, 3);
  }
  // Large numbers - less precision
  return roundTo(value, 2);
}

/**
 * Check if a value is finite and not NaN
 */
export function isValidNumber(value: number): boolean {
  return isFinite(value) && !isNaN(value);
}

/**
 * Safe division - returns undefined if dividing by zero
 */
export function safeDivide(numerator: number, denominator: number): number | undefined {
  if (approxZero(denominator)) {
    return undefined;
  }
  return numerator / denominator;
}

/**
 * Safe square root - returns undefined if negative
 */
export function safeSqrt(value: number): number | undefined {
  if (isNegative(value)) {
    return undefined;
  }
  return Math.sqrt(value);
}

/**
 * Safe arcsin - returns undefined if outside [-1, 1]
 */
export function safeAsin(value: number): number | undefined {
  if (value < -1 - EPSILON || value > 1 + EPSILON) {
    return undefined;
  }
  // Clamp to valid range
  const clamped = clamp(value, -1, 1);
  return Math.asin(clamped);
}

/**
 * Safe arccos - returns undefined if outside [-1, 1]
 */
export function safeAcos(value: number): number | undefined {
  if (value < -1 - EPSILON || value > 1 + EPSILON) {
    return undefined;
  }
  // Clamp to valid range
  const clamped = clamp(value, -1, 1);
  return Math.acos(clamped);
}

/**
 * Normalize an angle to [0, 2π) radians
 */
export function normalizeAngleRadians(angle: number): number {
  const twoPi = 2 * Math.PI;
  angle = angle % twoPi;
  if (angle < 0) {
    angle += twoPi;
  }
  return angle;
}

/**
 * Normalize an angle to [0, 360) degrees
 */
export function normalizeAngleDegrees(angle: number): number {
  angle = angle % 360;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
}

/**
 * Check if an angle is valid (0 < angle < 180 for triangle interior angles)
 */
export function isValidTriangleAngle(angle: number): boolean {
  return isPositive(angle) && angle < 180 - EPSILON;
}

/**
 * Check if angles sum to 180 degrees (triangle)
 */
export function anglesSumTo180(...angles: number[]): boolean {
  const sum = angles.reduce((acc, angle) => acc + angle, 0);
  return approxEqual(sum, 180, EQUALITY_TOLERANCE);
}

/**
 * Check if three values can form a triangle (triangle inequality)
 */
export function canFormTriangle(a: number, b: number, c: number): boolean {
  return (
    isPositive(a) &&
    isPositive(b) &&
    isPositive(c) &&
    a + b > c + EPSILON &&
    a + c > b + EPSILON &&
    b + c > a + EPSILON
  );
}
