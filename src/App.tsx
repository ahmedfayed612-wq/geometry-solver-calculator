import React, { useState } from 'react'
import { solveTriangle } from './geometry-engine/solvers/triangleSolver'
import { solveSquare } from './geometry-engine/solvers/squareSolver'
import { solveRectangle } from './geometry-engine/solvers/rectangleSolver'
import type { TriangleInput, SquareInput, RectangleInput } from './geometry-engine/core/types'

type ShapeType = 'triangle' | 'square' | 'rectangle' | null

function App() {
  const [selectedShape, setSelectedShape] = useState<ShapeType>(null)
  const [unit, setUnit] = useState<'mm' | 'cm' | 'm' | 'km'>('cm')
  
  // Triangle inputs
  const [triangleInputs, setTriangleInputs] = useState<TriangleInput>({
    unit: 'cm',
    sides: {},
    angles: {},
    isRightTriangle: false
  })
  
  // Square inputs
  const [squareInputs, setSquareInputs] = useState<SquareInput>({
    unit: 'cm',
    side: undefined,
    perimeter: undefined,
    area: undefined,
    diagonal: undefined
  })
  
  // Rectangle inputs
  const [rectangleInputs, setRectangleInputs] = useState<RectangleInput>({
    unit: 'cm',
    length: undefined,
    width: undefined,
    area: undefined,
    perimeter: undefined,
    diagonal: undefined
  })
  
  const [result, setResult] = useState<any>(null)
  const [showSteps, setShowSteps] = useState(false)

  const handleSolve = () => {
    if (!selectedShape) return
    
    const commonUnit = unit
    let solution

    if (selectedShape === 'triangle') {
      const input = { ...triangleInputs, unit: commonUnit }
      solution = solveTriangle(input)
    } else if (selectedShape === 'square') {
      const input = { ...squareInputs, unit: commonUnit }
      solution = solveSquare(input)
    } else if (selectedShape === 'rectangle') {
      const input = { ...rectangleInputs, unit: commonUnit }
      solution = solveRectangle(input)
    }

    setResult(solution)
    setShowSteps(false)
  }

  const handleClear = () => {
    setResult(null)
    setShowSteps(false)
    setTriangleInputs({ unit: 'cm', sides: {}, angles: {}, isRightTriangle: false })
    setSquareInputs({ unit: 'cm', side: undefined, perimeter: undefined, area: undefined, diagonal: undefined })
    setRectangleInputs({ unit: 'cm', length: undefined, width: undefined, area: undefined, perimeter: undefined, diagonal: undefined })
  }

  const CalculatorButton = ({ label, onClick, active = false, wide = false, color = 'gray' }: { 
    label: string | React.ReactNode
    onClick: () => void
    active?: boolean
    wide?: boolean
    color?: 'gray' | 'blue' | 'orange' | 'red' | 'green'
  }) => {
    const colorClasses = {
      gray: 'bg-gray-700 hover:bg-gray-600 text-white',
      blue: 'bg-blue-600 hover:bg-blue-500 text-white',
      orange: 'bg-orange-500 hover:bg-orange-400 text-white',
      red: 'bg-red-500 hover:bg-red-400 text-white',
      green: 'bg-green-600 hover:bg-green-500 text-white'
    }
    
    return (
      <button
        onClick={onClick}
        className={`
          ${colorClasses[color]}
          ${active ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}
          ${wide ? 'col-span-2' : ''}
          h-14 rounded-lg font-semibold text-lg transition-all duration-150 
          active:scale-95 shadow-lg flex items-center justify-center
        `}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-4xl border-4 border-gray-700">
        {/* Display Screen */}
        <div className="bg-gray-950 rounded-2xl p-4 mb-6 border-4 border-gray-700 shadow-inner">
          <div className="text-gray-400 text-sm mb-1">GeoSolve</div>
          <div className="text-green-400 text-2xl font-mono h-8">
            {selectedShape ? selectedShape.toUpperCase() : 'SELECT SHAPE'}
          </div>
          {result && (
            <div className="text-white text-lg mt-2 font-mono">
              {result.status === 'SOLVED' ? '✓ SOLVED' : result.status}
            </div>
          )}
        </div>

        {/* Unit Selector */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(['mm', 'cm', 'm', 'km'] as const).map((u) => (
            <CalculatorButton
              key={u}
              label={u}
              onClick={() => setUnit(u)}
              active={unit === u}
              color="gray"
            />
          ))}
        </div>

        {/* Shape Selector */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <CalculatorButton
            label="△ TRIANGLE"
            onClick={() => setSelectedShape('triangle')}
            active={selectedShape === 'triangle'}
            color="blue"
          />
          <CalculatorButton
            label="□ SQUARE"
            onClick={() => setSelectedShape('square')}
            active={selectedShape === 'square'}
            color="blue"
          />
          <CalculatorButton
            label="▢ RECTANGLE"
            onClick={() => setSelectedShape('rectangle')}
            active={selectedShape === 'rectangle'}
            color="blue"
          />
        </div>

        {/* Input Fields */}
        {selectedShape === 'triangle' && (
          <div className="bg-gray-700 rounded-xl p-4 mb-4">
            <div className="text-gray-300 text-sm mb-3">TRIANGLE INPUTS</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-gray-400 text-xs">Side a</label>
                <input
                  type="number"
                  value={triangleInputs.sides.a || ''}
                  onChange={(e) => setTriangleInputs({
                    ...triangleInputs,
                    sides: { ...triangleInputs.sides, a: e.target.value ? parseFloat(e.target.value) : undefined }
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="a"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Side b</label>
                <input
                  type="number"
                  value={triangleInputs.sides.b || ''}
                  onChange={(e) => setTriangleInputs({
                    ...triangleInputs,
                    sides: { ...triangleInputs.sides, b: e.target.value ? parseFloat(e.target.value) : undefined }
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="b"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Side c</label>
                <input
                  type="number"
                  value={triangleInputs.sides.c || ''}
                  onChange={(e) => setTriangleInputs({
                    ...triangleInputs,
                    sides: { ...triangleInputs.sides, c: e.target.value ? parseFloat(e.target.value) : undefined }
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="c"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Right Triangle</label>
                <button
                  onClick={() => setTriangleInputs({
                    ...triangleInputs,
                    isRightTriangle: !triangleInputs.isRightTriangle
                  })}
                  className={`w-full mt-1 py-2 rounded-lg font-semibold ${triangleInputs.isRightTriangle ? 'bg-green-600' : 'bg-gray-600'}`}
                >
                  {triangleInputs.isRightTriangle ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-gray-400 text-xs">∠A (°)</label>
                <input
                  type="number"
                  value={triangleInputs.angles.A || ''}
                  onChange={(e) => setTriangleInputs({
                    ...triangleInputs,
                    angles: { ...triangleInputs.angles, A: e.target.value ? parseFloat(e.target.value) : undefined }
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="A"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">∠B (°)</label>
                <input
                  type="number"
                  value={triangleInputs.angles.B || ''}
                  onChange={(e) => setTriangleInputs({
                    ...triangleInputs,
                    angles: { ...triangleInputs.angles, B: e.target.value ? parseFloat(e.target.value) : undefined }
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="B"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">∠C (°)</label>
                <input
                  type="number"
                  value={triangleInputs.angles.C || ''}
                  onChange={(e) => setTriangleInputs({
                    ...triangleInputs,
                    angles: { ...triangleInputs.angles, C: e.target.value ? parseFloat(e.target.value) : undefined }
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="C"
                />
              </div>
            </div>
          </div>
        )}

        {selectedShape === 'square' && (
          <div className="bg-gray-700 rounded-xl p-4 mb-4">
            <div className="text-gray-300 text-sm mb-3">SQUARE INPUTS</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-400 text-xs">Side</label>
                <input
                  type="number"
                  value={squareInputs.side || ''}
                  onChange={(e) => setSquareInputs({
                    ...squareInputs,
                    side: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="side"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Perimeter</label>
                <input
                  type="number"
                  value={squareInputs.perimeter || ''}
                  onChange={(e) => setSquareInputs({
                    ...squareInputs,
                    perimeter: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="perimeter"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Area</label>
                <input
                  type="number"
                  value={squareInputs.area || ''}
                  onChange={(e) => setSquareInputs({
                    ...squareInputs,
                    area: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="area"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Diagonal</label>
                <input
                  type="number"
                  value={squareInputs.diagonal || ''}
                  onChange={(e) => setSquareInputs({
                    ...squareInputs,
                    diagonal: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="diagonal"
                />
              </div>
            </div>
          </div>
        )}

        {selectedShape === 'rectangle' && (
          <div className="bg-gray-700 rounded-xl p-4 mb-4">
            <div className="text-gray-300 text-sm mb-3">RECTANGLE INPUTS</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-400 text-xs">Length</label>
                <input
                  type="number"
                  value={rectangleInputs.length || ''}
                  onChange={(e) => setRectangleInputs({
                    ...rectangleInputs,
                    length: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="length"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Width</label>
                <input
                  type="number"
                  value={rectangleInputs.width || ''}
                  onChange={(e) => setRectangleInputs({
                    ...rectangleInputs,
                    width: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="width"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Area</label>
                <input
                  type="number"
                  value={rectangleInputs.area || ''}
                  onChange={(e) => setRectangleInputs({
                    ...rectangleInputs,
                    area: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="area"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Perimeter</label>
                <input
                  type="number"
                  value={rectangleInputs.perimeter || ''}
                  onChange={(e) => setRectangleInputs({
                    ...rectangleInputs,
                    perimeter: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="perimeter"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Diagonal</label>
                <input
                  type="number"
                  value={rectangleInputs.diagonal || ''}
                  onChange={(e) => setRectangleInputs({
                    ...rectangleInputs,
                    diagonal: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="diagonal"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <CalculatorButton
            label="C"
            onClick={handleClear}
            color="red"
          />
          <CalculatorButton
            label="STEPS"
            onClick={() => setShowSteps(!showSteps)}
            color="gray"
          />
          <CalculatorButton
            label="SOLVE"
            onClick={handleSolve}
            color="green"
            wide
          />
        </div>

        {/* Results Display */}
        {result && result.status === 'SOLVED' && (
          <div className="bg-gray-700 rounded-xl p-4 mb-4 border-2 border-green-500">
            <div className="text-green-400 text-sm mb-3 font-semibold">RESULTS</div>
            
            {selectedShape === 'triangle' && result.sides && result.angles && (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Side a</div>
                    <div className="text-white font-mono">{result.sides.a?.toFixed(4)} {unit}</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Side b</div>
                    <div className="text-white font-mono">{result.sides.b?.toFixed(4)} {unit}</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Side c</div>
                    <div className="text-white font-mono">{result.sides.c?.toFixed(4)} {unit}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">∠A</div>
                    <div className="text-white font-mono">{result.angles.A?.toFixed(2)}°</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">∠B</div>
                    <div className="text-white font-mono">{result.angles.B?.toFixed(2)}°</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">∠C</div>
                    <div className="text-white font-mono">{result.angles.C?.toFixed(2)}°</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Area</div>
                    <div className="text-white font-mono">{result.area?.toFixed(4)} {unit}²</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Perimeter</div>
                    <div className="text-white font-mono">{result.perimeter?.toFixed(4)} {unit}</div>
                  </div>
                </div>
              </div>
            )}

            {selectedShape === 'square' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Side</div>
                    <div className="text-white font-mono">{result.side?.toFixed(4)} {unit}</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Perimeter</div>
                    <div className="text-white font-mono">{result.perimeter?.toFixed(4)} {unit}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Area</div>
                    <div className="text-white font-mono">{result.area?.toFixed(4)} {unit}²</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Diagonal</div>
                    <div className="text-white font-mono">{result.diagonal?.toFixed(4)} {unit}</div>
                  </div>
                </div>
              </div>
            )}

            {selectedShape === 'rectangle' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Length</div>
                    <div className="text-white font-mono">{result.length?.toFixed(4)} {unit}</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Width</div>
                    <div className="text-white font-mono">{result.width?.toFixed(4)} {unit}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Area</div>
                    <div className="text-white font-mono">{result.area?.toFixed(4)} {unit}²</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Perimeter</div>
                    <div className="text-white font-mono">{result.perimeter?.toFixed(4)} {unit}</div>
                  </div>
                </div>
                <div className="bg-gray-600 rounded-lg p-2 text-sm">
                  <div className="text-gray-400 text-xs">Diagonal</div>
                  <div className="text-white font-mono">{result.diagonal?.toFixed(4)} {unit}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculation Steps */}
        {showSteps && result && result.steps && result.steps.length > 0 && (
          <div className="bg-gray-700 rounded-xl p-4 border-2 border-blue-500">
            <div className="text-blue-400 text-sm mb-3 font-semibold">CALCULATION STEPS</div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {result.steps.map((step: any, index: number) => (
                <div key={index} className="bg-gray-600 rounded-lg p-2 text-sm">
                  <div className="text-gray-300 text-xs">{step.formula}</div>
                  <div className="text-white font-mono text-xs">{step.substitutedFormula}</div>
                  <div className="text-green-400 font-mono text-xs">{step.result?.toFixed(6)}</div>
                  <div className="text-gray-400 text-xs mt-1">{step.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {result && result.status !== 'SOLVED' && (
          <div className="bg-red-900/50 rounded-xl p-4 border-2 border-red-500">
            <div className="text-red-400 text-sm font-semibold">{result.status}</div>
            {result.errors && result.errors.length > 0 && (
              <div className="text-red-300 text-xs mt-2">
                {result.errors.map((error: string, index: number) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
