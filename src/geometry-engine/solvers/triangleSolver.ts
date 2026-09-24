/**
 * Triangle solver - determines which mathematical relationships apply and solves unknown values
 */

import type { TriangleInput, TriangleSolution, CalculationStep } from "../core/types";
import { validateTriangleInput } from "../core/validation";
import { analyzeTriangleConfiguration } from "../core/constraints";
import { normalizeLengths, denormalizeLengths, degreesToRadians } from "../core/units";
import { approxEqual, EPSILON } from "../core/tolerance";
import * as triangleFormulas from "../formulas/triangle";

/**
 * Main triangle solver function
 */
export function solveTriangle(input: TriangleInput): TriangleSolution {
  // Validate input
  const validation = validateTriangleInput(input);
  if (!validation.isValid) {
    return {
      status: validation.status || "CONTRADICTORY",
      steps: [],
      errors: validation.errors.map(e => e.message)
    };
  }

  // Analyze configuration
  const config = analyzeTriangleConfiguration(input);

  // Normalize lengths to meters
  const unit = input.unit || "cm";
  const normalizedInput = input.sides ? {
    ...input,
    sides: normalizeLengths(input.sides, unit)
  } : input;

  const steps: CalculationStep[] = [];
  const solution: Partial<TriangleSolution> = {
    status: "SOLVED",
    steps,
    unit
  };

  // Handle special cases
  if (config === "INSUFFICIENT") {
    return {
      status: "INSUFFICIENT_INFORMATION",
      steps: [],
      errors: ["Insufficient information to solve the triangle"]
    };
  }

  if (config === "AAA") {
    return {
      status: "INSUFFICIENT_INFORMATION",
      steps: [],
      errors: ["AAA only determines similar triangles, not a unique solution"]
    };
  }

  // Solve based on configuration
  try {
    switch (config) {
      case "SSS":
        solveSSS(normalizedInput, solution, steps);
        break;
      case "SAS":
        solveSAS(normalizedInput, solution, steps);
        break;
      case "ASA":
        solveASA(normalizedInput, solution, steps);
        break;
      case "AAS":
        solveAAS(normalizedInput, solution, steps);
        break;
      case "SSA":
        solveSSA(normalizedInput, solution, steps);
        break;
      case "RIGHT_TRIANGLE":
        solveRightTriangle(normalizedInput, solution, steps);
        break;
      default:
        return {
          status: "INSUFFICIENT_INFORMATION",
          steps: [],
          errors: ["Unable to determine triangle configuration"]
        };
    }
  } catch (error) {
    return {
      status: "CONTRADICTORY",
      steps,
      errors: [`Error solving triangle: ${error instanceof Error ? error.message : String(error)}`]
    };
  }

  // Denormalize lengths back to original unit
  if (solution.sides) {
    solution.sides = denormalizeLengths(solution.sides, unit);
  }
  if (solution.altitudes) {
    solution.altitudes = denormalizeLengths(solution.altitudes, unit);
  }
  if (solution.medians) {
    solution.medians = denormalizeLengths(solution.medians, unit);
  }
  if (solution.circumradius !== undefined) {
    solution.circumradius = denormalizeLengths({ r: solution.circumradius }, unit).r;
  }
  if (solution.inradius !== undefined) {
    solution.inradius = denormalizeLengths({ r: solution.inradius }, unit).r;
  }
  
  // Denormalize area (area scales by square of length conversion factor)
  if (solution.area !== undefined) {
    const areaInMeters = solution.area;
    // Convert from m² to the target unit squared
    // 1 m² = 1,000,000 mm², 10,000 cm², 0.000001 km²
    const areaFactor = unit === "mm" ? 1000000 : unit === "cm" ? 10000 : unit === "km" ? 0.000001 : 1;
    solution.area = areaInMeters * areaFactor;
  }
  
  // Denormalize perimeter (linear)
  if (solution.perimeter !== undefined) {
    solution.perimeter = denormalizeLengths({ p: solution.perimeter }, unit).p;
  }
  
  // Denormalize semiperimeter (linear)
  if (solution.semiperimeter !== undefined) {
    solution.semiperimeter = denormalizeLengths({ s: solution.semiperimeter }, unit).s;
  }

  return solution as TriangleSolution;
}

/**
 * Solve SSS (Side-Side-Side) triangle
 */
