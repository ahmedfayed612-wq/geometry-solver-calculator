/**
 * Square formulas and theorems
 * Pure mathematical functions for square calculations
 */

import type { CalculationStep } from "../core/types";

/**
 * Calculate side from perimeter: s = P/4
 */
export function sideFromPerimeter(perimeter: number): { result: number; step: CalculationStep } {
  const result = perimeter / 4;
  return {
    result,
    step: {
      formula: "s = P/4",
      substitutedFormula: `s = ${perimeter}/4`,
      result,
      explanation: "Calculating side length from perimeter"
    }
  };
}

/**
 * Calculate side from area: s = √A
 */
export function sideFromArea(area: number): { result: number; step: CalculationStep } {
  const result = Math.sqrt(area);
  return {
    result,
    step: {
      formula: "s = √A",
      substitutedFormula: `s = √${area}`,
      result,
      explanation: "Calculating side length from area"
    }
  };
}

/**
 * Calculate side from diagonal: s = d/√2
 */
export function sideFromDiagonal(diagonal: number): { result: number; step: CalculationStep } {
  const result = diagonal / Math.sqrt(2);
  return {
    result,
    step: {
      formula: "s = d/√2",
      substitutedFormula: `s = ${diagonal}/√2`,
      result,
      explanation: "Calculating side length from diagonal"
    }
  };
}

/**
 * Calculate perimeter from side: P = 4s
 */
export function perimeterFromSide(side: number): { result: number; step: CalculationStep } {
  const result = 4 * side;
  return {
    result,
    step: {
      formula: "P = 4s",
      substitutedFormula: `P = 4·${side}`,
      result,
      explanation: "Calculating perimeter from side length"
    }
  };
}

/**
 * Calculate area from side: A = s²
 */
export function areaFromSide(side: number): { result: number; step: CalculationStep } {
  const result = side * side;
  return {
    result,
    step: {
      formula: "A = s²",
      substitutedFormula: `A = ${side}²`,
      result,
      explanation: "Calculating area from side length"
    }
  };
}

/**
 * Calculate diagonal from side: d = s√2
 */
export function diagonalFromSide(side: number): { result: number; step: CalculationStep } {
  const result = side * Math.sqrt(2);
  return {
    result,
    step: {
      formula: "d = s√2",
      substitutedFormula: `d = ${side}·√2`,
      result,
      explanation: "Calculating diagonal from side length"
    }
  };
}

/**
 * Calculate perimeter from area: P = 4√A
 */
export function perimeterFromArea(area: number): { result: number; step: CalculationStep } {
  const result = 4 * Math.sqrt(area);
  return {
    result,
    step: {
      formula: "P = 4√A",
      substitutedFormula: `P = 4·√${area}`,
      result,
      explanation: "Calculating perimeter from area"
    }
  };
}

/**
 * Calculate diagonal from area: d = √(2A)
 */
export function diagonalFromArea(area: number): { result: number; step: CalculationStep } {
  const result = Math.sqrt(2 * area);
  return {
    result,
    step: {
      formula: "d = √(2A)",
      substitutedFormula: `d = √(2·${area})`,
      result,
      explanation: "Calculating diagonal from area"
    }
  };
}

/**
 * Calculate area from perimeter: A = (P/4)²
 */
export function areaFromPerimeter(perimeter: number): { result: number; step: CalculationStep } {
  const side = perimeter / 4;
  const result = side * side;
  return {
    result,
    step: {
      formula: "A = (P/4)²",
      substitutedFormula: `A = (${perimeter}/4)² = ${side}²`,
      result,
      explanation: "Calculating area from perimeter"
    }
  };
}

/**
 * Calculate diagonal from perimeter: d = (P/4)√2
 */
export function diagonalFromPerimeter(perimeter: number): { result: number; step: CalculationStep } {
  const side = perimeter / 4;
  const result = side * Math.sqrt(2);
  return {
    result,
    step: {
      formula: "d = (P/4)√2",
      substitutedFormula: `d = (${perimeter}/4)·√2 = ${side}·√2`,
      result,
      explanation: "Calculating diagonal from perimeter"
    }
  };
}

/**
 * Calculate area from diagonal: A = d²/2
 */
export function areaFromDiagonal(diagonal: number): { result: number; step: CalculationStep } {
  const result = (diagonal * diagonal) / 2;
  return {
    result,
    step: {
      formula: "A = d²/2",
      substitutedFormula: `A = ${diagonal}²/2`,
      result,
      explanation: "Calculating area from diagonal"
    }
  };
}

/**
 * Calculate perimeter from diagonal: P = 4d/√2
 */
export function perimeterFromDiagonal(diagonal: number): { result: number; step: CalculationStep } {
  const result = (4 * diagonal) / Math.sqrt(2);
  return {
    result,
    step: {
      formula: "P = 4d/√2",
      substitutedFormula: `P = 4·${diagonal}/√2`,
      result,
      explanation: "Calculating perimeter from diagonal"
    }
  };
}

/**
 * Interior angle of a square is always 90°
 */
export function interiorAngle(): { result: number; step: CalculationStep } {
  const result = 90;
  return {
    result,
    step: {
      formula: "Interior angle = 90°",
      substitutedFormula: "Interior angle = 90°",
      result,
      explanation: "All interior angles of a square are 90°"
    }
  };
}
