/**
 * Core type definitions for the geometry solving engine
 */

/**
 * Result status of a geometry solve operation
 */
export type SolveStatus =
  | "SOLVED"
  | "MULTIPLE_SOLUTIONS"
  | "INSUFFICIENT_INFORMATION"
  | "CONTRADICTORY";

/**
 * Supported geometric shapes
 */
export type Shape =
  | "TRIANGLE"
  | "SQUARE"
  | "RECTANGLE"
  | "PARALLELOGRAM"
  | "RHOMBUS"
  | "TRAPEZOID"
  | "CIRCLE"
  | "REGULAR_POLYGON";

/**
 * Length units for linear measurements
 */
export type LengthUnit = "mm" | "cm" | "m" | "km";

/**
 * Angle units (internal calculations use radians, UI uses degrees)
 */
export type AngleUnit = "degrees" | "radians";

/**
 * Calculation step for explanation engine
 */
export interface CalculationStep {
  formula: string;
  substitutedFormula: string;
  result: number;
  explanation: string;
}

/**
 * Base solution interface
 */
export interface BaseSolution {
  status: SolveStatus;
  steps: CalculationStep[];
  errors?: string[];
}

/**
 * Triangle-specific types
 */
export interface TriangleInput {
  sides?: {
    a?: number;
    b?: number;
    c?: number;
  };
  angles?: {
    A?: number; // in degrees
    B?: number; // in degrees
    C?: number; // in degrees
  };
  isRightTriangle?: boolean;
  isEquilateral?: boolean;
  isIsosceles?: boolean;
  unit?: LengthUnit;
}

export interface TriangleSolution extends BaseSolution {
  sides?: {
    a: number;
    b: number;
    c: number;
  };
  angles?: {
    A: number; // in degrees
    B: number; // in degrees
    C: number; // in degrees
  };
  area?: number;
  perimeter?: number;
  semiperimeter?: number;
  circumradius?: number;
  inradius?: number;
  altitudes?: {
    ha?: number; // altitude from A
    hb?: number; // altitude from B
    hc?: number; // altitude from C
  };
  medians?: {
    ma?: number; // median from A
    mb?: number; // median from B
    mc?: number; // median from C
  };
  unit?: LengthUnit;
  alternativeSolution?: TriangleSolution; // For SSA ambiguous case
}

/**
 * Square-specific types
 */
export interface SquareInput {
  side?: number;
  perimeter?: number;
  area?: number;
  diagonal?: number;
  unit?: LengthUnit;
}

export interface SquareSolution extends BaseSolution {
  side: number;
  perimeter: number;
  area: number;
  diagonal: number;
  interiorAngle: number;
  unit: LengthUnit;
}

/**
 * Rectangle-specific types
 */
export interface RectangleInput {
  length?: number;
  width?: number;
  area?: number;
  perimeter?: number;
  diagonal?: number;
  unit?: LengthUnit;
}

export interface RectangleSolution extends BaseSolution {
  length: number;
  width: number;
  area: number;
  perimeter: number;
  diagonal: number;
  interiorAngles: {
    all: number;
  };
  unit: LengthUnit;
}

/**
 * Parallelogram-specific types
 */
export interface ParallelogramInput {
  sides?: {
    a?: number;
    b?: number;
  };
  angles?: {
    A?: number; // in degrees
    B?: number; // in degrees
  };
  height?: number;
  area?: number;
  perimeter?: number;
  diagonal?: {
    d1?: number;
    d2?: number;
  };
  unit?: LengthUnit;
}

export interface ParallelogramSolution extends BaseSolution {
  sides: {
    a: number;
    b: number;
  };
  angles: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  area: number;
  perimeter: number;
  height?: number;
  diagonals?: {
    d1?: number;
    d2?: number;
  };
  unit: LengthUnit;
}

/**
 * Rhombus-specific types
 */