function solveSSS(
  input: TriangleInput,
  solution: Partial<TriangleSolution>,
  steps: CalculationStep[]
): void {
  const { a, b, c } = input.sides!;
  
  if (!a || !b || !c) {
    throw new Error("SSS requires all three sides");
  }

  steps.push({
    formula: "Configuration: SSS",
    substitutedFormula: "Given: a, b, c",
    result: 0,
    explanation: "Identified SSS configuration - all three sides are known"
  });

  // Use Law of Cosines to find angles
  const angleAResult = triangleFormulas.lawOfCosines(b, c, a, undefined);
  if (angleAResult) {
    solution.angles = solution.angles || { A: 0, B: 0, C: 0 };
    solution.angles.A = angleAResult.result;
    steps.push(angleAResult.step);
  }

  const angleBResult = triangleFormulas.lawOfCosines(a, c, b, undefined);
  if (angleBResult) {
    solution.angles = solution.angles || { A: 0, B: 0, C: 0 };
    solution.angles.B = angleBResult.result;
    steps.push(angleBResult.step);
  }

  // Calculate third angle using angle sum
  if (solution.angles && solution.angles.A && solution.angles.B) {
    const angleCResult = triangleFormulas.missingAngleSum(solution.angles.A, solution.angles.B);
    solution.angles.C = angleCResult.result;
    steps.push(angleCResult.step);
  } else if (solution.angles && solution.angles.A && solution.angles.C) {
    const angleBResult = triangleFormulas.missingAngleSum(solution.angles.A, solution.angles.C);
    solution.angles.B = angleBResult.result;
    steps.push(angleBResult.step);
  } else if (solution.angles && solution.angles.B && solution.angles.C) {
    const angleAResult = triangleFormulas.missingAngleSum(solution.angles.B, solution.angles.C);
    solution.angles.A = angleAResult.result;
    steps.push(angleAResult.step);
  }

  // Calculate area using Heron's formula
  const areaResult = triangleFormulas.areaHeron(a, b, c);
  if (areaResult) {
    solution.area = areaResult.result;
    steps.push(areaResult.step);
  }

  // Calculate perimeter
  const perimeterResult = triangleFormulas.perimeter(a, b, c);
  solution.perimeter = perimeterResult.result;
  steps.push(perimeterResult.step);

  // Calculate semiperimeter
  const semiperimeterResult = triangleFormulas.semiperimeter(a, b, c);
  solution.semiperimeter = semiperimeterResult.result;
  steps.push(semiperimeterResult.step);

  // Calculate circumradius and inradius
  if (solution.area) {
    const circumradiusResult = triangleFormulas.circumradius(a, b, c, solution.area);
    solution.circumradius = circumradiusResult.result;
    steps.push(circumradiusResult.step);

    const inradiusResult = triangleFormulas.inradius(solution.area, solution.semiperimeter!);
    solution.inradius = inradiusResult.result;
    steps.push(inradiusResult.step);
  }

  // Calculate altitudes
  if (solution.area) {
    solution.altitudes = {};
    const haResult = triangleFormulas.altitudeFromA(solution.area, a);
    solution.altitudes.ha = haResult.result;
    steps.push(haResult.step);

    const hbResult = triangleFormulas.altitudeFromB(solution.area, b);
    solution.altitudes.hb = hbResult.result;
    steps.push(hbResult.step);

    const hcResult = triangleFormulas.altitudeFromC(solution.area, c);
    solution.altitudes.hc = hcResult.result;
    steps.push(hcResult.step);
  }

  // Calculate medians
  solution.medians = {};
  const maResult = triangleFormulas.medianFromA(a, b, c);
  solution.medians.ma = maResult.result;
  steps.push(maResult.step);

  const mbResult = triangleFormulas.medianFromB(a, b, c);
  solution.medians.mb = mbResult.result;
  steps.push(mbResult.step);

  const mcResult = triangleFormulas.medianFromC(a, b, c);
  solution.medians.mc = mcResult.result;
  steps.push(mcResult.step);

  solution.sides = { a, b, c };
}

/**
 * Solve SAS (Side-Angle-Side) triangle
 */
