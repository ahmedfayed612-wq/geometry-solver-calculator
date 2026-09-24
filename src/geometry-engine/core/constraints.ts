/**
 * Constraint system for identifying available geometric information
 */

import type { TriangleInput, Constraint } from "./types";
import { isPositive, approxEqual, EPSILON } from "./tolerance";

/**
 * Triangle configuration types
 */
export type TriangleConfiguration =
  | "SSS" // Side-Side-Side
  | "SAS" // Side-Angle-Side
  | "ASA" // Angle-Side-Angle
  | "AAS" // Angle-Angle-Side
  | "SSA" // Side-Side-Angle (ambiguous)
  | "AAA" // Angle-Angle-Angle (similar triangles, not unique)
  | "RIGHT_TRIANGLE"
  | "INSUFFICIENT"
  | "UNKNOWN";

/**
 * Analyze triangle input to determine configuration
 */
export function analyzeTriangleConfiguration(input: TriangleInput): TriangleConfiguration {
  const sides = input.sides || {};
  const angles = input.angles || {};

  const knownSides = [sides.a, sides.b, sides.c].filter((s): s is number => s !== undefined && isPositive(s));
  const knownAngles = [angles.A, angles.B, angles.C].filter((a): a is number => a !== undefined && isPositive(a));

  // Check for right triangle
  if (input.isRightTriangle) {
    return "RIGHT_TRIANGLE";
  }

  // Check if right triangle can be inferred from angles
  if (knownAngles.some(a => approxEqual(a, 90, EPSILON * 100))) {
    return "RIGHT_TRIANGLE";
  }

  // Count known values
  const sideCount = knownSides.length;
  const angleCount = knownAngles.length;

  // SSS: Three sides
  if (sideCount === 3) {
    return "SSS";
  }

  // SAS: Two sides and included angle
  if (sideCount === 2 && angleCount === 1) {
    // Check if the angle is between the two known sides
    if (sides.a !== undefined && sides.b !== undefined && angles.C !== undefined) {
      return "SAS";
    }
    if (sides.b !== undefined && sides.c !== undefined && angles.A !== undefined) {
      return "SAS";
    }
    if (sides.a !== undefined && sides.c !== undefined && angles.B !== undefined) {
      return "SAS";
    }
    // If angle is not included, it's SSA
    return "SSA";
  }

  // ASA: Two angles and included side
  if (sideCount === 1 && angleCount === 2) {
    // Check if the side is between the two known angles
    if (sides.a !== undefined && angles.B !== undefined && angles.C !== undefined) {
      return "ASA";
    }
    if (sides.b !== undefined && angles.A !== undefined && angles.C !== undefined) {
      return "ASA";
    }
    if (sides.c !== undefined && angles.A !== undefined && angles.B !== undefined) {
      return "ASA";
    }
    // If side is not included, it's AAS
    return "AAS";
  }

  // AAS: Two angles and non-included side
  if (sideCount === 1 && angleCount === 2) {
    return "AAS";
  }

  // SSA: Two sides and non-included angle
  if (sideCount === 2 && angleCount === 1) {
    return "SSA";
  }

  // AAA: Three angles (similar triangles, not unique)
  if (angleCount === 3) {
    return "AAA";
  }

  // Insufficient information
  if (sideCount + angleCount < 3) {
    return "INSUFFICIENT";
  }

  return "UNKNOWN";
}

/**
 * Extract constraints from triangle input
 */
export function extractTriangleConstraints(input: TriangleInput): Constraint[] {
  const constraints: Constraint[] = [];

  if (input.sides) {
    if (input.sides.a !== undefined) {
      constraints.push({ type: "SIDE", value: input.sides.a, unit: input.unit, vertex: "a" });
    }
    if (input.sides.b !== undefined) {
      constraints.push({ type: "SIDE", value: input.sides.b, unit: input.unit, vertex: "b" });
    }
    if (input.sides.c !== undefined) {
      constraints.push({ type: "SIDE", value: input.sides.c, unit: input.unit, vertex: "c" });
    }
  }

  if (input.angles) {
    if (input.angles.A !== undefined) {
      constraints.push({ type: "ANGLE", value: input.angles.A, unit: "degrees", vertex: "A" });
    }
    if (input.angles.B !== undefined) {
      constraints.push({ type: "ANGLE", value: input.angles.B, unit: "degrees", vertex: "B" });
    }
    if (input.angles.C !== undefined) {
      constraints.push({ type: "ANGLE", value: input.angles.C, unit: "degrees", vertex: "C" });
    }
  }

  return constraints;
}

/**
 * Check if constraints are sufficient to solve
 */
export function hasSufficientConstraints(constraints: Constraint[]): boolean {
  const sideConstraints = constraints.filter(c => c.type === "SIDE");
  const angleConstraints = constraints.filter(c => c.type === "ANGLE");

  // For triangles, we need at least 3 independent pieces of information
  return sideConstraints.length + angleConstraints.length >= 3;
}

/**
 * Check if constraints are consistent (no contradictions)
 */
export function areConstraintsConsistent(_constraints: Constraint[]): boolean {
  // This is a simplified check - more sophisticated consistency checking
  // would be done in the validation layer
  return true;
}

/**
 * Determine which formulas are applicable based on constraints
 */
export function getApplicableFormulas(constraints: Constraint[]): string[] {
  const formulas: string[] = [];
  const sideConstraints = constraints.filter(c => c.type === "SIDE");
  const angleConstraints = constraints.filter(c => c.type === "ANGLE");

  const sideCount = sideConstraints.length;
  const angleCount = angleConstraints.length;

  // Pythagorean theorem (right triangle)
  if (angleConstraints.some(c => approxEqual(c.value, 90, EPSILON * 100))) {
    formulas.push("PYTHAGOREAN");
  }

  // Law of Cosines (need 2 sides + included angle, or 3 sides)
  if (sideCount >= 2 && angleCount >= 1) {
    formulas.push("LAW_OF_COSINES");
  }
  if (sideCount === 3) {
    formulas.push("LAW_OF_COSINES");
  }

  // Law of Sines (need at least 1 side + 1 angle)
  if (sideCount >= 1 && angleCount >= 1) {
    formulas.push("LAW_OF_SINES");
  }

  // Triangle area formulas
  if (sideCount >= 2 && angleCount >= 1) {
    formulas.push("AREA_SAS");
  }
  if (sideCount === 3) {
    formulas.push("AREA_HERON");
  }

  // Circumradius and inradius
  if (sideCount === 3) {
    formulas.push("CIRCUMRADIUS");
    formulas.push("INRADIUS");
  }

  return formulas;
}

/**
 * Constraint satisfaction - check if a proposed solution satisfies all constraints
 */
export function satisfiesConstraints(
  solution: Record<string, number>,
  constraints: Constraint[],
  tolerance = EPSILON
): boolean {
  for (const constraint of constraints) {
    if (constraint.type === "SIDE" && constraint.vertex) {
      const key = constraint.vertex.toLowerCase();
      if (solution[key] !== undefined) {
        if (!approxEqual(solution[key], constraint.value, tolerance * 100)) {
          return false;
        }
      }
    }
    if (constraint.type === "ANGLE" && constraint.vertex) {
      const key = constraint.vertex;
      if (solution[key] !== undefined) {
        if (!approxEqual(solution[key], constraint.value, tolerance * 100)) {
          return false;
        }
      }
    }
  }
  return true;
}
