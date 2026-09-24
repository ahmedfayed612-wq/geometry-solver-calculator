/**
 * Rectangle solver - determines which mathematical relationships apply and solves unknown values
 */

import type { RectangleInput, RectangleSolution, CalculationStep } from "../core/types";
import { validateRectangleInput } from "../core/validation";
import { normalizeLengths, denormalizeLengths } from "../core/units";
import { isPositive } from "../core/tolerance";
import * as rectangleFormulas from "../formulas/rectangle";

/**
 * Main rectangle solver function
 */
export function solveRectangle(input: RectangleInput): RectangleSolution {
  // Validate input
  const validation = validateRectangleInput(input);
  if (!validation.isValid) {
    return {
      status: validation.status || "CONTRADICTORY",
      steps: [],
      errors: validation.errors.map(e => e.message),
      length: 0,
      width: 0,
      area: 0,
      perimeter: 0,
      diagonal: 0,
      interiorAngles: { all: 90 },
      unit: input.unit || "cm"
    };
  }

  // Normalize lengths to meters
  const unit = input.unit || "cm";
  const normalizedInput: RectangleInput = { ...input, unit };
  
  if (input.length !== undefined) {
    normalizedInput.length = normalizeLengths({ length: input.length }, unit).length;
  }
  if (input.width !== undefined) {
    normalizedInput.width = normalizeLengths({ width: input.width }, unit).width;
  }
  if (input.diagonal !== undefined) {
    normalizedInput.diagonal = normalizeLengths({ diagonal: input.diagonal }, unit).diagonal;
  }
  if (input.perimeter !== undefined) {
    normalizedInput.perimeter = normalizeLengths({ perimeter: input.perimeter }, unit).perimeter;
  }
  if (input.area !== undefined) {
    normalizedInput.area = input.area / (unit === "mm" ? 1000000 : unit === "cm" ? 10000 : unit === "km" ? 0.000001 : 1); // Convert area to m²
  }

  const steps: CalculationStep[] = [];
  const solution: Partial<RectangleSolution> = {
    status: "SOLVED",
    steps,
    unit
  };

  // Determine what we know and solve for the rest
  let length: number | undefined;
  let width: number | undefined;

  // Case 1: Both length and width are known
  if (normalizedInput.length !== undefined && normalizedInput.width !== undefined) {
    length = normalizedInput.length;
    width = normalizedInput.width;
    steps.push({
      formula: "Given: length and width",
      substitutedFormula: `l = ${length}, w = ${width}`,
      result: 0,
      explanation: "Both length and width are provided"
    });
  }
  // Case 2: Length and area known
  else if (normalizedInput.length !== undefined && normalizedInput.area !== undefined) {
    length = normalizedInput.length;
    const result = rectangleFormulas.widthFromAreaLength(normalizedInput.area, length);
    width = result.result;
    steps.push({
      formula: "Given: length and area",
      substitutedFormula: `l = ${length}, A = ${normalizedInput.area}`,
      result: 0,
      explanation: "Length and area are provided"
    });
    steps.push(result.step);
  }
  // Case 3: Width and area known
  else if (normalizedInput.width !== undefined && normalizedInput.area !== undefined) {
    width = normalizedInput.width;
    const result = rectangleFormulas.lengthFromAreaWidth(normalizedInput.area, width);
    length = result.result;
    steps.push({
      formula: "Given: width and area",
      substitutedFormula: `w = ${width}, A = ${normalizedInput.area}`,
      result: 0,
      explanation: "Width and area are provided"
    });
    steps.push(result.step);
  }
  // Case 4: Length and perimeter known
  else if (normalizedInput.length !== undefined && normalizedInput.perimeter !== undefined) {
    length = normalizedInput.length;
    const result = rectangleFormulas.widthFromPerimeterLength(normalizedInput.perimeter, length);
    width = result.result;
    steps.push({
      formula: "Given: length and perimeter",
      substitutedFormula: `l = ${length}, P = ${normalizedInput.perimeter}`,
      result: 0,
      explanation: "Length and perimeter are provided"
    });
    steps.push(result.step);
  }
  // Case 5: Width and perimeter known
  else if (normalizedInput.width !== undefined && normalizedInput.perimeter !== undefined) {
    width = normalizedInput.width;
    const result = rectangleFormulas.lengthFromPerimeterWidth(normalizedInput.perimeter, width);
    length = result.result;
    steps.push({
      formula: "Given: width and perimeter",
      substitutedFormula: `w = ${width}, P = ${normalizedInput.perimeter}`,
      result: 0,
      explanation: "Width and perimeter are provided"
    });
    steps.push(result.step);
  }
  // Case 6: Length and diagonal known
  else if (normalizedInput.length !== undefined && normalizedInput.diagonal !== undefined) {
    length = normalizedInput.length;
    const result = rectangleFormulas.widthFromDiagonalLength(normalizedInput.diagonal, length);
    if (result.result === undefined || isNaN(result.result) || !isPositive(result.result)) {
      return {
        status: "CONTRADICTORY",
        steps,
        errors: ["Diagonal is too short for the given length"],
        length: 0,
        width: 0,
        area: 0,
        perimeter: 0,
        diagonal: 0,
        interiorAngles: { all: 90 },
        unit
      };
    }
    width = result.result;
    steps.push({
      formula: "Given: length and diagonal",
      substitutedFormula: `l = ${length}, d = ${normalizedInput.diagonal}`,
      result: 0,
      explanation: "Length and diagonal are provided"
    });
    steps.push(result.step);
  }
  // Case 7: Width and diagonal known
  else if (normalizedInput.width !== undefined && normalizedInput.diagonal !== undefined) {
    width = normalizedInput.width;
    const result = rectangleFormulas.lengthFromDiagonalWidth(normalizedInput.diagonal, width);
    if (result.result === undefined || isNaN(result.result) || !isPositive(result.result)) {
      return {
        status: "CONTRADICTORY",
        steps,
        errors: ["Diagonal is too short for the given width"],
        length: 0,
        width: 0,
        area: 0,
        perimeter: 0,
        diagonal: 0,
        interiorAngles: { all: 90 },
        unit
      };
    }
    length = result.result;
    steps.push({
      formula: "Given: width and diagonal",
      substitutedFormula: `w = ${width}, d = ${normalizedInput.diagonal}`,
      result: 0,
      explanation: "Width and diagonal are provided"
    });
    steps.push(result.step);
  }
  // Case 8: Area and perimeter known (requires quadratic solution)
  else if (normalizedInput.area !== undefined && normalizedInput.perimeter !== undefined) {
    const lengthResult = rectangleFormulas.lengthFromAreaPerimeter(normalizedInput.area, normalizedInput.perimeter);
    const widthResult = rectangleFormulas.widthFromAreaPerimeter(normalizedInput.area, normalizedInput.perimeter);
    
    if (!lengthResult || !widthResult || isNaN(lengthResult.result) || isNaN(widthResult.result)) {
      return {
        status: "CONTRADICTORY",
        steps,
        errors: ["No valid rectangle exists with this area and perimeter"],
        length: 0,
        width: 0,
        area: 0,
        perimeter: 0,
        diagonal: 0,
        interiorAngles: { all: 90 },
        unit
      };
    }
    
    length = lengthResult.result;
    width = widthResult.result;
    
    steps.push({
      formula: "Given: area and perimeter",
      substitutedFormula: `A = ${normalizedInput.area}, P = ${normalizedInput.perimeter}`,
      result: 0,
      explanation: "Area and perimeter are provided"
    });
    steps.push(lengthResult.step);
    steps.push(widthResult.step);
  }
  // Case 9: Only one value provided - insufficient
  else {
    return {
      status: "INSUFFICIENT_INFORMATION",
      steps: [],
      errors: ["Insufficient information to solve the rectangle. Need at least two measurements."],
      length: 0,
      width: 0,
      area: 0,
      perimeter: 0,
      diagonal: 0,
      interiorAngles: { all: 90 },
      unit
    };
  }

  if (length === undefined || width === undefined) {
    return {
      status: "INSUFFICIENT_INFORMATION",
      steps: [],
      errors: ["Could not determine both length and width from the provided information"],
      length: 0,
      width: 0,
      area: 0,
      perimeter: 0,
      diagonal: 0,
      interiorAngles: { all: 90 },
      unit
    };
  }

  // Calculate all other properties from length and width
  solution.length = length;
  solution.width = width;

  const perimeterResult = rectangleFormulas.perimeterFromLengthWidth(length, width);
  solution.perimeter = perimeterResult.result;
  steps.push(perimeterResult.step);

  const areaResult = rectangleFormulas.areaFromLengthWidth(length, width);
  solution.area = areaResult.result;
  steps.push(areaResult.step);

  const diagonalResult = rectangleFormulas.diagonalFromLengthWidth(length, width);
  solution.diagonal = diagonalResult.result;
  steps.push(diagonalResult.step);

  const angleResult = rectangleFormulas.interiorAngles();
  solution.interiorAngles = angleResult.result;
  steps.push(angleResult.step);

  // Denormalize lengths back to original unit
  solution.length = denormalizeLengths({ length: solution.length }, unit).length;
  solution.width = denormalizeLengths({ width: solution.width }, unit).width;
  solution.perimeter = denormalizeLengths({ perimeter: solution.perimeter }, unit).perimeter;
  solution.diagonal = denormalizeLengths({ diagonal: solution.diagonal }, unit).diagonal;
  
  // Denormalize area (area scales by square of length conversion factor)
  if (solution.area !== undefined) {
    const areaInMeters = solution.area;
    const areaFactor = unit === "mm" ? 1000000 : unit === "cm" ? 10000 : unit === "km" ? 0.000001 : 1;
    solution.area = areaInMeters * areaFactor;
  }

  return solution as RectangleSolution;
}