export interface RhombusInput {
  side?: number;
  area?: number;
  diagonals?: {
    d1?: number;
    d2?: number;
  };
  angles?: {
    A?: number; // in degrees
    B?: number; // in degrees
  };
  height?: number;
  perimeter?: number;
  unit?: LengthUnit;
}

export interface RhombusSolution extends BaseSolution {
  side: number;
  area: number;
  diagonals?: {
    d1: number;
    d2: number;
  };
  angles: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  height?: number;
  perimeter: number;
  unit: LengthUnit;
}

/**
 * Trapezoid-specific types
 */
export interface TrapezoidInput {
  bases?: {
    a?: number; // top base
    b?: number; // bottom base
  };
  legs?: {
    c?: number; // left leg
    d?: number; // right leg
  };
  height?: number;
  angles?: {
    A?: number; // top-left
    B?: number; // top-right
    C?: number; // bottom-right
    D?: number; // bottom-left
  };
  area?: number;
  perimeter?: number;
  isIsosceles?: boolean;
  unit?: LengthUnit;
}

export interface TrapezoidSolution extends BaseSolution {
  bases: {
    a: number;
    b: number;
  };
  legs: {
    c: number;
    d: number;
  };
  height: number;
  angles: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  area: number;
  perimeter: number;
  isIsosceles: boolean;
  diagonals?: {
    d1?: number;
    d2?: number;
  };
  unit: LengthUnit;
}

/**
 * Circle-specific types
 */
export interface CircleInput {
  radius?: number;
  diameter?: number;
  circumference?: number;
  area?: number;
  arcLength?: number;
  centralAngle?: number; // in degrees
  sectorArea?: number;
  unit?: LengthUnit;
}

export interface CircleSolution extends BaseSolution {
  radius: number;
  diameter: number;
  circumference: number;
  area: number;
  arcLength?: number;
  centralAngle?: number;
  sectorArea?: number;
  sectorPerimeter?: number;
  unit: LengthUnit;
}

/**
 * Regular Polygon-specific types
 */
export interface RegularPolygonInput {
  numSides?: number;
  side?: number;
  perimeter?: number;
  apothem?: number;
  area?: number;
  interiorAngle?: number;
  circumradius?: number;
  unit?: LengthUnit;
}

export interface RegularPolygonSolution extends BaseSolution {
  numSides: number;
  side: number;
  perimeter: number;
  apothem: number;
  area: number;
  interiorAngle: number;
  exteriorAngle: number;
  circumradius: number;
  inradius: number;
  unit: LengthUnit;
}

/**
 * Generic geometry input (union of all shape inputs)
 */
export type GeometryInput =
  | TriangleInput
  | SquareInput
  | RectangleInput
  | ParallelogramInput
  | RhombusInput
  | TrapezoidInput
  | CircleInput
  | RegularPolygonInput;

/**
 * Generic geometry solution (union of all shape solutions)
 */
export type GeometrySolution =
  | TriangleSolution
  | SquareSolution
  | RectangleSolution
  | ParallelogramSolution
  | RhombusSolution
  | TrapezoidSolution
  | CircleSolution
  | RegularPolygonSolution;

/**
 * Constraint predicate - determines when a formula applies
 */
export type ConstraintPredicate = (input: GeometryInput) => boolean;

/**
 * Solver function - takes input and returns solution
 */
export type SolverFunction = (input: GeometryInput) => GeometrySolution;

/**
 * Formula registry entry
 */
export interface Formula {
  id: string;
  name: string;
  description: string;
  variables: string[];
  applicableWhen: ConstraintPredicate;
  solve: SolverFunction;
}

/**
 * Geometric constraint
 */
export interface Constraint {
  type: "SIDE" | "ANGLE" | "AREA" | "PERIMETER" | "DIAGONAL" | "HEIGHT" | "RADIUS" | "APOTHEM";
  value: number;
  unit?: LengthUnit | AngleUnit;
  vertex?: string; // For side/angle constraints (e.g., "A", "B", "C")
}