function solveSAS(
  input: TriangleInput,
  solution: Partial<TriangleSolution>,
  steps: CalculationStep[]
): void {
  const sides = input.sides!;
  const angles = input.angles!;

  steps.push({
    formula: "Configuration: SAS",
    substitutedFormula: "Given: two sides and included angle",
    result: 0,
    explanation: "Identified SAS configuration - two sides and the included angle are known"
  });

  // Determine which SAS case we have
  let a: number, b: number, C: number;
  if (sides.a && sides.b && angles.C) {
    a = sides.a;
    b = sides.b;
    C = angles.C;
  } else if (sides.b && sides.c && angles.A) {
    a = sides.b;
    b = sides.c;
    C = angles.A;
  } else if (sides.a && sides.c && angles.B) {
    a = sides.a;
    b = sides.c;
    C = angles.B;
  } else {
    throw new Error("Invalid SAS configuration");
  }

  // Use Law of Cosines to find the third side
  const sideCResult = triangleFormulas.lawOfCosines(a, b, undefined, C);
  if (!sideCResult) {
    throw new Error("Failed to solve for third side using Law of Cosines");
  }
  
  let c = sideCResult.result;
  steps.push(sideCResult.step);

  // Use Law of Sines to find remaining angles
  const angleAResult = triangleFormulas.lawOfSines(c, C, a, undefined);
  if (angleAResult) {
    solution.angles = solution.angles || { A: 0, B: 0, C: 0 };
    solution.angles.A = angleAResult.result;
    steps.push(angleAResult.step);
  }

  // Calculate third angle using angle sum
  if (solution.angles && solution.angles.A) {
    const angleBResult = triangleFormulas.missingAngleSum(C, solution.angles.A);
    solution.angles.B = angleBResult.result;
    steps.push(angleBResult.step);
  }

  // Assign angles based on the original input
  solution.angles = { A: 0, B: 0, C: 0 };
  if (angles.C) {
    solution.angles.C = C;
  } else if (angles.A) {
    solution.angles.A = C;
  } else if (angles.B) {
    solution.angles.B = C;
  } else {
    solution.angles.C = C;
  }

  // Assign sides based on the original input
  solution.sides = { a: 0, b: 0, c: 0 };
  if (sides.a) solution.sides.a = sides.a;
  if (sides.b) solution.sides.b = sides.b;
  if (sides.c) solution.sides.c = sides.c;
  
  // Set the calculated side
  if (!sides.c && sides.a && sides.b) solution.sides.c = c;
  else if (!sides.a && sides.b && sides.c) solution.sides.a = c;
  else if (!sides.b && sides.a && sides.c) solution.sides.b = c;

  // Calculate area using SAS formula
  const areaResult = triangleFormulas.areaSAS(a, b, C);
  solution.area = areaResult.result;
  steps.push(areaResult.step);

  // Calculate perimeter
  const { a: sa, b: sb, c: sc } = solution.sides;
  if (sa && sb && sc) {
    const perimeterResult = triangleFormulas.perimeter(sa, sb, sc);
    solution.perimeter = perimeterResult.result;
    steps.push(perimeterResult.step);

    const semiperimeterResult = triangleFormulas.semiperimeter(sa, sb, sc);
    solution.semiperimeter = semiperimeterResult.result;
    steps.push(semiperimeterResult.step);

    // Calculate circumradius and inradius
    if (solution.area) {
      const circumradiusResult = triangleFormulas.circumradius(sa, sb, sc, solution.area);
      solution.circumradius = circumradiusResult.result;
      steps.push(circumradiusResult.step);

      const inradiusResult = triangleFormulas.inradius(solution.area, solution.semiperimeter!);
      solution.inradius = inradiusResult.result;
      steps.push(inradiusResult.step);
    }

    // Calculate altitudes
    solution.altitudes = {};
    const haResult = triangleFormulas.altitudeFromA(solution.area, sa);
    solution.altitudes.ha = haResult.result;
    steps.push(haResult.step);

    const hbResult = triangleFormulas.altitudeFromB(solution.area, sb);
    solution.altitudes.hb = hbResult.result;
    steps.push(hbResult.step);

    const hcResult = triangleFormulas.altitudeFromC(solution.area, sc);
    solution.altitudes.hc = hcResult.result;
    steps.push(hcResult.step);

    // Calculate medians
    solution.medians = {};
    const maResult = triangleFormulas.medianFromA(sa, sb, sc);
    solution.medians.ma = maResult.result;
    steps.push(maResult.step);

    const mbResult = triangleFormulas.medianFromB(sa, sb, sc);
    solution.medians.mb = mbResult.result;
    steps.push(mbResult.step);

    const mcResult = triangleFormulas.medianFromC(sa, sb, sc);
    solution.medians.mc = mcResult.result;
    steps.push(mcResult.step);
  }
}

/**
 * Solve ASA (Angle-Side-Angle) triangle
 */
