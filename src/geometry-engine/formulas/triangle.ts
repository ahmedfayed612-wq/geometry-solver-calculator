/**
 * Triangle formulas and theorems
 * Pure mathematical functions for triangle calculations
 */

import { degreesToRadians, radiansToDegrees } from "../core/units";
import { safeSqrt, safeAsin, safeAcos, approxEqual, EPSILON } from "../core/tolerance";
import type { CalculationStep } from "../core/types";

/**
 * Pythagorean theorem: a² + b² = c²
 * Solves for the missing side in a right triangle
 */
export function pythagoreanTheorem(
  a?: number,
  b?: number,
  c?: number
): { result: number; step: CalculationStep } | null {
  if (a !== undefined && b !== undefined && c === undefined) {
    // Solve for c
    const result = Math.sqrt(a * a + b * b);
    return {
      result,
      step: {
        formula: "c² = a² + b²",
        substitutedFormula: `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`,
        result,
        explanation: "Using the Pythagorean theorem to find the hypotenuse"
      }
    };
  }

  if (a !== undefined && c !== undefined && b === undefined) {
    // Solve for b
    const result = Math.sqrt(c * c - a * a);
    if (result === undefined) return null;
    return {
      result,
      step: {
        formula: "b² = c² - a²",
        substitutedFormula: `b² = ${c}² - ${a}² = ${c * c} - ${a * a} = ${c * c - a * a}`,
        result,
        explanation: "Using the Pythagorean theorem to find the missing leg"
      }
    };
  }

  if (b !== undefined && c !== undefined && a === undefined) {
    // Solve for a
    const result = Math.sqrt(c * c - b * b);
    if (result === undefined) return null;
    return {
      result,
      step: {
        formula: "a² = c² - b²",
        substitutedFormula: `a² = ${c}² - ${b}² = ${c * c} - ${b * b} = ${c * c - b * b}`,
        result,
        explanation: "Using the Pythagorean theorem to find the missing leg"
      }
    };
  }

  return null;
}

/**
 * Law of Sines: a/sin(A) = b/sin(B) = c/sin(C)
 * Can solve for a side or angle
 */
export function lawOfSines(
  knownSide?: number,
  knownAngle?: number, // in degrees
  unknownSide?: number,
  unknownAngle?: number // in degrees
): { result: number; step: CalculationStep } | null {
  if (knownSide !== undefined && knownAngle !== undefined && unknownSide === undefined && unknownAngle !== undefined) {
    // Solve for side: unknownSide / sin(unknownAngle) = knownSide / sin(knownAngle)
    const knownAngleRad = degreesToRadians(knownAngle);
    const unknownAngleRad = degreesToRadians(unknownAngle);
    const result = (knownSide * Math.sin(unknownAngleRad)) / Math.sin(knownAngleRad);
    return {
      result,
      step: {
        formula: "a/sin(A) = b/sin(B)",
        substitutedFormula: `${knownSide}/sin(${knownAngle}°) = x/sin(${unknownAngle}°)`,
        result,
        explanation: "Using the Law of Sines to find the unknown side"
      }
    };
  }

  if (knownSide !== undefined && knownAngle !== undefined && unknownSide !== undefined && unknownAngle === undefined) {
    // Solve for angle: sin(unknownAngle) = (unknownSide * sin(knownAngle)) / knownSide
    const knownAngleRad = degreesToRadians(knownAngle);
    const sinValue = (unknownSide * Math.sin(knownAngleRad)) / knownSide;
    const angleRad = safeAsin(sinValue);
    if (angleRad === undefined) return null;
    const result = radiansToDegrees(angleRad);
    return {
      result,
      step: {
        formula: "sin(A)/a = sin(B)/b",
        substitutedFormula: `sin(x)/${unknownSide} = sin(${knownAngle}°)/${knownSide}`,
        result,
        explanation: "Using the Law of Sines to find the unknown angle"
      }
    };
  }

  return null;
}

/**
 * Law of Cosines: c² = a² + b² - 2ab cos(C)
 * Can solve for a side or angle
 */
export function lawOfCosines(
  a?: number,
  b?: number,
  c?: number,
  C?: number // in degrees
): { result: number; step: CalculationStep } | null {
  if (a !== undefined && b !== undefined && C !== undefined && c === undefined) {
    // Solve for side c
    const angleRad = degreesToRadians(C);
    const result = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(angleRad));
    return {
      result,
      step: {
        formula: "c² = a² + b² - 2ab cos(C)",
        substitutedFormula: `c² = ${a}² + ${b}² - 2·${a}·${b}·cos(${C}°)`,
        result,
        explanation: "Using the Law of Cosines to find the unknown side"
      }
    };
  }

  if (a !== undefined && b !== undefined && c !== undefined && C === undefined) {
    // Solve for angle C
    const cosC = (a * a + b * b - c * c) / (2 * a * b);
    const angleRad = safeAcos(cosC);
    if (angleRad === undefined) return null;
    const result = radiansToDegrees(angleRad);
    return {
      result,
      step: {
        formula: "cos(C) = (a² + b² - c²) / (2ab)",
        substitutedFormula: `cos(C) = (${a}² + ${b}² - ${c}²) / (2·${a}·${b})`,
        result,
        explanation: "Using the Law of Cosines to find the unknown angle"
      }
    };
  }

  return null;
}

