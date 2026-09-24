# GeoSolve - Intelligent Geometry Calculator

A production-quality web application that functions as an intelligent geometry calculator. Users select a geometric shape, enter whatever measurements they know, and the application determines all mathematically derivable unknown values.

## 🎯 Project Purpose

The core identity of this application is: **"Give me the geometric information you know. I'll determine what can be mathematically determined."**

This is a university Computer Science project where the mathematical solving engine is the most important part of the application. The UI is a modern calculator interface, but the heart of the project is the robust geometry constraint-solving engine.

## 🛠️ Technologies

- **TypeScript** - Type-safe development
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Math.js** - Numerical utilities and equation solving
- **Vitest** - Fast unit testing framework
- **Oxlint** - High-performance linter

## 🏗️ Architecture

The application maintains a strict separation of concerns:

```
src/
├── geometry-engine/
│   ├── core/           # Core types, utilities, validation
│   ├── formulas/       # Mathematical formulas and theorems
│   ├── solvers/        # Shape-specific solving engines
│   └── __tests__/      # Comprehensive test suites
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

### Mathematical Engine Architecture

The geometry engine is organized as:

- **Core**: Types, units, tolerance, validation, constraints
- **Formulas**: Mathematical theorems (Law of Sines, Law of Cosines, etc.)
- **Solvers**: Shape-specific constraint-solving engines
- **Testing**: Comprehensive test coverage for mathematical correctness

The UI never contains mathematical solving logic. All calculations are performed by the geometry engine.

## 🔢 Supported Shapes (V1)

### ✅ Implemented (Phases 1-4)

#### Triangle
- General triangle, equilateral, isosceles, right triangle
- Configurations: SSS, SAS, ASA, AAS, SSA, right-triangle cases
- Calculates: sides, angles, area, perimeter, heights, circumradius, inradius, semiperimeter, medians

#### Square
- Inputs: side, perimeter, area, diagonal
- Calculates: all derivable values and interior angles

#### Rectangle
- 8 different input combinations (length+width, length+area, length+perimeter, length+diagonal, etc.)
- Quadratic formula for area+perimeter case
- Diagonal validation using Pythagorean theorem

### 🚧 Pending (Future Phases)

- Parallelogram
- Rhombus
- Trapezoid
- Circle
- Regular polygons

## 🧮 Mathematical Engine Features

### Constraint-Solving Approach

The solver:
1. Inspects available constraints
2. Identifies applicable mathematical relationships
3. Solves unknown values systematically
4. Validates all supplied values
5. Explains calculations with structured steps
6. Never invents solutions when insufficient information exists

### Solution States

- **SOLVED**: Unique solution determined
- **MULTIPLE_SOLUTIONS**: Multiple valid configurations exist (e.g., ambiguous SSA case)
- **INSUFFICIENT_INFORMATION**: Cannot uniquely determine results
- **CONTRADICTORY**: Inputs cannot all be true simultaneously

### Numerical Precision

- Uses `EPSILON = 1e-10` for floating-point comparisons
- Intelligent rounding for display (3-6 significant digits)
- Full precision maintained in calculations

### Units

V1 supports: mm, cm, m, km
- Angles: degrees in UI, radians internally
- Area units properly squared (e.g., cm → cm²)

## 🧪 Testing

Comprehensive automated tests ensure mathematical correctness:

- **129 tests passing** across all implemented shapes
- Test coverage includes:
  - Valid and invalid inputs
  - Sufficient and insufficient information
  - Contradictory constraints
  - Multiple-solution cases
  - Unit conversion
  - Numerical tolerance comparisons
  - Edge cases

Run tests:
```bash
npm test
```

## 🚀 Running the Project

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## 📝 How to Add a New Shape

1. Create formula module in `src/geometry-engine/formulas/[shape].ts`
2. Create solver in `src/geometry-engine/solvers/[shape]Solver.ts`
3. Add comprehensive tests in `src/geometry-engine/solvers/__tests__/[shape]Solver.test.ts`
4. Run tests to verify correctness
5. Build to check TypeScript compilation

## 📖 How to Add a New Theorem

1. Add formula to the appropriate shape's formula module
2. Include structured calculation step output
3. Add test cases demonstrating the theorem
4. Document mathematical reasoning in `docs/MATH_ENGINE.md`

## 📚 Documentation

Additional mathematical documentation will be added in `docs/MATH_ENGINE.md` to explain the mathematical logic behind each solver for academic explanation.

## 🎓 Academic Context

This is a university Computer Science project. The mathematical solving engine is designed to be academically defensible with:

- Structured calculation steps for explanation
- Proper use of mathematical theorems
- Validation of geometric constraints
- Comprehensive test coverage
- Clean separation of concerns

## 📄 License

This project is part of a university Computer Science course project.

## 🤝 Contributing

This is currently a student project. Future contributions will follow standard open-source practices once the initial implementation is complete.