function solveASA(
  input: TriangleInput,
  solution: Partial<TriangleSolution>,
  steps: CalculationStep[]
): void {
  const sides = input.sides!;
  const angles = input.angles!;

  steps.push({
    formula: "Configuration: ASA",
    substitutedFormula: "Given: two angles and included side",
    result: 0,
    explanation: "Identified ASA configuration - two angles and the included side are known"
  });

  // Determine which ASA case we have
  let A: number, B: number, c: number;
  if (angles.A && angles.B && sides.c) {
    A = angles.A;
    B = angles.B;
    c = sides.c;
  } else if (angles.B && angles.C && sides.a) {
    A = angles.B;
    B = angles.C;
    c = sides.a;
  } else if (angles.A && angles.C && sides.b) {
    A = angles.A;
    B = angles.C;
    c = sides.b;
  } else {
    throw new Error("Invalid ASA configuration");
  }

  // Calculate third angle using angle sum
  const angleCResult = triangleFormulas.missingAngleSum(A, B);
  const C = angleCResult.result;
  steps.push(angleCResult.step);

  // Use Law of Sines to find remaining sides
  const sideAResult = triangleFormulas.lawOfSines(c, C, undefined, A);
  if (sideAResult) {
    solution.sides = solution.sides || { a: 0, b: 0, c: 0 };
    solution.sides.a = sideAResult.result;
    steps.push(sideAResult.step);
  }

  const sideBResult = triangleFormulas.lawOfSines(c, C, undefined, B);
  if (sideBResult) {
    solution.sides = solution.sides || { a: 0, b: 0, c: 0 };
    solution.sides.b = sideBResult.result;
    steps.push(sideBResult.step);
  }

  // Assign angles and sides based on original input
  solution.angles = { A: 0, B: 0, C: 0 };
  solution.sides = { a: 0, b: 0, c: 0 };
  
  if (angles.A) solution.angles.A = angles.A;
  if (angles.B) solution.angles.B = angles.B;
  if (angles.C) solution.angles.C = angles.C;
  else solution.angles.C = C;

  if (sides.a) solution.sides.a = sides.a;
  if (sides.b) solution.sides.b = sides.b;
  if (sides.c) solution.sides.c = sides.c;

  // Set the calculated sides
  if (!sides.a && sides.c) solution.sides.a = solution.sides.a || sideAResult?.result;
  if (!sides.b && sides.c) solution.sides.b = solution.sides.b || sideBResult?.result;

  // Calculate area using SAS formula
  const { a: sa, b: sb } = solution.sides;
  if (sa && sb && solution.angles.C) {
    const areaResult = triangleFormulas.areaSAS(sa, sb, solution.angles.C);
    solution.area = areaResult.result;
    steps.push(areaResult.step);
  }

  // Calculate perimeter
  const { a: ssa, b: ssb, c: ssc } = solution.sides;
  if (ssa && ssb && ssc) {
    const perimeterResult = triangleFormulas.perimeter(ssa, ssb, ssc);
    solution.perimeter = perimeterResult.result;
    steps.push(perimeterResult.step);

    const semiperimeterResult = triangleFormulas.semiperimeter(ssa, ssb, ssc);
    solution.semiperimeter = semiperimeterResult.result;
    steps.push(semiperimeterResult.step);

    // Calculate circumradius and inradius
    if (solution.area) {
      const circumradiusResult = triangleFormulas.circumradius(ssa, ssb, ssc, solution.area);
      solution.circumradius = circumradiusResult.result;
      steps.push(circumradiusResult.step);

      const inradiusResult = triangleFormulas.inradius(solution.area, solution.semiperimeter!);
      solution.inradius = inradiusResult.result;
      steps.push(inradiusResult.step);
    }

    // Calculate altitudes
    solution.altitudes = {};
    const haResult = triangleFormulas.altitudeFromA(solution.area, ssa);
    solution.altitudes.ha = haResult.result;
    steps.push(haResult.step);

    const hbResult = triangleFormulas.altitudeFromB(solution.area, ssb);
    solution.altitudes.hb = hbResult.result;
    steps.push(hbResult.step);

    const hcResult = triangleFormulas.altitudeFromC(solution.area, ssc);
    solution.altitudes.hc = hcResult.result;
    steps.push(hcResult.step);

    // Calculate medians
    solution.medians = {};
    const maResult = triangleFormulas.medianFromA(ssa, ssb, ssc);
    solution.medians.ma = maResult.result;
    steps.push(maResult.step);

    const mbResult = triangleFormulas.medianFromB(ssa, ssb, ssc);
    solution.medians.mb = mbResult.result;
    steps.push(mbResult.step);

    const mcResult = triangleFormulas.medianFromC(ssa, ssb, ssc);
    solution.medians.mc = mcResult.result;
    steps.push(mcResult.step);
  }
}

/**
 * Solve AAS (Angle-Angle-Side) triangle
 */