/**
 * Triangle area using base and height: A = 1/2 * b * h
 */
export function areaBaseHeight(base: number, height: number): { result: number; step: CalculationStep } {
  const result = 0.5 * base * height;
  return {
    result,
    step: {
      formula: "A = 1/2 · b · h",
      substitutedFormula: `A = 1/2 · ${base} · ${height}`,
      result,
      explanation: "Using the base-height formula for triangle area"
    }
  };
}

/**
 * Triangle area using two sides and included angle: A = 1/2 * a * b * sin(C)
 */
export function areaSAS(a: number, b: number, C: number): { result: number; step: CalculationStep } {
  const angleRad = degreesToRadians(C);
  const result = 0.5 * a * b * Math.sin(angleRad);
  return {
    result,
    step: {
      formula: "A = 1/2 · a · b · sin(C)",
      substitutedFormula: `A = 1/2 · ${a} · ${b} · sin(${C}°)`,
      result,
      explanation: "Using the SAS formula for triangle area"
    }
  };
}

/**
 * Heron's formula: A = sqrt(s(s-a)(s-b)(s-c))
 * where s = (a+b+c)/2 is the semiperimeter
 */
export function areaHeron(a: number, b: number, c: number): { result: number; step: CalculationStep } | null {
  const s = (a + b + c) / 2;
  const discriminant = s * (s - a) * (s - b) * (s - c);
  const result = safeSqrt(discriminant);
  if (result === undefined) return null;
  return {
    result,
    step: {
      formula: "A = √(s(s-a)(s-b)(s-c)) where s = (a+b+c)/2",
      substitutedFormula: `s = (${a}+${b}+${c})/2 = ${s}\nA = √(${s}(${s}-${a})(${s}-${b})(${s}-${c}))`,
      result,
      explanation: "Using Heron's formula for triangle area"
    }
  };
}

/**
 * Calculate semiperimeter: s = (a + b + c) / 2
 */
export function semiperimeter(a: number, b: number, c: number): { result: number; step: CalculationStep } {
  const result = (a + b + c) / 2;
  return {
    result,
    step: {
      formula: "s = (a + b + c) / 2",
      substitutedFormula: `s = (${a} + ${b} + ${c}) / 2`,
      result,
      explanation: "Calculating the semiperimeter"
    }
  };
}

/**
 * Calculate perimeter: P = a + b + c
 */
export function perimeter(a: number, b: number, c: number): { result: number; step: CalculationStep } {
  const result = a + b + c;
  return {
    result,
    step: {
      formula: "P = a + b + c",
      substitutedFormula: `P = ${a} + ${b} + ${c}`,
      result,
      explanation: "Calculating the perimeter"
    }
  };
}

/**
 * Calculate circumradius: R = abc / (4A)
 */
export function circumradius(a: number, b: number, c: number, area: number): { result: number; step: CalculationStep } {
  const result = (a * b * c) / (4 * area);
  return {
    result,
    step: {
      formula: "R = abc / (4A)",
      substitutedFormula: `R = ${a} · ${b} · ${c} / (4 · ${area})`,
      result,
      explanation: "Calculating the circumradius (radius of circumscribed circle)"
    }
  };
}

/**
 * Calculate inradius: r = A / s
 */
export function inradius(area: number, semiperimeter: number): { result: number; step: CalculationStep } {
  const result = area / semiperimeter;
  return {
    result,
    step: {
      formula: "r = A / s",
      substitutedFormula: `r = ${area} / ${semiperimeter}`,
      result,
      explanation: "Calculating the inradius (radius of inscribed circle)"
    }
  };
}

/**
 * Calculate altitude from vertex A: ha = 2A / a
 */
export function altitudeFromA(area: number, a: number): { result: number; step: CalculationStep } {
  const result = (2 * area) / a;
  return {
    result,
    step: {
      formula: "ha = 2A / a",
      substitutedFormula: `ha = 2 · ${area} / ${a}`,
      result,
      explanation: "Calculating the altitude from vertex A"
    }
  };
}

/**
 * Calculate altitude from vertex B: hb = 2A / b
 */
export function altitudeFromB(area: number, b: number): { result: number; step: CalculationStep } {
  const result = (2 * area) / b;
  return {
    result,
    step: {
      formula: "hb = 2A / b",
      substitutedFormula: `hb = 2 · ${area} / ${b}`,
      result,
      explanation: "Calculating the altitude from vertex B"
    }
  };
}

/**
 * Calculate altitude from vertex C: hc = 2A / c
 */
export function altitudeFromC(area: number, c: number): { result: number; step: CalculationStep } {
  const result = (2 * area) / c;
  return {
    result,
    step: {
      formula: "hc = 2A / c",
      substitutedFormula: `hc = 2 · ${area} / ${c}`,
      result,
      explanation: "Calculating the altitude from vertex C"
    }
  };
}

