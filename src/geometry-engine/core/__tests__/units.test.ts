/**
 * Tests for unit conversion utilities
 */

import { describe, it, expect } from "vitest";
import {
  lengthToMeters,
  lengthFromMeters,
  convertLength,
  degreesToRadians,
  radiansToDegrees,
  convertAngle,
  getAreaUnit,
  normalizeLengths,
  denormalizeLengths
} from "../units";

describe("Unit Conversion", () => {
  describe("Length Conversions", () => {
    it("should convert mm to meters", () => {
      expect(lengthToMeters(1000, "mm")).toBeCloseTo(1, 5);
      expect(lengthToMeters(1, "mm")).toBeCloseTo(0.001, 5);
    });

    it("should convert cm to meters", () => {
      expect(lengthToMeters(100, "cm")).toBeCloseTo(1, 5);
      expect(lengthToMeters(1, "cm")).toBeCloseTo(0.01, 5);
    });

    it("should convert meters to meters", () => {
      expect(lengthToMeters(1, "m")).toBeCloseTo(1, 5);
    });

    it("should convert km to meters", () => {
      expect(lengthToMeters(1, "km")).toBeCloseTo(1000, 5);
      expect(lengthToMeters(0.001, "km")).toBeCloseTo(1, 5);
    });

    it("should convert from meters to mm", () => {
      expect(lengthFromMeters(1, "mm")).toBeCloseTo(1000, 5);
      expect(lengthFromMeters(0.001, "mm")).toBeCloseTo(1, 5);
    });

    it("should convert from meters to cm", () => {
      expect(lengthFromMeters(1, "cm")).toBeCloseTo(100, 5);
      expect(lengthFromMeters(0.01, "cm")).toBeCloseTo(1, 5);
    });

    it("should convert from meters to km", () => {
      expect(lengthFromMeters(1000, "km")).toBeCloseTo(1, 5);
      expect(lengthFromMeters(1, "km")).toBeCloseTo(0.001, 5);
    });

    it("should convert between length units", () => {
      expect(convertLength(1000, "mm", "cm")).toBeCloseTo(100, 5);
      expect(convertLength(100, "cm", "m")).toBeCloseTo(1, 5);
      expect(convertLength(1, "m", "km")).toBeCloseTo(0.001, 5);
      expect(convertLength(1, "km", "m")).toBeCloseTo(1000, 5);
    });
  });

  describe("Angle Conversions", () => {
    it("should convert degrees to radians", () => {
      expect(degreesToRadians(0)).toBeCloseTo(0, 5);
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 5);
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 5);
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI, 5);
    });

    it("should convert radians to degrees", () => {
      expect(radiansToDegrees(0)).toBeCloseTo(0, 5);
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90, 5);
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180, 5);
      expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360, 5);
    });

    it("should convert between angle units", () => {
      expect(convertAngle(90, "degrees", "radians")).toBeCloseTo(Math.PI / 2, 5);
      expect(convertAngle(Math.PI, "radians", "degrees")).toBeCloseTo(180, 5);
    });

    it("should return same value when units match", () => {
      expect(convertAngle(45, "degrees", "degrees")).toBe(45);
      expect(convertAngle(Math.PI / 4, "radians", "radians")).toBeCloseTo(Math.PI / 4, 5);
    });
  });

  describe("Area Units", () => {
    it("should return correct area unit suffix", () => {
      expect(getAreaUnit("mm")).toBe("mm²");
      expect(getAreaUnit("cm")).toBe("cm²");
      expect(getAreaUnit("m")).toBe("m²");
      expect(getAreaUnit("km")).toBe("km²");
    });
  });

  describe("Normalization", () => {
    it("should normalize lengths to meters", () => {
      const input = { a: 100, b: 50, c: 25 };
      const normalized = normalizeLengths(input, "cm");
      
      expect(normalized.a).toBeCloseTo(1, 5);
      expect(normalized.b).toBeCloseTo(0.5, 5);
      expect(normalized.c).toBeCloseTo(0.25, 5);
    });

    it("should denormalize lengths from meters", () => {
      const input = { a: 1, b: 0.5, c: 0.25 };
      const denormalized = denormalizeLengths(input, "cm");
      
      expect(denormalized.a).toBeCloseTo(100, 5);
      expect(denormalized.b).toBeCloseTo(50, 5);
      expect(denormalized.c).toBeCloseTo(25, 5);
    });

    it("should handle undefined values in normalization", () => {
      const input = { a: 100, b: undefined, c: 25 };
      const normalized = normalizeLengths(input, "cm");
      
      expect(normalized.a).toBeCloseTo(1, 5);
      expect(normalized.b).toBeUndefined();
      expect(normalized.c).toBeCloseTo(0.25, 5);
    });

    it("should preserve non-numeric values", () => {
      const input = { a: 100, b: 50, c: 25 };
      const normalized = normalizeLengths(input, "cm");
      
      expect(typeof normalized.a).toBe("number");
      expect(typeof normalized.b).toBe("number");
      expect(typeof normalized.c).toBe("number");
    });
  });
});