function solveAAS(
  input: TriangleInput,
  solution: Partial<TriangleSolution>,
  steps: CalculationStep[]
): void {
  const sides = input.sides!;
  const angles = input.angles!;

  steps.push({
    formula: "Configuration: AAS",
    substitutedFormula: "Given: two angles and non-included side",
    result: 0,
    explanation: "Identified AAS configuration - two angles and a non-included side are known"
  });

  // Get the known angles
  const knownAngles = [angles.A, angles.B, angles.C].filter((a): a is number => a !== undefined);
  if (knownAngles.length !== 2) {
    throw new Error("AAS requires exactly two angles");
  }

  // Calculate third angle using angle sum
  const angleResult = triangleFormulas.missingAngleSum(knownAngles[0], knownAngles[1]);
  const thirdAngle = angleResult.result;
  steps.push(angleResult.step);

  // Assign all angles
  solution.angles = { A: 0, B: 0, C: 0 };
  if (angles.A) solution.angles.A = angles.A;
  if (angles.B) solution.angles.B = angles.B;
  if (angles.C) solution.angles.C = angles.C;
  
  // Set the calculated angle
  if (!angles.A) solution.angles.A = thirdAngle;
  else if (!angles.B) solution.angles.B = thirdAngle;
  else if (!angles.C) solution.angles.C = thirdAngle;

  // Use Law of Sines to find remaining sides
  const knownSide = Object.values(sides).find((s): s is number => s !== undefined);
  if (!knownSide) {
    throw new Error("AAS requires at least one side");
  }

  const { A, B, C } = solution.angles || { A: 0, B: 0, C: 0 };
  if (!A || !B || !C) {
    throw new Error("Failed to determine all angles");
  }

  solution.sides = { a: 0, b: 0, c: 0 };
  
  // Find which side is known and solve for the others
  if (sides.a) {
    solution.sides.a = sides.a;
    const sideBResult = triangleFormulas.lawOfSines(sides.a, A, undefined, B);
    if (sideBResult) {
      solution.sides.b = sideBResult.result;
      steps.push(sideBResult.step);
    }
    const sideCResult = triangleFormulas.lawOfSines(sides.a, A, undefined, C);
    if (sideCResult) {
      solution.sides.c = sideCResult.result;
      steps.push(sideCResult.step);
    }
  } else if (sides.b) {
    solution.sides.b = sides.b;
    const sideAResult = triangleFormulas.lawOfSines(sides.b, B, undefined, A);
    if (sideAResult) {
      solution.sides.a = sideAResult.result;
      steps.push(sideAResult.step);
    }
    const sideCResult = triangleFormulas.lawOfSines(sides.b, B, undefined, C);
    if (sideCResult) {
      solution.sides.c = sideCResult.result;
      steps.push(sideCResult.step);
    }
  } else if (sides.c) {
    solution.sides.c = sides.c;
    const sideAResult = triangleFormulas.lawOfSines(sides.c, C, undefined, A);
    if (sideAResult) {
      solution.sides.a = sideAResult.result;
      steps.push(sideAResult.step);
    }
    const sideBResult = triangleFormulas.lawOfSines(sides.c, C, undefined, B);
    if (sideBResult) {
      solution.sides.b = sideBResult.result;
      steps.push(sideBResult.step);
    }
  }

  // Calculate area
  const { a: sa, b: sb, c: sc } = solution.sides;
  if (sa && sb && sc) {
    const areaResult = triangleFormulas.areaHeron(sa, sb, sc);
    if (areaResult) {
      solution.area = areaResult.result;
      steps.push(areaResult.step);
    }

    const perimeterResult = triangleFormulas.perimeter(sa, sb, sc);
    solution.perimeter = perimeterResult.result;
    steps.push(perimeterResult.step);

    const semiperimeterResult = triangleFormulas.semiperimeter(sa, sb, sc);
    solution.semiperimeter = semiperimeterResult.result;
    steps.push(semiperimeterResult.step);

    // Calculate circumradius and inradius
    if (solution.area) {
      const circumradiusResult = triangleFormulas.circumradius(sa, sb, sc, solution.area);
      solution.circumradius = circumradiusResult.result;
      steps.push(circumradiusResult.step);

      const inradiusResult = triangleFormulas.inradius(solution.area, solution.semiperimeter!);
      solution.inradius = inradiusResult.result;
      steps.push(inradiusResult.step);
    }

    // Calculate altitudes
    solution.altitudes = {};
    const haResult = triangleFormulas.altitudeFromA(solution.area, sa);
    solution.altitudes.ha = haResult.result;
    steps.push(haResult.step);

    const hbResult = triangleFormulas.altitudeFromB(solution.area, sb);
    solution.altitudes.hb = hbResult.result;
    steps.push(hbResult.step);

    const hcResult = triangleFormulas.altitudeFromC(solution.area, sc);
    solution.altitudes.hc = hcResult.result;
    steps.push(hcResult.step);

    // Calculate medians
    solution.medians = {};
    const maResult = triangleFormulas.medianFromA(sa, sb, sc);
    solution.medians.ma = maResult.result;
    steps.push(maResult.step);

    const mbResult = triangleFormulas.medianFromB(sa, sb, sc);
    solution.medians.mb = mbResult.result;
    steps.push(mbResult.step);

    const mcResult = triangleFormulas.medianFromC(sa, sb, sc);
    solution.medians.mc = mcResult.result;
    steps.push(mcResult.step);
  }
}

