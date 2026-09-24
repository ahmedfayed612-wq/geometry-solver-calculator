/**
 * Unit conversion utilities
 * All internal calculations use meters (m) for length and radians for angles
 */

import type { LengthUnit, AngleUnit } from "./types";

/**
 * Conversion factors to meters (base unit)
 */
const LENGTH_TO_METERS: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
};

/**
 * Conversion factors from meters
 */
const METERS_TO_LENGTH: Record<LengthUnit, number> = {
  mm: 1000,
  cm: 100,
  m: 1,
  km: 0.001,
};

/**
 * Convert length to meters (base unit)
 */
export function lengthToMeters(value: number, from: LengthUnit): number {
  return value * LENGTH_TO_METERS[from];
}

/**
 * Convert length from meters to specified unit
 */
export function lengthFromMeters(value: number, to: LengthUnit): number {
  return value * METERS_TO_LENGTH[to];
}

/**
 * Convert length between units
 */
export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit
): number {
  const inMeters = lengthToMeters(value, from);
  return lengthFromMeters(inMeters, to);
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Convert angle between units
 */
export function convertAngle(
  value: number,
  from: AngleUnit,
  to: AngleUnit
): number {
  if (from === to) return value;
  if (from === "degrees" && to === "radians") {
    return degreesToRadians(value);
  }
  if (from === "radians" && to === "degrees") {
    return radiansToDegrees(value);
  }
  return value;
}

/**
 * Get area unit suffix based on length unit
 */
export function getAreaUnit(lengthUnit: LengthUnit): string {
  return `${lengthUnit}²`;
}

/**
 * Normalize all length values in an object to meters
 */
export function normalizeLengths<T extends Record<string, number | undefined>>(
  obj: T,
  unit: LengthUnit
): T {
  const result = { ...obj };
  for (const key in result) {
    if (typeof result[key] === "number") {
      result[key] = lengthToMeters(result[key] as number, unit) as T[Extract<
        keyof T,
        string
      >];
    }
  }
  return result;
}

/**
 * Convert lengths from meters to specified unit
 */
export function denormalizeLengths<T extends Record<string, number>>(
  obj: T,
  unit: LengthUnit
): T {
  const result = { ...obj };
  for (const key in result) {
    if (typeof result[key] === "number") {
      result[key] = lengthFromMeters(result[key] as number, unit) as T[Extract<
        keyof T,
        string
      >];
    }
  }
  return result;
}