/**
 * Calculate median from vertex A: ma = 0.5 * sqrt(2b² + 2c² - a²)
 */
export function medianFromA(a: number, b: number, c: number): { result: number; step: CalculationStep } {
  const result = 0.5 * Math.sqrt(2 * b * b + 2 * c * c - a * a);
  return {
    result,
    step: {
      formula: "ma = 0.5 · √(2b² + 2c² - a²)",
      substitutedFormula: `ma = 0.5 · √(2·${b}² + 2·${c}² - ${a}²)`,
      result,
      explanation: "Calculating the median from vertex A"
    }
  };
}

/**
 * Calculate median from vertex B: mb = 0.5 * sqrt(2a² + 2c² - b²)
 */
export function medianFromB(a: number, b: number, c: number): { result: number; step: CalculationStep } {
  const result = 0.5 * Math.sqrt(2 * a * a + 2 * c * c - b * b);
  return {
    result,
    step: {
      formula: "mb = 0.5 · √(2a² + 2c² - b²)",
      substitutedFormula: `mb = 0.5 · √(2·${a}² + 2·${c}² - ${b}²)`,
      result,
      explanation: "Calculating the median from vertex B"
    }
  };
}

/**
 * Calculate median from vertex C: mc = 0.5 * sqrt(2a² + 2b² - c²)
 */
export function medianFromC(a: number, b: number, c: number): { result: number; step: CalculationStep } {
  const result = 0.5 * Math.sqrt(2 * a * a + 2 * b * b - c * c);
  return {
    result,
    step: {
      formula: "mc = 0.5 · √(2a² + 2b² - c²)",
      substitutedFormula: `mc = 0.5 · √(2·${a}² + 2·${b}² - ${c}²)`,
      result,
      explanation: "Calculating the median from vertex C"
    }
  };
}

/**
 * Calculate missing angle using angle sum: A + B + C = 180°
 */
export function missingAngleSum(knownAngle1: number, knownAngle2: number): { result: number; step: CalculationStep } {
  const result = 180 - knownAngle1 - knownAngle2;
  return {
    result,
    step: {
      formula: "A + B + C = 180°",
      substitutedFormula: `x = 180° - ${knownAngle1}° - ${knownAngle2}°`,
      result,
      explanation: "Using the angle sum property to find the missing angle"
    }
  };
}

/**
 * Check if SSA case has 0, 1, or 2 solutions
 * Returns: 0 (no solution), 1 (one solution), or 2 (two solutions)
 */
export function ssaSolutionCount(
  knownSide: number,
  adjacentSide: number,
  knownAngle: number // in degrees, angle opposite to knownSide
): number {
  const angleRad = degreesToRadians(knownAngle);
  const h = adjacentSide * Math.sin(angleRad); // altitude

  // Case 1: knownAngle >= 90°
  if (knownAngle >= 90 - EPSILON * 100) {
    if (knownSide <= adjacentSide + EPSILON) {
      return 1; // One solution
    }
    return 0; // No solution
  }

  // Case 2: knownAngle < 90°
  if (knownSide < h - EPSILON) {
    return 0; // No solution (side too short)
  }
  if (approxEqual(knownSide, h, EPSILON * 100)) {
    return 1; // One solution (right triangle)
  }
  if (knownSide >= adjacentSide - EPSILON) {
    return 1; // One solution
  }
  return 2; // Two solutions
}

/**
 * Solve SSA case - returns both possible solutions if they exist
 */
export function solveSSA(
  knownSide: number, // side a
  adjacentSide: number, // side b
  knownAngle: number // angle A (opposite to knownSide)
): { solutions: Array<{ B: number; C: number; c: number }>; count: number } {
  const count = ssaSolutionCount(knownSide, adjacentSide, knownAngle);
  
  if (count === 0) {
    return { solutions: [], count: 0 };
  }

  const solutions: Array<{ B: number; C: number; c: number }> = [];
  const angleRad = degreesToRadians(knownAngle);
  
  // Use Law of Sines to find angle B
  const sinB = (adjacentSide * Math.sin(angleRad)) / knownSide;
  const angleB1Rad = safeAsin(sinB);
  
  if (angleB1Rad === undefined) {
    return { solutions: [], count: 0 };
  }

  const angleB1 = radiansToDegrees(angleB1Rad);
  const angleC1 = 180 - knownAngle - angleB1;
  
  // Use Law of Sines to find side c
  const angleC1Rad = degreesToRadians(angleC1);
  const sideC1 = (knownSide * Math.sin(angleC1Rad)) / Math.sin(angleRad);
  
  solutions.push({
    B: angleB1,
    C: angleC1,
    c: sideC1
  });

  // Check for second solution
  if (count === 2) {
    const angleB2 = 180 - angleB1;
    const angleC2 = 180 - knownAngle - angleB2;
    
    if (angleC2 > EPSILON) {
      const angleC2Rad = degreesToRadians(angleC2);
      const sideC2 = (knownSide * Math.sin(angleC2Rad)) / Math.sin(angleRad);
      
      solutions.push({
        B: angleB2,
        C: angleC2,
        c: sideC2
      });
    }
  }

  return { solutions, count };
}