/**
 * Solve SSA (Side-Side-Angle) triangle - ambiguous case
 */
function solveSSA(
  input: TriangleInput,
  solution: Partial<TriangleSolution>,
  steps: CalculationStep[]
): void {
  const sides = input.sides!;
  const angles = input.angles!;

  steps.push({
    formula: "Configuration: SSA (Ambiguous Case)",
    substitutedFormula: "Given: two sides and non-included angle",
    result: 0,
    explanation: "Identified SSA configuration - this case may have 0, 1, or 2 solutions"
  });

  // Determine which SSA case we have
  let knownSide: number, adjacentSide: number, knownAngle: number;
  let sideLabel: string, angleLabel: string;

  if (sides.a && sides.b && angles.A) {
    knownSide = sides.a;
    adjacentSide = sides.b;
    knownAngle = angles.A;
    sideLabel = "a";
    angleLabel = "A";
  } else if (sides.a && sides.c && angles.A) {
    knownSide = sides.a;
    adjacentSide = sides.c;
    knownAngle = angles.A;
    sideLabel = "a";
    angleLabel = "A";
  } else if (sides.b && sides.a && angles.B) {
    knownSide = sides.b;
    adjacentSide = sides.a;
    knownAngle = angles.B;
    sideLabel = "b";
    angleLabel = "B";
  } else if (sides.b && sides.c && angles.B) {
    knownSide = sides.b;
    adjacentSide = sides.c;
    knownAngle = angles.B;
    sideLabel = "b";
    angleLabel = "B";
  } else if (sides.c && sides.a && angles.C) {
    knownSide = sides.c;
    adjacentSide = sides.a;
    knownAngle = angles.C;
    sideLabel = "c";
    angleLabel = "C";
  } else if (sides.c && sides.b && angles.C) {
    knownSide = sides.c;
    adjacentSide = sides.b;
    knownAngle = angles.C;
    sideLabel = "c";
    angleLabel = "C";
  } else {
    throw new Error("Invalid SSA configuration");
  }

  // Solve SSA case
  const { solutions, count } = triangleFormulas.solveSSA(knownSide, adjacentSide, knownAngle);

  if (count === 0) {
    solution.status = "CONTRADICTORY";
    solution.errors = ["No valid triangle exists with these measurements"];
    return;
  }

  if (count === 2) {
    solution.status = "MULTIPLE_SOLUTIONS";
    solution.errors = ["Two valid geometric solutions exist for this SSA case"];
    
    // Create alternative solution
    const altSolution: Partial<TriangleSolution> = {
      status: "SOLVED",
      steps: [...steps],
      unit: solution.unit
    };

    // Build both solutions
    buildSSASolution(solutions[0], knownSide, adjacentSide, knownAngle, sideLabel, angleLabel, solution, steps);
    buildSSASolution(solutions[1], knownSide, adjacentSide, knownAngle, sideLabel, angleLabel, altSolution, steps);

    solution.alternativeSolution = altSolution as TriangleSolution;
    return;
  }

  // Single solution
  buildSSASolution(solutions[0], knownSide, adjacentSide, knownAngle, sideLabel, angleLabel, solution, steps);
}

/**
 * Build a complete solution from SSA results
 */
