/**
 * Validation framework for geometric inputs
 */

import type { TriangleInput, SquareInput, RectangleInput, SolveStatus } from "./types";
import { isPositive, isValidTriangleAngle, canFormTriangle, approxEqual, EPSILON } from "./tolerance";

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  status?: SolveStatus;
}

/**
 * Validate a triangle input
 */
export function validateTriangleInput(input: TriangleInput): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if any input is provided
  const hasSides = input.sides && (input.sides.a !== undefined || input.sides.b !== undefined || input.sides.c !== undefined);
  const hasAngles = input.angles && (input.angles.A !== undefined || input.angles.B !== undefined || input.angles.C !== undefined);

  if (!hasSides && !hasAngles) {
    return {
      isValid: false,
      errors: [{ field: "input", message: "No measurements provided" }],
      status: "INSUFFICIENT_INFORMATION"
    };
  }

  // Validate sides
  if (input.sides) {
    if (input.sides.a !== undefined) {
      if (!isPositive(input.sides.a)) {
        errors.push({ field: "sides.a", message: "Side length must be positive", value: input.sides.a });
      }
    }
    if (input.sides.b !== undefined) {
      if (!isPositive(input.sides.b)) {
        errors.push({ field: "sides.b", message: "Side length must be positive", value: input.sides.b });
      }
    }
    if (input.sides.c !== undefined) {
      if (!isPositive(input.sides.c)) {
        errors.push({ field: "sides.c", message: "Side length must be positive", value: input.sides.c });
      }
    }

    // Check triangle inequality if all three sides are provided
    if (input.sides.a !== undefined && input.sides.b !== undefined && input.sides.c !== undefined) {
      if (!canFormTriangle(input.sides.a, input.sides.b, input.sides.c)) {
        errors.push({
          field: "sides",
          message: "These side lengths cannot form a triangle (triangle inequality violated)",
          value: { a: input.sides.a, b: input.sides.b, c: input.sides.c }
        });
        return {
          isValid: false,
          errors,
          status: "CONTRADICTORY"
        };
      }
    }
  }

  // Validate angles
  if (input.angles) {
    if (input.angles.A !== undefined) {
      if (!isValidTriangleAngle(input.angles.A)) {
        errors.push({ field: "angles.A", message: "Angle must be between 0° and 180°", value: input.angles.A });
      }
    }
    if (input.angles.B !== undefined) {
      if (!isValidTriangleAngle(input.angles.B)) {
        errors.push({ field: "angles.B", message: "Angle must be between 0° and 180°", value: input.angles.B });
      }
    }
    if (input.angles.C !== undefined) {
      if (!isValidTriangleAngle(input.angles.C)) {
        errors.push({ field: "angles.C", message: "Angle must be between 0° and 180°", value: input.angles.C });
      }
    }

    // Check if angles sum to 180 if all three are provided
    if (input.angles.A !== undefined && input.angles.B !== undefined && input.angles.C !== undefined) {
      const sum = input.angles.A + input.angles.B + input.angles.C;
      if (!approxEqual(sum, 180, EPSILON * 100)) {
        errors.push({
          field: "angles",
          message: "Angles must sum to 180°",
          value: { A: input.angles.A, B: input.angles.B, C: input.angles.C, sum }
        });
        return {
          isValid: false,
          errors,
          status: "CONTRADICTORY"
        };
      }
    }
  }

  // Check for contradictory constraints
  // Example: Right triangle with sides that don't satisfy Pythagorean theorem
  if (input.isRightTriangle && input.sides) {
    const { a, b, c } = input.sides;
    if (a !== undefined && b !== undefined && c !== undefined) {
      // Check if it's actually a right triangle
      const a2 = a * a;
      const b2 = b * b;
      const c2 = c * c;
      
      const isRight = 
        approxEqual(a2 + b2, c2, EPSILON * 100) ||
        approxEqual(a2 + c2, b2, EPSILON * 100) ||
        approxEqual(b2 + c2, a2, EPSILON * 100);
      
      if (!isRight) {
        errors.push({
          field: "input",
          message: "Sides do not satisfy Pythagorean theorem for a right triangle",
          value: { a, b, c }
        });
        return {
          isValid: false,
          errors,
          status: "CONTRADICTORY"
        };
      }
    }
  }

  // Check for equilateral triangle contradiction
  if (input.isEquilateral && input.sides) {
    const { a, b, c } = input.sides;
    const definedSides = [a, b, c].filter((s): s is number => s !== undefined);
    
    if (definedSides.length >= 2) {
      const [s1, s2] = definedSides;
      if (!approxEqual(s1, s2, EPSILON * 100)) {
        errors.push({
          field: "input",
          message: "Sides are not equal for an equilateral triangle",
          value: { a, b, c }
        });
        return {
          isValid: false,
          errors,
          status: "CONTRADICTORY"
        };
      }
    }
    
    // If all three sides are defined, check they're all equal
    if (definedSides.length === 3) {
      const [s1, s2, s3] = definedSides;
      if (!approxEqual(s1, s2, EPSILON * 100) || !approxEqual(s2, s3, EPSILON * 100)) {
        errors.push({
          field: "input",
          message: "Sides are not equal for an equilateral triangle",
          value: { a, b, c }
        });
        return {
          isValid: false,
          errors,
          status: "CONTRADICTORY"
        };
      }
    }
  }

  // Check for isosceles triangle contradiction
  if (input.isIsosceles && input.sides) {
    const { a, b, c } = input.sides;
    const definedSides = [a, b, c].filter((s): s is number => s !== undefined);
    
    if (definedSides.length === 3) {
      const [s1, s2, s3] = definedSides;
      const hasEqualPair = 
        approxEqual(s1, s2, EPSILON * 100) ||
        approxEqual(s1, s3, EPSILON * 100) ||
        approxEqual(s2, s3, EPSILON * 100);
      
      if (!hasEqualPair) {
        errors.push({
          field: "input",
          message: "No two sides are equal for an isosceles triangle",
          value: { a, b, c }
        });
        return {
          isValid: false,
          errors,
          status: "CONTRADICTORY"
        };
      }
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors
    };
  }

  return {
    isValid: true,
    errors: []
  };
}

