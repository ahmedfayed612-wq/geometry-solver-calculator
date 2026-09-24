/**
 * Tests for numerical tolerance and precision utilities
 */

import { describe, it, expect } from "vitest";
import {
  approxEqual,
  approxZero,
  isPositive,
  isNegative,
  clamp,
  roundTo,
  roundToSignificant,
  smartRound,
  isValidNumber,
  safeDivide,
  safeSqrt,
  safeAsin,
  safeAcos,
  normalizeAngleRadians,
  normalizeAngleDegrees,
  isValidTriangleAngle,
  anglesSumTo180,
  canFormTriangle
} from "../tolerance";

describe("Tolerance Utilities", () => {
  describe("approxEqual", () => {
    it("should identify equal numbers within tolerance", () => {
      expect(approxEqual(1.0, 1.0)).toBe(true);
      expect(approxEqual(1.0, 1.00000000009)).toBe(true);
      expect(approxEqual(1.0, 1.000001)).toBe(false);
    });

    it("should work with custom tolerance", () => {
      expect(approxEqual(1.0, 1.01, 0.02)).toBe(true);
      expect(approxEqual(1.0, 1.01, 0.005)).toBe(false);
    });
  });

  describe("approxZero", () => {
    it("should identify values close to zero", () => {
      expect(approxZero(0)).toBe(true);
      expect(approxZero(0.00000000009)).toBe(true);
      expect(approxZero(0.000001)).toBe(false);
    });
  });

  describe("isPositive", () => {
    it("should identify positive numbers", () => {
      expect(isPositive(1)).toBe(true);
      expect(isPositive(0.0000001)).toBe(true);
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-1)).toBe(false);
    });
  });

  describe("isNegative", () => {
    it("should identify negative numbers", () => {
      expect(isNegative(-1)).toBe(true);
      expect(isNegative(-0.0000001)).toBe(true);
      expect(isNegative(0)).toBe(false);
      expect(isNegative(1)).toBe(false);
    });
  });

  describe("clamp", () => {
    it("should clamp values within range", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe("roundTo", () => {
    it("should round to specified decimal places", () => {
      expect(roundTo(3.14159, 2)).toBeCloseTo(3.14, 5);
      expect(roundTo(3.14159, 4)).toBeCloseTo(3.1416, 5);
      expect(roundTo(3.14159, 0)).toBeCloseTo(3, 5);
    });
  });

  describe("roundToSignificant", () => {
    it("should round to significant figures", () => {
      expect(roundToSignificant(123.456, 3)).toBeCloseTo(123, 0);
      expect(roundToSignificant(0.00123456, 3)).toBeCloseTo(0.00123, 5);
      expect(roundToSignificant(123456, 3)).toBeCloseTo(123000, 0);
    });

    it("should handle zero", () => {
      expect(roundToSignificant(0, 3)).toBe(0);
    });
  });

  describe("smartRound", () => {
    it("should round intelligently based on magnitude", () => {
      expect(smartRound(0.000123456)).toBeCloseTo(0.000123, 6);
      expect(smartRound(0.123456)).toBeCloseTo(0.1235, 4);
      expect(smartRound(123.456)).toBeCloseTo(123.456, 3);
      expect(smartRound(1234.56)).toBeCloseTo(1234.56, 2);
    });

    it("should return zero for very small values", () => {
      expect(smartRound(0.0000000001)).toBe(0);
    });
  });

  describe("isValidNumber", () => {
    it("should identify valid numbers", () => {
      expect(isValidNumber(1)).toBe(true);
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(-1)).toBe(true);
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber(-Infinity)).toBe(false);
      expect(isValidNumber(NaN)).toBe(false);
    });
  });

  describe("safeDivide", () => {
    it("should divide safely", () => {
      expect(safeDivide(10, 2)).toBe(5);
      expect(safeDivide(10, 0)).toBeUndefined();
      expect(safeDivide(10, 0.0000001)).toBeDefined();
    });
  });

  describe("safeSqrt", () => {
    it("should calculate square root safely", () => {
      expect(safeSqrt(4)).toBe(2);
      expect(safeSqrt(0)).toBe(0);
      expect(safeSqrt(-1)).toBeUndefined();
    });
  });

  describe("safeAsin", () => {
    it("should calculate arcsine safely", () => {
      expect(safeAsin(0)).toBeCloseTo(0, 5);
      expect(safeAsin(1)).toBeCloseTo(Math.PI / 2, 5);
      expect(safeAsin(-1)).toBeCloseTo(-Math.PI / 2, 5);
      expect(safeAsin(1.1)).toBeUndefined();
      expect(safeAsin(-1.1)).toBeUndefined();
    });

    it("should clamp values near boundaries", () => {
      expect(safeAsin(1.0000000001)).toBeDefined();
      expect(safeAsin(-1.0000000001)).toBeDefined();
    });
  });

  describe("safeAcos", () => {
    it("should calculate arccosine safely", () => {
      expect(safeAcos(1)).toBeCloseTo(0, 5);
      expect(safeAcos(0)).toBeCloseTo(Math.PI / 2, 5);
      expect(safeAcos(-1)).toBeCloseTo(Math.PI, 5);
      expect(safeAcos(1.1)).toBeUndefined();
      expect(safeAcos(-1.1)).toBeUndefined();
    });

    it("should clamp values near boundaries", () => {
      expect(safeAcos(1.0000000001)).toBeDefined();
      expect(safeAcos(-1.0000000001)).toBeDefined();
    });
  });

  describe("normalizeAngleRadians", () => {
    it("should normalize angles to [0, 2π)", () => {
      expect(normalizeAngleRadians(0)).toBeCloseTo(0, 5);
      expect(normalizeAngleRadians(Math.PI)).toBeCloseTo(Math.PI, 5);
      expect(normalizeAngleRadians(2 * Math.PI)).toBeCloseTo(0, 5);
      expect(normalizeAngleRadians(3 * Math.PI)).toBeCloseTo(Math.PI, 5);
      expect(normalizeAngleRadians(-Math.PI)).toBeCloseTo(Math.PI, 5);
    });
  });

  describe("normalizeAngleDegrees", () => {
    it("should normalize angles to [0, 360)", () => {
      expect(normalizeAngleDegrees(0)).toBeCloseTo(0, 5);
      expect(normalizeAngleDegrees(180)).toBeCloseTo(180, 5);
      expect(normalizeAngleDegrees(360)).toBeCloseTo(0, 5);
      expect(normalizeAngleDegrees(540)).toBeCloseTo(180, 5);
      expect(normalizeAngleDegrees(-180)).toBeCloseTo(180, 5);
    });
  });

  describe("isValidTriangleAngle", () => {
    it("should validate triangle angles", () => {
      expect(isValidTriangleAngle(30)).toBe(true);
      expect(isValidTriangleAngle(90)).toBe(true);
      expect(isValidTriangleAngle(179)).toBe(true);
      expect(isValidTriangleAngle(0)).toBe(false);
      expect(isValidTriangleAngle(180)).toBe(false);
      expect(isValidTriangleAngle(-1)).toBe(false);
      expect(isValidTriangleAngle(181)).toBe(false);
    });
  });

  describe("anglesSumTo180", () => {
    it("should check if angles sum to 180", () => {
      expect(anglesSumTo180(60, 60, 60)).toBe(true);
      expect(anglesSumTo180(90, 45, 45)).toBe(true);
      expect(anglesSumTo180(30, 60, 90)).toBe(true);
      expect(anglesSumTo180(30, 60, 100)).toBe(false);
    });

    it("should handle floating point precision", () => {
      expect(anglesSumTo180(60.0000001, 60, 59.9999999)).toBe(true);
    });
  });

  describe("canFormTriangle", () => {
    it("should check triangle inequality", () => {
      expect(canFormTriangle(3, 4, 5)).toBe(true);
      expect(canFormTriangle(1, 1, 1)).toBe(true);
      expect(canFormTriangle(2, 3, 10)).toBe(false);
      expect(canFormTriangle(1, 2, 3)).toBe(false); // degenerate
    });

    it("should reject non-positive sides", () => {
      expect(canFormTriangle(-1, 2, 2)).toBe(false);
      expect(canFormTriangle(0, 2, 2)).toBe(false);
      expect(canFormTriangle(1, 0, 2)).toBe(false);
    });
  });
});