function buildSSASolution(
  ssaResult: { B: number; C: number; c: number },
  knownSide: number,
  adjacentSide: number,
  knownAngle: number,
  sideLabel: string,
  angleLabel: string,
  solution: Partial<TriangleSolution>,
  steps: CalculationStep[]
): void {
  // Assign angles based on the SSA result
  solution.angles = { A: 0, B: 0, C: 0 };
  solution.sides = { a: 0, b: 0, c: 0 };

  if (sideLabel === "a") {
    solution.sides.a = knownSide;
    solution.sides.b = adjacentSide;
    solution.sides.c = ssaResult.c;
    solution.angles.A = knownAngle;
    solution.angles.B = ssaResult.B;
    solution.angles.C = ssaResult.C;
  } else if (sideLabel === "b") {
    solution.sides.b = knownSide;
    solution.sides.a = adjacentSide;
    solution.sides.c = ssaResult.c;
    solution.angles.B = knownAngle;
    solution.angles.A = ssaResult.B;
    solution.angles.C = ssaResult.C;
  } else if (sideLabel === "c") {
    solution.sides.c = knownSide;
    solution.sides.a = adjacentSide;
    solution.sides.b = ssaResult.c;
    solution.angles.C = knownAngle;
    solution.angles.A = ssaResult.B;
    solution.angles.B = ssaResult.C;
  }

  // Calculate area
  const { a, b, c } = solution.sides;
  if (a && b && c) {
    const areaResult = triangleFormulas.areaHeron(a, b, c);
    if (areaResult) {
      solution.area = areaResult.result;
      steps.push(areaResult.step);
    }

    const perimeterResult = triangleFormulas.perimeter(a, b, c);
    solution.perimeter = perimeterResult.result;
    steps.push(perimeterResult.step);

    const semiperimeterResult = triangleFormulas.semiperimeter(a, b, c);
    solution.semiperimeter = semiperimeterResult.result;
    steps.push(semiperimeterResult.step);

    // Calculate circumradius and inradius
    if (solution.area) {
      const circumradiusResult = triangleFormulas.circumradius(a, b, c, solution.area);
      solution.circumradius = circumradiusResult.result;
      steps.push(circumradiusResult.step);

      const inradiusResult = triangleFormulas.inradius(solution.area, solution.semiperimeter!);
      solution.inradius = inradiusResult.result;
      steps.push(inradiusResult.step);
    }

    // Calculate altitudes
    solution.altitudes = {};
    const haResult = triangleFormulas.altitudeFromA(solution.area, a);
    solution.altitudes.ha = haResult.result;
    steps.push(haResult.step);

    const hbResult = triangleFormulas.altitudeFromB(solution.area, b);
    solution.altitudes.hb = hbResult.result;
    steps.push(hbResult.step);

    const hcResult = triangleFormulas.altitudeFromC(solution.area, c);
    solution.altitudes.hc = hcResult.result;
    steps.push(hcResult.step);

    // Calculate medians
    solution.medians = {};
    const maResult = triangleFormulas.medianFromA(a, b, c);
    solution.medians.ma = maResult.result;
    steps.push(maResult.step);

    const mbResult = triangleFormulas.medianFromB(a, b, c);
    solution.medians.mb = mbResult.result;
    steps.push(mbResult.step);

    const mcResult = triangleFormulas.medianFromC(a, b, c);
    solution.medians.mc = mcResult.result;
    steps.push(mcResult.step);
  }
}

/**
 * Solve right triangle
 */