/**
 * Validate a square input
 */
export function validateSquareInput(input: SquareInput): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if any input is provided
  const hasInput = 
    input.side !== undefined ||
    input.perimeter !== undefined ||
    input.area !== undefined ||
    input.diagonal !== undefined;

  if (!hasInput) {
    return {
      isValid: false,
      errors: [{ field: "input", message: "No measurements provided" }],
      status: "INSUFFICIENT_INFORMATION"
    };
  }

  // Validate side
  if (input.side !== undefined && !isPositive(input.side)) {
    errors.push({ field: "side", message: "Side length must be positive", value: input.side });
  }

  // Validate perimeter
  if (input.perimeter !== undefined && !isPositive(input.perimeter)) {
    errors.push({ field: "perimeter", message: "Perimeter must be positive", value: input.perimeter });
  }

  // Validate area
  if (input.area !== undefined && !isPositive(input.area)) {
    errors.push({ field: "area", message: "Area must be positive", value: input.area });
  }

  // Validate diagonal
  if (input.diagonal !== undefined && !isPositive(input.diagonal)) {
    errors.push({ field: "diagonal", message: "Diagonal must be positive", value: input.diagonal });
  }

  // Check for contradictory constraints
  // If multiple values are provided, they should be consistent
  const providedValues: string[] = [];
  if (input.side !== undefined) providedValues.push("side");
  if (input.perimeter !== undefined) providedValues.push("perimeter");
  if (input.area !== undefined) providedValues.push("area");
  if (input.diagonal !== undefined) providedValues.push("diagonal");

  if (providedValues.length > 1) {
    // Calculate expected values from side and check consistency
    if (input.side !== undefined) {
      const side = input.side;
      
      if (input.perimeter !== undefined) {
        const expectedPerimeter = 4 * side;
        if (!approxEqual(input.perimeter, expectedPerimeter, EPSILON * 100)) {
          errors.push({
            field: "perimeter",
            message: "Perimeter is inconsistent with side length",
            value: { expected: expectedPerimeter, actual: input.perimeter }
          });
        }
      }
      
      if (input.area !== undefined) {
        const expectedArea = side * side;
        if (!approxEqual(input.area, expectedArea, EPSILON * 100 * side)) {
          errors.push({
            field: "area",
            message: "Area is inconsistent with side length",
            value: { expected: expectedArea, actual: input.area }
          });
        }
      }
      
      if (input.diagonal !== undefined) {
        const expectedDiagonal = side * Math.sqrt(2);
        if (!approxEqual(input.diagonal, expectedDiagonal, EPSILON * 100 * side)) {
          errors.push({
            field: "diagonal",
            message: "Diagonal is inconsistent with side length",
            value: { expected: expectedDiagonal, actual: input.diagonal }
          });
        }
      }
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      status: errors.some(e => e.message.includes("inconsistent")) ? "CONTRADICTORY" : undefined
    };
  }

  return {
    isValid: true,
    errors: []
  };
}

