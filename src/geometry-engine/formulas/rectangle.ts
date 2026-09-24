/**
 * Rectangle formulas and theorems
 * Pure mathematical functions for rectangle calculations
 */

import type { CalculationStep } from "../core/types";

/**
 * Calculate perimeter from length and width: P = 2(l + w)
 */
export function perimeterFromLengthWidth(length: number, width: number): { result: number; step: CalculationStep } {
  const result = 2 * (length + width);
  return {
    result,
    step: {
      formula: "P = 2(l + w)",
      substitutedFormula: `P = 2(${length} + ${width})`,
      result,
      explanation: "Calculating perimeter from length and width"
    }
  };
}

/**
 * Calculate area from length and width: A = lw
 */
export function areaFromLengthWidth(length: number, width: number): { result: number; step: CalculationStep } {
  const result = length * width;
  return {
    result,
    step: {
      formula: "A = lw",
      substitutedFormula: `A = ${length}·${width}`,
      result,
      explanation: "Calculating area from length and width"
    }
  };
}

/**
 * Calculate diagonal from length and width: d = √(l² + w²)
 */
export function diagonalFromLengthWidth(length: number, width: number): { result: number; step: CalculationStep } {
  const result = Math.sqrt(length * length + width * width);
  return {
    result,
    step: {
      formula: "d = √(l² + w²)",
      substitutedFormula: `d = √(${length}² + ${width}²)`,
      result,
      explanation: "Calculating diagonal from length and width (Pythagorean theorem)"
    }
  };
}

/**
 * Calculate width from perimeter and length: w = (P/2) - l
 */
export function widthFromPerimeterLength(perimeter: number, length: number): { result: number; step: CalculationStep } {
  const result = (perimeter / 2) - length;
  return {
    result,
    step: {
      formula: "w = (P/2) - l",
      substitutedFormula: `w = (${perimeter}/2) - ${length}`,
      result,
      explanation: "Calculating width from perimeter and length"
    }
  };
}

/**
 * Calculate length from perimeter and width: l = (P/2) - w
 */
export function lengthFromPerimeterWidth(perimeter: number, width: number): { result: number; step: CalculationStep } {
  const result = (perimeter / 2) - width;
  return {
    result,
    step: {
      formula: "l = (P/2) - w",
      substitutedFormula: `l = (${perimeter}/2) - ${width}`,
      result,
      explanation: "Calculating length from perimeter and width"
    }
  };
}

/**
 * Calculate width from area and length: w = A/l
 */
export function widthFromAreaLength(area: number, length: number): { result: number; step: CalculationStep } {
  const result = area / length;
  return {
    result,
    step: {
      formula: "w = A/l",
      substitutedFormula: `w = ${area}/${length}`,
      result,
      explanation: "Calculating width from area and length"
    }
  };
}

/**
 * Calculate length from area and width: l = A/w
 */
export function lengthFromAreaWidth(area: number, width: number): { result: number; step: CalculationStep } {
  const result = area / width;
  return {
    result,
    step: {
      formula: "l = A/w",
      substitutedFormula: `l = ${area}/${width}`,
      result,
      explanation: "Calculating length from area and width"
    }
  };
}

/**
 * Calculate width from diagonal and length: w = √(d² - l²)
 */
export function widthFromDiagonalLength(diagonal: number, length: number): { result: number; step: CalculationStep } {
  const result = Math.sqrt(diagonal * diagonal - length * length);
  return {
    result,
    step: {
      formula: "w = √(d² - l²)",
      substitutedFormula: `w = √(${diagonal}² - ${length}²)`,
      result,
      explanation: "Calculating width from diagonal and length (Pythagorean theorem)"
    }
  };
}

/**
 * Calculate length from diagonal and width: l = √(d² - w²)
 */
export function lengthFromDiagonalWidth(diagonal: number, width: number): { result: number; step: CalculationStep } {
  const result = Math.sqrt(diagonal * diagonal - width * width);
  return {
    result,
    step: {
      formula: "l = √(d² - w²)",
      substitutedFormula: `l = √(${diagonal}² - ${width}²)`,
      result,
      explanation: "Calculating length from diagonal and width (Pythagorean theorem)"
    }
  };
}

/**
 * Calculate length from area and perimeter
 * This requires solving a quadratic: l² - (P/2)l + A = 0
 */
export function lengthFromAreaPerimeter(area: number, perimeter: number): { result: number; step: CalculationStep } | null {
  const halfPerimeter = perimeter / 2;
  // l = (P/2 ± √((P/2)² - 4A)) / 2
  const discriminant = halfPerimeter * halfPerimeter - 4 * area;
  
  if (discriminant < 0) {
    return null; // No real solution
  }
  
  const sqrtDiscriminant = Math.sqrt(discriminant);
  const length1 = (halfPerimeter + sqrtDiscriminant) / 2;
  const length2 = (halfPerimeter - sqrtDiscriminant) / 2;
  
  // Return the larger value as length (both are valid, just swapped)
  const result = Math.max(length1, length2);
  
  return {
    result,
    step: {
      formula: "l = (P/2 ± √((P/2)² - 4A)) / 2",
      substitutedFormula: `l = (${perimeter}/2 ± √((${perimeter}/2)² - 4·${area})) / 2`,
      result,
      explanation: "Calculating length from area and perimeter (quadratic formula)"
    }
  };
}

/**
 * Calculate width from area and perimeter
 */
export function widthFromAreaPerimeter(area: number, perimeter: number): { result: number; step: CalculationStep } | null {
  const halfPerimeter = perimeter / 2;
  const discriminant = halfPerimeter * halfPerimeter - 4 * area;
  
  if (discriminant < 0) {
    return null; // No real solution
  }
  
  const sqrtDiscriminant = Math.sqrt(discriminant);
  const width1 = (halfPerimeter + sqrtDiscriminant) / 2;
  const width2 = (halfPerimeter - sqrtDiscriminant) / 2;
  
  // Return the smaller value as width
  const result = Math.min(width1, width2);
  
  return {
    result,
    step: {
      formula: "w = (P/2 ± √((P/2)² - 4A)) / 2",
      substitutedFormula: `w = (${perimeter}/2 ± √((${perimeter}/2)² - 4·${area})) / 2`,
      result,
      explanation: "Calculating width from area and perimeter (quadratic formula)"
    }
  };
}

/**
 * Interior angles of a rectangle are always 90°
 */
export function interiorAngles(): { result: { all: number }; step: CalculationStep } {
  const result = { all: 90 };
  return {
    result,
    step: {
      formula: "Interior angles = 90°",
      substitutedFormula: "All interior angles = 90°",
      result: 90,
      explanation: "All interior angles of a rectangle are 90°"
    }
  };
}