function solveRightTriangle(
  input: TriangleInput,
  solution: Partial<TriangleSolution>,
  steps: CalculationStep[]
): void {
  const sides = input.sides || {};
  const angles = input.angles || {};

  steps.push({
    formula: "Configuration: Right Triangle",
    substitutedFormula: "Given: right triangle (one angle = 90°)",
    result: 0,
    explanation: "Identified right triangle configuration"
  });

  // Determine which angle is 90°
  let rightAngle = "C";
  if (angles.A && approxEqual(angles.A, 90, EPSILON * 100)) {
    rightAngle = "A";
  } else if (angles.B && approxEqual(angles.B, 90, EPSILON * 100)) {
    rightAngle = "B";
  }

  // Set the right angle
  solution.angles = solution.angles || { A: 0, B: 0, C: 0 };
  if (rightAngle === "A") solution.angles.A = 90;
  else if (rightAngle === "B") solution.angles.B = 90;
  else solution.angles.C = 90;

  // Copy known angles
  if (angles.A) solution.angles.A = angles.A;
  if (angles.B) solution.angles.B = angles.B;
  if (angles.C) solution.angles.C = angles.C;

  // Use Pythagorean theorem if we have two sides
  const knownSides = Object.entries(sides).filter(([, value]) => value !== undefined);
  
  if (knownSides.length >= 2) {
    const sideMap = Object.fromEntries(knownSides);
    const pythagoreanResult = triangleFormulas.pythagoreanTheorem(
      sideMap.a,
      sideMap.b,
      sideMap.c
    );
    
    if (pythagoreanResult) {
      steps.push(pythagoreanResult.step);
      
      // Determine which side was calculated
      if (!sides.a && sides.b && sides.c) {
        solution.sides = { a: pythagoreanResult.result, b: sides.b, c: sides.c };
      } else if (!sides.b && sides.a && sides.c) {
        solution.sides = { a: sides.a, b: pythagoreanResult.result, c: sides.c };
      } else if (!sides.c && sides.a && sides.b) {
        solution.sides = { a: sides.a, b: sides.b, c: pythagoreanResult.result };
      } else {
        solution.sides = sides as { a: number; b: number; c: number };
      }
    }
  }

  // Use trigonometry if we have one side and one acute angle
  const knownAngles = Object.entries(angles).filter(([, value]) => value !== undefined && !approxEqual(value, 90, EPSILON * 100));
  
  if (knownSides.length === 1 && knownAngles.length === 1) {
    const [sideName, sideValue] = knownSides[0];
    const [, angleValue] = knownAngles[0];
    
    // Determine which acute angle we have
    const acuteAngle = angleValue;
    const otherAcuteAngle = 90 - acuteAngle;
    
    // Set both acute angles
    if (rightAngle === "C") {
      solution.angles.A = acuteAngle;
      solution.angles.B = otherAcuteAngle;
    } else if (rightAngle === "A") {
      solution.angles.B = acuteAngle;
      solution.angles.C = otherAcuteAngle;
    } else {
      solution.angles.A = acuteAngle;
      solution.angles.C = otherAcuteAngle;
    }

    // Use trig to find other sides
    const angleRad = degreesToRadians(acuteAngle);
    solution.sides = solution.sides || { a: 0, b: 0, c: 0 };
    
    if (sideName === "a") {
      solution.sides.a = sideValue;
      // In a right triangle with right angle at C:
      // sin(A) = a/c, cos(A) = b/c, tan(A) = a/b
      if (rightAngle === "C") {
        solution.sides.c = sideValue / Math.sin(angleRad);
        solution.sides.b = sideValue / Math.tan(angleRad);
      }
    } else if (sideName === "b") {
      solution.sides.b = sideValue;
      if (rightAngle === "C") {
        solution.sides.c = sideValue / Math.sin(angleRad);
        solution.sides.a = sideValue / Math.tan(angleRad);
      }
    } else if (sideName === "c") {
      solution.sides.c = sideValue;
      if (rightAngle === "C") {
        solution.sides.a = sideValue * Math.sin(angleRad);
        solution.sides.b = sideValue * Math.cos(angleRad);
      }
    }
  }

  // Fill in missing angles using angle sum
  if (solution.angles.A && solution.angles.B && !solution.angles.C) {
    const angleCResult = triangleFormulas.missingAngleSum(solution.angles.A, solution.angles.B);
    solution.angles.C = angleCResult.result;
    steps.push(angleCResult.step);
  } else if (solution.angles.A && solution.angles.C && !solution.angles.B) {
    const angleBResult = triangleFormulas.missingAngleSum(solution.angles.A, solution.angles.C);
    solution.angles.B = angleBResult.result;
    steps.push(angleBResult.step);
  } else if (solution.angles.B && solution.angles.C && !solution.angles.A) {
    const angleAResult = triangleFormulas.missingAngleSum(solution.angles.B, solution.angles.C);
    solution.angles.A = angleAResult.result;
    steps.push(angleAResult.step);
  }

  // Calculate area and other properties
  const { a, b, c } = solution.sides;
  if (a && b && c) {
    // Area = 1/2 * base * height (legs of right triangle)
    let base: number, height: number;
    if (rightAngle === "C") {
      base = a;
      height = b;
    } else if (rightAngle === "A") {
      base = b;
      height = c;
    } else {
      base = a;
      height = c;
    }
    
    const areaResult = triangleFormulas.areaBaseHeight(base, height);
    solution.area = areaResult.result;
    steps.push(areaResult.step);

    const perimeterResult = triangleFormulas.perimeter(a, b, c);
    solution.perimeter = perimeterResult.result;
    steps.push(perimeterResult.step);

    const semiperimeterResult = triangleFormulas.semiperimeter(a, b, c);
    solution.semiperimeter = semiperimeterResult.result;
    steps.push(semiperimeterResult.step);

    // Calculate circumradius and inradius
    if (solution.area) {
      const circumradiusResult = triangleFormulas.circumradius(a, b, c, solution.area);
      solution.circumradius = circumradiusResult.result;
      steps.push(circumradiusResult.step);

      const inradiusResult = triangleFormulas.inradius(solution.area, solution.semiperimeter!);
      solution.inradius = inradiusResult.result;
      steps.push(inradiusResult.step);
    }

    // Calculate altitudes
    solution.altitudes = {};
    const haResult = triangleFormulas.altitudeFromA(solution.area, a);
    solution.altitudes.ha = haResult.result;
    steps.push(haResult.step);

    const hbResult = triangleFormulas.altitudeFromB(solution.area, b);
    solution.altitudes.hb = hbResult.result;
    steps.push(hbResult.step);

    const hcResult = triangleFormulas.altitudeFromC(solution.area, c);
    solution.altitudes.hc = hcResult.result;
    steps.push(hcResult.step);

    // Calculate medians
    solution.medians = {};
    const maResult = triangleFormulas.medianFromA(a, b, c);
    solution.medians.ma = maResult.result;
    steps.push(maResult.step);

    const mbResult = triangleFormulas.medianFromB(a, b, c);
    solution.medians.mb = mbResult.result;
    steps.push(mbResult.step);

    const mcResult = triangleFormulas.medianFromC(a, b, c);
    solution.medians.mc = mcResult.result;
    steps.push(mcResult.step);
  }
}