/**
 * Validate a rectangle input
 */
export function validateRectangleInput(input: RectangleInput): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if any input is provided
  const hasInput = 
    input.length !== undefined ||
    input.width !== undefined ||
    input.area !== undefined ||
    input.perimeter !== undefined ||
    input.diagonal !== undefined;

  if (!hasInput) {
    return {
      isValid: false,
      errors: [{ field: "input", message: "No measurements provided" }],
      status: "INSUFFICIENT_INFORMATION"
    };
  }

  // Validate length
  if (input.length !== undefined && !isPositive(input.length)) {
    errors.push({ field: "length", message: "Length must be positive", value: input.length });
  }

  // Validate width
  if (input.width !== undefined && !isPositive(input.width)) {
    errors.push({ field: "width", message: "Width must be positive", value: input.width });
  }

  // Validate area
  if (input.area !== undefined && !isPositive(input.area)) {
    errors.push({ field: "area", message: "Area must be positive", value: input.area });
  }

  // Validate perimeter
  if (input.perimeter !== undefined && !isPositive(input.perimeter)) {
    errors.push({ field: "perimeter", message: "Perimeter must be positive", value: input.perimeter });
  }

  // Validate diagonal
  if (input.diagonal !== undefined && !isPositive(input.diagonal)) {
    errors.push({ field: "diagonal", message: "Diagonal must be positive", value: input.diagonal });
  }

  // Check for contradictory constraints
  if (input.length !== undefined && input.width !== undefined) {
    const length = input.length;
    const width = input.width;
    
    if (input.area !== undefined) {
      const expectedArea = length * width;
      if (!approxEqual(input.area, expectedArea, EPSILON * 100 * length * width)) {
        errors.push({
          field: "area",
          message: "Area is inconsistent with length and width",
          value: { expected: expectedArea, actual: input.area }
        });
      }
    }
    
    if (input.perimeter !== undefined) {
      const expectedPerimeter = 2 * (length + width);
      if (!approxEqual(input.perimeter, expectedPerimeter, EPSILON * 100 * (length + width))) {
        errors.push({
          field: "perimeter",
          message: "Perimeter is inconsistent with length and width",
          value: { expected: expectedPerimeter, actual: input.perimeter }
        });
      }
    }
    
    if (input.diagonal !== undefined) {
      const expectedDiagonal = Math.sqrt(length * length + width * width);
      if (!approxEqual(input.diagonal, expectedDiagonal, EPSILON * 100 * expectedDiagonal)) {
        errors.push({
          field: "diagonal",
          message: "Diagonal is inconsistent with length and width",
          value: { expected: expectedDiagonal, actual: input.diagonal }
        });
      }
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      status: errors.some(e => e.message.includes("inconsistent")) ? "CONTRADICTORY" : undefined
    };
  }

  return {
    isValid: true,
    errors: []
  };
}

/**
 * Generic validation for positive numbers
 */
export function validatePositiveNumber(value: number, fieldName: string): ValidationError | null {
  if (!isPositive(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be positive`,
      value
    };
  }
  return null;
}

/**
 * Generic validation for angles (0 < angle < 180)
 */
export function validateAngle(angle: number, fieldName: string): ValidationError | null {
  if (!isValidTriangleAngle(angle)) {
    return {
      field: fieldName,
      message: `${fieldName} must be between 0° and 180°`,
      value: angle
    };
  }
  return null;
}
