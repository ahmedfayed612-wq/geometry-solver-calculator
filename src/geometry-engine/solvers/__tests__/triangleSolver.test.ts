/**
 * Comprehensive tests for triangle solver
 */

import { describe, it, expect } from "vitest";
import { solveTriangle } from "../triangleSolver";
import type { TriangleInput } from "../../core/types";

describe("Triangle Solver", () => {
  describe("SSS (Side-Side-Side)", () => {
    it("should solve a valid SSS triangle", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 4, c: 5 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.sides).toBeDefined();
      expect(result.sides?.a).toBeCloseTo(3, 2);
      expect(result.sides?.b).toBeCloseTo(4, 2);
      expect(result.sides?.c).toBeCloseTo(5, 2);
      expect(result.angles).toBeDefined();
      expect(result.angles?.A).toBeCloseTo(36.87, 1);
      expect(result.angles?.B).toBeCloseTo(53.13, 1);
      expect(result.angles?.C).toBeCloseTo(90, 1);
      expect(result.area).toBeCloseTo(6, 2);
      expect(result.perimeter).toBeCloseTo(12, 2);
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it("should reject impossible triangle (triangle inequality)", () => {
      const input: TriangleInput = {
        sides: { a: 2, b: 3, c: 10 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(e => e.includes("cannot form a triangle"))).toBe(true);
    });

    it("should reject negative side lengths", () => {
      const input: TriangleInput = {
        sides: { a: -3, b: 4, c: 5 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
    });
  });

  describe("SAS (Side-Angle-Side)", () => {
    it("should solve SAS triangle with sides a, b and angle C", () => {
      const input: TriangleInput = {
        sides: { a: 8, b: 11 },
        angles: { C: 42 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.sides).toBeDefined();
      expect(result.sides?.a).toBeCloseTo(8, 2);
      expect(result.sides?.b).toBeCloseTo(11, 2);
      expect(result.sides?.c).toBeDefined();
      expect(result.angles).toBeDefined();
      expect(result.angles?.C).toBeCloseTo(42, 2);
      expect(result.area).toBeDefined();
      expect(result.perimeter).toBeDefined();
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it("should solve SAS triangle with sides b, c and angle A", () => {
      const input: TriangleInput = {
        sides: { b: 5, c: 7 },
        angles: { A: 30 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.sides).toBeDefined();
      expect(result.angles).toBeDefined();
      expect(result.area).toBeDefined();
    });
  });

  describe("ASA (Angle-Side-Angle)", () => {
    it("should solve ASA triangle", () => {
      const input: TriangleInput = {
        sides: { c: 10 },
        angles: { A: 45, B: 60 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.sides).toBeDefined();
      expect(result.sides?.c).toBeCloseTo(10, 2);
      expect(result.angles).toBeDefined();
      expect(result.angles?.A).toBeCloseTo(45, 2);
      expect(result.angles?.B).toBeCloseTo(60, 2);
      expect(result.angles?.C).toBeCloseTo(75, 2);
      expect(result.area).toBeDefined();
      expect(result.perimeter).toBeDefined();
    });

    it("should calculate third angle correctly", () => {
      const input: TriangleInput = {
        sides: { c: 5 },
        angles: { A: 50, B: 70 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.angles?.C).toBeCloseTo(60, 2);
    });
  });

  describe("AAS (Angle-Angle-Side)", () => {
    it("should solve AAS triangle", () => {
      const input: TriangleInput = {
        sides: { a: 7 },
        angles: { A: 40, B: 65 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.sides).toBeDefined();
      expect(result.sides?.a).toBeCloseTo(7, 2);
      expect(result.angles).toBeDefined();
      expect(result.angles?.A).toBeCloseTo(40, 2);
      expect(result.angles?.B).toBeCloseTo(65, 2);
      expect(result.angles?.C).toBeCloseTo(75, 2);
      expect(result.area).toBeDefined();
      expect(result.perimeter).toBeDefined();
    });
  });

  describe("SSA (Side-Side-Angle) - Ambiguous Case", () => {
    it("should handle SSA with one solution", () => {
      const input: TriangleInput = {
        sides: { a: 15, b: 10 },
        angles: { A: 30 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.sides).toBeDefined();
      expect(result.angles).toBeDefined();
    });

    it("should handle SSA with two solutions", () => {
      const input: TriangleInput = {
        sides: { a: 8, b: 10 },
        angles: { A: 40 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("MULTIPLE_SOLUTIONS");
      expect(result.alternativeSolution).toBeDefined();
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(e => e.includes("Two valid geometric solutions"))).toBe(true);
    });

    it("should handle SSA with no solution", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 10 },
        angles: { A: 30 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(e => e.includes("No valid triangle"))).toBe(true);
    });
  });

  describe("Right Triangle", () => {
    it("should solve right triangle with two legs", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 4 },
        isRightTriangle: true,
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.sides?.c).toBeCloseTo(5, 2);
      expect(result.angles?.C).toBeCloseTo(90, 2);
      expect(result.area).toBeCloseTo(6, 2);
    });

    it("should solve right triangle with leg and hypotenuse", () => {
      const input: TriangleInput = {
        sides: { a: 3, c: 5 },
        isRightTriangle: true,
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.sides?.b).toBeCloseTo(4, 2);
    });

    it("should solve right triangle with leg and angle", () => {
      const input: TriangleInput = {
        sides: { a: 6 },
        angles: { A: 30 },
        isRightTriangle: true,
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.sides?.b).toBeDefined();
      expect(result.sides?.c).toBeDefined();
      expect(result.angles?.B).toBeCloseTo(60, 2);
    });

    it("should detect right triangle from 90° angle", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 4 },
        angles: { C: 90 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.sides?.c).toBeCloseTo(5, 2);
    });

    it("should reject non-right triangle marked as right", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 4, c: 6 },
        isRightTriangle: true,
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors?.some(e => e.includes("Pythagorean"))).toBe(true);
    });
  });

  describe("Equilateral Triangle", () => {
    it("should solve equilateral triangle", () => {
      const input: TriangleInput = {
        sides: { a: 5, b: 5, c: 5 },
        isEquilateral: true,
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.angles?.A).toBeCloseTo(60, 2);
      expect(result.angles?.B).toBeCloseTo(60, 2);
      expect(result.angles?.C).toBeCloseTo(60, 2);
      expect(result.area).toBeCloseTo(10.83, 1);
    });

    it("should reject non-equilateral marked as equilateral", () => {
      const input: TriangleInput = {
        sides: { a: 5, b: 5, c: 6 },
        isEquilateral: true,
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors?.some(e => e.includes("not equal"))).toBe(true);
    });
  });

  describe("Isosceles Triangle", () => {
    it("should solve isosceles triangle", () => {
      const input: TriangleInput = {
        sides: { a: 5, b: 5, c: 6 },
        isIsosceles: true,
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.angles?.A).toBeCloseTo(result.angles?.B, 1);
    });

    it("should reject non-isosceles marked as isosceles", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 4, c: 5 },
        isIsosceles: true,
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors?.some(e => e.includes("No two sides are equal"))).toBe(true);
    });
  });

  describe("Validation", () => {
    it("should reject insufficient information", () => {
      const input: TriangleInput = {
        sides: { a: 5 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("INSUFFICIENT_INFORMATION");
      expect(result.errors).toBeDefined();
    });

    it("should reject invalid angles", () => {
      const input: TriangleInput = {
        angles: { A: 200, B: -10 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
    });

    it("should reject angles that don't sum to 180", () => {
      const input: TriangleInput = {
        angles: { A: 50, B: 60, C: 80 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors?.some(e => e.includes("sum to 180"))).toBe(true);
    });

    it("should reject no input at all", () => {
      const input: TriangleInput = {
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.status).toBe("INSUFFICIENT_INFORMATION");
      expect(result.errors).toBeDefined();
    });
  });

  describe("Additional Properties", () => {
    it("should calculate semiperimeter", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 4, c: 5 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.semiperimeter).toBeCloseTo(6, 2);
    });

    it("should calculate circumradius", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 4, c: 5 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.circumradius).toBeDefined();
      expect(result.circumradius).toBeCloseTo(2.5, 2);
    });

    it("should calculate inradius", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 4, c: 5 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.inradius).toBeDefined();
      expect(result.inradius).toBeCloseTo(1, 2);
    });

    it("should calculate altitudes", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 4, c: 5 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.altitudes).toBeDefined();
      expect(result.altitudes?.ha).toBeDefined();
      expect(result.altitudes?.hb).toBeDefined();
      expect(result.altitudes?.hc).toBeDefined();
    });

    it("should calculate medians", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 4, c: 5 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.medians).toBeDefined();
      expect(result.medians?.ma).toBeDefined();
      expect(result.medians?.mb).toBeDefined();
      expect(result.medians?.mc).toBeDefined();
    });
  });

  describe("Unit Conversion", () => {
    it("should handle different length units", () => {
      const inputMM: TriangleInput = {
        sides: { a: 3000, b: 4000, c: 5000 },
        unit: "mm"
      };

      const resultMM = solveTriangle(inputMM);

      expect(resultMM.status).toBe("SOLVED");
      expect(resultMM.unit).toBe("mm");
      expect(resultMM.area).toBeDefined();
    });

    it("should convert units correctly", () => {
      const inputCM: TriangleInput = {
        sides: { a: 3, b: 4, c: 5 },
        unit: "cm"
      };

      const inputM: TriangleInput = {
        sides: { a: 0.03, b: 0.04, c: 0.05 },
        unit: "m"
      };

      const resultCM = solveTriangle(inputCM);
      const resultM = solveTriangle(inputM);

      // Areas should be proportional to unit squared
      // 3cm = 0.03m, so the area in cm² should be 10000 times the area in m²
      const areaRatio = resultCM.area! / resultM.area!;
      const expectedRatio = 100 * 100; // cm² to m² conversion factor
      expect(areaRatio).toBeCloseTo(expectedRatio, 3);
    });
  });

  describe("Calculation Steps", () => {
    it("should provide calculation steps for SSS", () => {
      const input: TriangleInput = {
        sides: { a: 3, b: 4, c: 5 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps[0].formula).toBeDefined();
      expect(result.steps[0].explanation).toBeDefined();
    });

    it("should provide calculation steps for SAS", () => {
      const input: TriangleInput = {
        sides: { a: 8, b: 11 },
        angles: { C: 42 },
        unit: "cm"
      };

      const result = solveTriangle(input);

      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps.some(s => s.formula.includes("c²") || s.formula.includes("Law of Cosines"))).toBe(true);
    });
  });
});
