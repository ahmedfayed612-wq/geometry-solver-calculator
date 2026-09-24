/**
 * Square solver - determines which mathematical relationships apply and solves unknown values
 */

import type { SquareInput, SquareSolution, CalculationStep } from "../core/types";
import { validateSquareInput } from "../core/validation";
import { normalizeLengths, denormalizeLengths } from "../core/units";
import * as squareFormulas from "../formulas/square";

/**
 * Main square solver function
 */
export function solveSquare(input: SquareInput): SquareSolution {
  // Validate input
  const validation = validateSquareInput(input);
  if (!validation.isValid) {
    return {
      status: validation.status || "CONTRADICTORY",
      steps: [],
      errors: validation.errors.map(e => e.message),
      side: 0,
      perimeter: 0,
      area: 0,
      diagonal: 0,
      interiorAngle: 90,
      unit: input.unit || "cm"
    };
  }

  // Normalize lengths to meters
  const unit = input.unit || "cm";
  const normalizedInput: SquareInput = { ...input, unit };
  
  if (input.side !== undefined) {
    normalizedInput.side = normalizeLengths({ side: input.side }, unit).side;
  }
  if (input.perimeter !== undefined) {
    normalizedInput.perimeter = normalizeLengths({ perimeter: input.perimeter }, unit).perimeter;
  }
  if (input.diagonal !== undefined) {
    normalizedInput.diagonal = normalizeLengths({ diagonal: input.diagonal }, unit).diagonal;
  }
  if (input.area !== undefined) {
    normalizedInput.area = input.area / (unit === "mm" ? 1000000 : unit === "cm" ? 10000 : unit === "km" ? 0.000001 : 1); // Convert area to m²
  }

  const steps: CalculationStep[] = [];
  const solution: Partial<SquareSolution> = {
    status: "SOLVED",
    steps,
    unit
  };

  // Determine what we know and solve for the rest
  let side: number | undefined;

  // Try to find side from known values
  if (normalizedInput.side !== undefined) {
    side = normalizedInput.side;
    steps.push({
      formula: "Given: side",
      substitutedFormula: `s = ${side}`,
      result: side,
      explanation: "Side length is provided"
    });
  } else if (normalizedInput.perimeter !== undefined) {
    const result = squareFormulas.sideFromPerimeter(normalizedInput.perimeter);
    side = result.result;
    steps.push(result.step);
  } else if (normalizedInput.area !== undefined) {
    const result = squareFormulas.sideFromArea(normalizedInput.area);
    side = result.result;
    steps.push(result.step);
  } else if (normalizedInput.diagonal !== undefined) {
    const result = squareFormulas.sideFromDiagonal(normalizedInput.diagonal);
    side = result.result;
    steps.push(result.step);
  }

  if (side === undefined) {
    return {
      status: "INSUFFICIENT_INFORMATION",
      steps: [],
      errors: ["Insufficient information to solve the square"],
      side: 0,
      perimeter: 0,
      area: 0,
      diagonal: 0,
      interiorAngle: 90,
      unit
    };
  }

  // Calculate all other properties from side
  const perimeterResult = squareFormulas.perimeterFromSide(side);
  solution.perimeter = perimeterResult.result;
  steps.push(perimeterResult.step);

  const areaResult = squareFormulas.areaFromSide(side);
  solution.area = areaResult.result;
  steps.push(areaResult.step);

  const diagonalResult = squareFormulas.diagonalFromSide(side);
  solution.diagonal = diagonalResult.result;
  steps.push(diagonalResult.step);

  const angleResult = squareFormulas.interiorAngle();
  solution.interiorAngle = angleResult.result;
  steps.push(angleResult.step);

  solution.side = side;

  // Denormalize lengths back to original unit
  solution.side = denormalizeLengths({ side: solution.side }, unit).side;
  solution.perimeter = denormalizeLengths({ perimeter: solution.perimeter }, unit).perimeter;
  solution.diagonal = denormalizeLengths({ diagonal: solution.diagonal }, unit).diagonal;
  
  // Denormalize area (area scales by square of length conversion factor)
  if (solution.area !== undefined) {
    const areaInMeters = solution.area;
    const areaFactor = unit === "mm" ? 1000000 : unit === "cm" ? 10000 : unit === "km" ? 0.000001 : 1;
    solution.area = areaInMeters * areaFactor;
  }

  return solution as SquareSolution;
}
