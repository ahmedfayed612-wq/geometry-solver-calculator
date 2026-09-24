/**
 * Comprehensive tests for rectangle solver
 */

import { describe, it, expect } from "vitest";
import { solveRectangle } from "../rectangleSolver";
import type { RectangleInput } from "../../core/types";

describe("Rectangle Solver", () => {
  describe("Length and Width Input", () => {
    it("should solve from length and width", () => {
      const input: RectangleInput = {
        length: 5,
        width: 3,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.length).toBeCloseTo(5, 2);
      expect(result.width).toBeCloseTo(3, 2);
      expect(result.perimeter).toBeCloseTo(16, 2);
      expect(result.area).toBeCloseTo(15, 2);
      expect(result.diagonal).toBeCloseTo(5.83, 2);
      expect(result.interiorAngles.all).toBe(90);
      expect(result.steps.length).toBeGreaterThan(0);
    });
  });

  describe("Length and Area Input", () => {
    it("should solve from length and area", () => {
      const input: RectangleInput = {
        length: 5,
        area: 15,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.length).toBeCloseTo(5, 2);
      expect(result.width).toBeCloseTo(3, 2);
      expect(result.perimeter).toBeCloseTo(16, 2);
      expect(result.area).toBeCloseTo(15, 2);
      expect(result.diagonal).toBeCloseTo(5.83, 2);
    });

    it("should calculate width correctly from length and area", () => {
      const input: RectangleInput = {
        length: 10,
        area: 50,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.width).toBeCloseTo(5, 2);
    });
  });

  describe("Width and Area Input", () => {
    it("should solve from width and area", () => {
      const input: RectangleInput = {
        width: 3,
        area: 15,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.length).toBeCloseTo(5, 2);
      expect(result.width).toBeCloseTo(3, 2);
      expect(result.perimeter).toBeCloseTo(16, 2);
      expect(result.area).toBeCloseTo(15, 2);
      expect(result.diagonal).toBeCloseTo(5.83, 2);
    });

    it("should calculate length correctly from width and area", () => {
      const input: RectangleInput = {
        width: 5,
        area: 50,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.length).toBeCloseTo(10, 2);
    });
  });

  describe("Length and Perimeter Input", () => {
    it("should solve from length and perimeter", () => {
      const input: RectangleInput = {
        length: 5,
        perimeter: 16,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.length).toBeCloseTo(5, 2);
      expect(result.width).toBeCloseTo(3, 2);
      expect(result.perimeter).toBeCloseTo(16, 2);
      expect(result.area).toBeCloseTo(15, 2);
      expect(result.diagonal).toBeCloseTo(5.83, 2);
    });

    it("should calculate width correctly from length and perimeter", () => {
      const input: RectangleInput = {
        length: 10,
        perimeter: 30,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.width).toBeCloseTo(5, 2);
    });
  });

  describe("Width and Perimeter Input", () => {
    it("should solve from width and perimeter", () => {
      const input: RectangleInput = {
        width: 3,
        perimeter: 16,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.length).toBeCloseTo(5, 2);
      expect(result.width).toBeCloseTo(3, 2);
      expect(result.perimeter).toBeCloseTo(16, 2);
      expect(result.area).toBeCloseTo(15, 2);
      expect(result.diagonal).toBeCloseTo(5.83, 2);
    });

    it("should calculate length correctly from width and perimeter", () => {
      const input: RectangleInput = {
        width: 5,
        perimeter: 30,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.length).toBeCloseTo(10, 2);
    });
  });

  describe("Length and Diagonal Input", () => {
    it("should solve from length and diagonal", () => {
      const input: RectangleInput = {
        length: 5,
        diagonal: 5.83,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.length).toBeCloseTo(5, 2);
      expect(result.width).toBeCloseTo(3, 2);
      expect(result.perimeter).toBeCloseTo(16, 2);
      expect(result.area).toBeCloseTo(15, 1);
      expect(result.diagonal).toBeCloseTo(5.83, 2);
    });

    it("should calculate width correctly from length and diagonal", () => {
      const input: RectangleInput = {
        length: 10,
        diagonal: 11.18,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.width).toBeCloseTo(5, 2);
    });

    it("should reject diagonal too short for given length", () => {
      const input: RectangleInput = {
        length: 10,
        diagonal: 5, // Too short for length 10
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors?.some(e => e.includes("too short"))).toBe(true);
    });
  });

  describe("Width and Diagonal Input", () => {
    it("should solve from width and diagonal", () => {
      const input: RectangleInput = {
        width: 3,
        diagonal: 5.83,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.length).toBeCloseTo(5, 2);
      expect(result.width).toBeCloseTo(3, 2);
      expect(result.perimeter).toBeCloseTo(16, 2);
      expect(result.area).toBeCloseTo(15, 2);
      expect(result.diagonal).toBeCloseTo(5.83, 2);
    });

    it("should calculate length correctly from width and diagonal", () => {
      const input: RectangleInput = {
        width: 5,
        diagonal: 11.18,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.length).toBeCloseTo(10, 2);
    });

    it("should reject diagonal too short for given width", () => {
      const input: RectangleInput = {
        width: 10,
        diagonal: 5, // Too short for width 10
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors?.some(e => e.includes("too short"))).toBe(true);
    });
  });

  describe("Area and Perimeter Input", () => {
    it("should solve from area and perimeter", () => {
      const input: RectangleInput = {
        area: 15,
        perimeter: 16,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.length).toBeCloseTo(5, 2);
      expect(result.width).toBeCloseTo(3, 2);
      expect(result.perimeter).toBeCloseTo(16, 2);
      expect(result.area).toBeCloseTo(15, 2);
      expect(result.diagonal).toBeCloseTo(5.83, 2);
    });

    it("should handle larger values", () => {
      const input: RectangleInput = {
        area: 50,
        perimeter: 30,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.length).toBeCloseTo(10, 2);
      expect(result.width).toBeCloseTo(5, 2);
    });

    it("should reject impossible area and perimeter combination", () => {
      const input: RectangleInput = {
        area: 100,
        perimeter: 10, // Too small perimeter for area 100
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors?.some(e => e.includes("No valid rectangle"))).toBe(true);
    });
  });

  describe("Validation", () => {
    it("should reject negative length", () => {
      const input: RectangleInput = {
        length: -5,
        width: 3,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
    });

    it("should reject negative width", () => {
      const input: RectangleInput = {
        length: 5,
        width: -3,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
    });

    it("should reject negative area", () => {
      const input: RectangleInput = {
        length: 5,
        area: -15,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
    });

    it("should reject negative perimeter", () => {
      const input: RectangleInput = {
        length: 5,
        perimeter: -16,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
    });

    it("should reject negative diagonal", () => {
      const input: RectangleInput = {
        length: 5,
        diagonal: -5.83,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors).toBeDefined();
    });

    it("should reject inconsistent values", () => {
      const input: RectangleInput = {
        length: 5,
        width: 3,
        area: 20, // Should be 15 for 5x3
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("CONTRADICTORY");
      expect(result.errors?.some(e => e.includes("inconsistent"))).toBe(true);
    });

    it("should reject insufficient information", () => {
      const input: RectangleInput = {
        length: 5,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("INSUFFICIENT_INFORMATION");
      expect(result.errors).toBeDefined();
    });

    it("should reject no input", () => {
      const input: RectangleInput = {
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("INSUFFICIENT_INFORMATION");
      expect(result.errors).toBeDefined();
    });
  });

  describe("Unit Conversion", () => {
    it("should handle mm units", () => {
      const input: RectangleInput = {
        length: 50,
        width: 30,
        unit: "mm"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.unit).toBe("mm");
      expect(result.length).toBeCloseTo(50, 2);
      expect(result.width).toBeCloseTo(30, 2);
      expect(result.area).toBeCloseTo(1500, 2); // mm²
    });

    it("should handle m units", () => {
      const input: RectangleInput = {
        length: 0.05,
        width: 0.03,
        unit: "m"
      };

      const result = solveRectangle(input);

      expect(result.status).toBe("SOLVED");
      expect(result.unit).toBe("m");
      expect(result.length).toBeCloseTo(0.05, 3);
      expect(result.width).toBeCloseTo(0.03, 3);
      expect(result.area).toBeCloseTo(0.0015, 4); // m²
    });

    it("should convert units correctly", () => {
      const inputCM: RectangleInput = {
        length: 5,
        width: 3,
        unit: "cm"
      };

      const inputM: RectangleInput = {
        length: 0.05,
        width: 0.03,
        unit: "m"
      };

      const resultCM = solveRectangle(inputCM);
      const resultM = solveRectangle(inputM);

      // Areas should be proportional to unit squared
      const areaRatio = resultCM.area! / resultM.area!;
      const expectedRatio = 100 * 100; // cm² to m²
      expect(areaRatio).toBeCloseTo(expectedRatio, 3);
    });
  });

  describe("Calculation Steps", () => {
    it("should provide calculation steps from length and width", () => {
      const input: RectangleInput = {
        length: 5,
        width: 3,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps[0].formula).toBeDefined();
      expect(result.steps[0].explanation).toBeDefined();
    });

    it("should provide calculation steps from length and area", () => {
      const input: RectangleInput = {
        length: 5,
        area: 15,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps.some(s => s.formula.includes("A/l"))).toBe(true);
    });

    it("should provide calculation steps from area and perimeter", () => {
      const input: RectangleInput = {
        area: 15,
        perimeter: 16,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps.some(s => s.formula.includes("±") || s.formula.includes("P/2"))).toBe(true);
    });
  });

  describe("Interior Angles", () => {
    it("should always return 90° for interior angles", () => {
      const input: RectangleInput = {
        length: 5,
        width: 3,
        unit: "cm"
      };

      const result = solveRectangle(input);

      expect(result.interiorAngles.all).toBe(90);
    });
  });
});
