/**
 * Comprehensive tests for square solver
 */

import { describe, it, expect } from "vitest";
import { solveSquare } from "../squareSolver";
import type { SquareInput } from "../../core/types";

describe("Square Solver", () => {
  describe("Side Input", () => {
    it("should solve from side length", () => {
      const input: SquareInput = {
        side: 5,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("SOLVED");
      expect(result.side).toBeCloseTo(5, 2);
      expect(result.perimeter).toBeCloseTo(20, 2);
      expect(result.area).toBeCloseTo(25, 2);
      expect(result.diagonal).toBeCloseTo(7.07, 2);
      expect(result.interiorAngle).toBe(90);
      expect(result.steps.length).toBeGreaterThan(0);
    });
  });

  describe("Perimeter Input", () => {
    it("should solve from perimeter", () => {
      const input: SquareInput = {
        perimeter: 20,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("SOLVED");
      expect(result.side).toBeCloseTo(5, 2);
      expect(result.perimeter).toBeCloseTo(20, 2);
      expect(result.area).toBeCloseTo(25, 2);
      expect(result.diagonal).toBeCloseTo(7.07, 2);
    });

    it("should calculate side correctly from perimeter", () => {
      const input: SquareInput = {
        perimeter: 40,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.side).toBeCloseTo(10, 2);
    });
  });

  describe("Area Input", () => {
    it("should solve from area", () => {
      const input: SquareInput = {
        area: 25,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("SOLVED");
      expect(result.side).toBeCloseTo(5, 2);
      expect(result.perimeter).toBeCloseTo(20, 2);
      expect(result.area).toBeCloseTo(25, 2);
      expect(result.diagonal).toBeCloseTo(7.07, 2);
    });

    it("should calculate side correctly from area", () => {
      const input: SquareInput = {
        area: 100,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.side).toBeCloseTo(10, 2);
    });
  });

  describe("Diagonal Input", () => {
    it("should solve from diagonal", () => {
      const input: SquareInput = {
        diagonal: 7.07,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("SOLVED");
      expect(result.side).toBeCloseTo(5, 2);
      expect(result.perimeter).toBeCloseTo(20, 2);
      expect(result.area).toBeCloseTo(25, 1);
      expect(result.diagonal).toBeCloseTo(7.07, 2);
    });

    it("should calculate side correctly from diagonal", () => {
      const input: SquareInput = {
        diagonal: 14.14,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.side).toBeCloseTo(10, 2);
    });
  });

  describe("Validation", () => {
    it("should reject negative side", () => {
      const input: SquareInput = {
        side: -5,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
    });

    it("should reject negative perimeter", () => {
      const input: SquareInput = {
        perimeter: -20,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
    });

    it("should reject negative area", () => {
      const input: SquareInput = {
        area: -25,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
    });

    it("should reject negative diagonal", () => {
      const input: SquareInput = {
        diagonal: -7.07,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
    });

    it("should reject inconsistent values", () => {
      const input: SquareInput = {
        side: 5,
        perimeter: 30, // Should be 20 for side=5
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors?.some(e => e.includes("inconsistent"))).toBe(true);
    });

    it("should reject no input", () => {
      const input: SquareInput = {
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("INSUFFICIENT_INFORMATION");
      expect(result.errors).toBeDefined();
    });
  });

  describe("Unit Conversion", () => {
    it("should handle mm units", () => {
      const input: SquareInput = {
        side: 50,
        unit: "mm"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("SOLVED");
      expect(result.unit).toBe("mm");
      expect(result.side).toBeCloseTo(50, 2);
      expect(result.area).toBeCloseTo(2500, 2); // mm²
    });

    it("should handle m units", () => {
      const input: SquareInput = {
        side: 0.05,
        unit: "m"
      };

      const result = solveSquare(input);

      expect(result.status).toBe("SOLVED");
      expect(result.unit).toBe("m");
      expect(result.side).toBeCloseTo(0.05, 3);
      expect(result.area).toBeCloseTo(0.0025, 4); // m²
    });

    it("should convert units correctly", () => {
      const inputCM: SquareInput = {
        side: 5,
        unit: "cm"
      };

      const inputM: SquareInput = {
        side: 0.05,
        unit: "m"
      };

      const resultCM = solveSquare(inputCM);
      const resultM = solveSquare(inputM);

      // Areas should be proportional to unit squared
      const areaRatio = resultCM.area! / resultM.area!;
      const expectedRatio = 100 * 100; // cm² to m²
      expect(areaRatio).toBeCloseTo(expectedRatio, 3);
    });
  });

  describe("Calculation Steps", () => {
    it("should provide calculation steps from side", () => {
      const input: SquareInput = {
        side: 5,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps[0].formula).toBeDefined();
      expect(result.steps[0].explanation).toBeDefined();
    });

    it("should provide calculation steps from perimeter", () => {
      const input: SquareInput = {
        perimeter: 20,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps.some(s => s.formula.includes("P/4"))).toBe(true);
    });

    it("should provide calculation steps from area", () => {
      const input: SquareInput = {
        area: 25,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps.some(s => s.formula.includes("√A"))).toBe(true);
    });

    it("should provide calculation steps from diagonal", () => {
      const input: SquareInput = {
        diagonal: 7.07,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps.some(s => s.formula.includes("d/√2"))).toBe(true);
    });
  });

  describe("Interior Angle", () => {
    it("should always return 90° for interior angle", () => {
      const input: SquareInput = {
        side: 5,
        unit: "cm"
      };

      const result = solveSquare(input);

      expect(result.interiorAngle).toBe(90);
    });
  });
});
