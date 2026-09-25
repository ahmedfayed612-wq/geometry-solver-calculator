import React, { useState } from 'react'
import { solveTriangle } from './geometry-engine/solvers/triangleSolver'
import { solveSquare } from './geometry-engine/solvers/squareSolver'
import { solveRectangle } from './geometry-engine/solvers/rectangleSolver'
import type { TriangleInput, SquareInput, RectangleInput } from './geometry-engine/core/types'

type ShapeType = 'triangle' | 'square' | 'rectangle' | null

function App() {
  const [selectedShape, setSelectedShape] = useState<ShapeType>(null)
  const [unit, setUnit] = useState<'mm' | 'cm' | 'm' | 'km'>('cm')
  const [activeTab, setActiveTab] = useState<'solver' | 'draw'>('solver')
  
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

  // SVG Polygon Rendering
  const renderPolygon = () => {
    if (!selectedShape || !result || result.status !== 'SOLVED') return null

    const size = 300
    const padding = 40

    if (selectedShape === 'triangle' && result.sides) {
      const { a, b, c } = result.sides
      if (!a || !b || !c) return null

      // Calculate triangle coordinates using side lengths
      const scale = (size - padding * 2) / Math.max(a, b, c)
      const A = { x: size / 2, y: padding }
      const B = { x: padding, y: size - padding }
      const C = { x: size - padding, y: size - padding }

      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <polygon
            points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <text x={A.x} y={A.y - 10} textAnchor="middle" fill="#3b82f6" fontSize="14">A</text>
          <text x={B.x - 15} y={B.y + 20} textAnchor="middle" fill="#3b82f6" fontSize="14">B</text>
          <text x={C.x + 15} y={C.y + 20} textAnchor="middle" fill="#3b82f6" fontSize="14">C</text>
          <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2} textAnchor="middle" fill="#1e293b" fontSize="12">c</text>
          <text x={(B.x + C.x) / 2} y={B.y + 15} textAnchor="middle" fill="#1e293b" fontSize="12">a</text>
          <text x={(C.x + A.x) / 2} y={(A.y + C.y) / 2} textAnchor="middle" fill="#1e293b" fontSize="12">b</text>
        </svg>
      )
    }

    if (selectedShape === 'square' && result.side) {
      const side = result.side
      const scale = (size - padding * 2) / side
      const squareSize = side * scale
      const offset = (size - squareSize) / 2

      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect
            x={offset}
            y={offset}
            width={squareSize}
            height={squareSize}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <text x={offset} y={offset - 10} fill="#3b82f6" fontSize="14">A</text>
          <text x={offset + squareSize} y={offset - 10} textAnchor="end" fill="#3b82f6" fontSize="14">B</text>
          <text x={offset + squareSize} y={offset + squareSize + 20} textAnchor="end" fill="#3b82f6" fontSize="14">C</text>
          <text x={offset} y={offset + squareSize + 20} fill="#3b82f6" fontSize="14">D</text>
          <text x={offset + squareSize / 2} y={offset - 10} textAnchor="middle" fill="#1e293b" fontSize="12">side</text>
        </svg>
      )
    }

    if (selectedShape === 'rectangle' && result.length && result.width) {
      const length = result.length
      const width = result.width
      const maxLength = Math.max(length, width)
      const scale = (size - padding * 2) / maxLength
      const rectWidth = length * scale
      const rectHeight = width * scale
      const offsetX = (size - rectWidth) / 2
      const offsetY = (size - rectHeight) / 2

      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect
            x={offsetX}
            y={offsetY}
            width={rectWidth}
            height={rectHeight}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <text x={offsetX} y={offsetY - 10} fill="#3b82f6" fontSize="14">A</text>
          <text x={offsetX + rectWidth} y={offsetY - 10} textAnchor="end" fill="#3b82f6" fontSize="14">B</text>
          <text x={offsetX + rectWidth} y={offsetY + rectHeight + 20} textAnchor="end" fill="#3b82f6" fontSize="14">C</text>
          <text x={offsetX} y={offsetY + rectHeight + 20} fill="#3b82f6" fontSize="14">D</text>
          <text x={offsetX + rectWidth / 2} y={offsetY - 10} textAnchor="middle" fill="#1e293b" fontSize="12">length</text>
          <text x={offsetX - 10} y={offsetY + rectHeight / 2} textAnchor="middle" fill="#1e293b" fontSize="12">width</text>
        </svg>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">GeoSolve</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('solver')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'solver' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Solver
              </button>
              <button
                onClick={() => setActiveTab('draw')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'draw' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Draw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel - Variables */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Variables</h2>
            <div className="space-y-2">
              {selectedShape === 'triangle' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-500">Side a</label>
                      <input
                        type="number"
                        value={triangleInputs.sides.a || ''}
                        onChange={(e) => setTriangleInputs({
                          ...triangleInputs,
                          sides: { ...triangleInputs.sides, a: e.target.value ? parseFloat(e.target.value) : undefined }
                        })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="a"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Side b</label>
                      <input
                        type="number"
                        value={triangleInputs.sides.b || ''}
                        onChange={(e) => setTriangleInputs({
                          ...triangleInputs,
                          sides: { ...triangleInputs.sides, b: e.target.value ? parseFloat(e.target.value) : undefined }
                        })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="b"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Side c</label>
                      <input
                        type="number"
                        value={triangleInputs.sides.c || ''}
                        onChange={(e) => setTriangleInputs({
                          ...triangleInputs,
                          sides: { ...triangleInputs.sides, c: e.target.value ? parseFloat(e.target.value) : undefined }
                        })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="c"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">∠A (°)</label>
                      <input
                        type="number"
                        value={triangleInputs.angles.A || ''}
                        onChange={(e) => setTriangleInputs({
                          ...triangleInputs,
                          angles: { ...triangleInputs.angles, A: e.target.value ? parseFloat(e.target.value) : undefined }
                        })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="A"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">∠B (°)</label>
                      <input
                        type="number"
                        value={triangleInputs.angles.B || ''}
                        onChange={(e) => setTriangleInputs({
                          ...triangleInputs,
                          angles: { ...triangleInputs.angles, B: e.target.value ? parseFloat(e.target.value) : undefined }
                        })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="B"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">∠C (°)</label>
                      <input
                        type="number"
                        value={triangleInputs.angles.C || ''}
                        onChange={(e) => setTriangleInputs({
                          ...triangleInputs,
                          angles: { ...triangleInputs.angles, C: e.target.value ? parseFloat(e.target.value) : undefined }
                        })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="C"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setTriangleInputs({
                      ...triangleInputs,
                      isRightTriangle: !triangleInputs.isRightTriangle
                    })}
                    className={`w-full py-2 rounded-lg text-sm font-medium ${
                      triangleInputs.isRightTriangle ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Right Triangle: {triangleInputs.isRightTriangle ? 'ON' : 'OFF'}
                  </button>
                </>
              )}

              {selectedShape === 'square' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Side</label>
                    <input
                      type="number"
                      value={squareInputs.side || ''}
                      onChange={(e) => setSquareInputs({
                        ...squareInputs,
                        side: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="side"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Perimeter</label>
                    <input
                      type="number"
                      value={squareInputs.perimeter || ''}
                      onChange={(e) => setSquareInputs({
                        ...squareInputs,
                        perimeter: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="perimeter"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Area</label>
                    <input
                      type="number"
                      value={squareInputs.area || ''}
                      onChange={(e) => setSquareInputs({
                        ...squareInputs,
                        area: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="area"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Diagonal</label>
                    <input
                      type="number"
                      value={squareInputs.diagonal || ''}
                      onChange={(e) => setSquareInputs({
                        ...squareInputs,
                        diagonal: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="diagonal"
                    />
                  </div>
                </div>
              )}

              {selectedShape === 'rectangle' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Length</label>
                    <input
                      type="number"
                      value={rectangleInputs.length || ''}
                      onChange={(e) => setRectangleInputs({
                        ...rectangleInputs,
                        length: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="length"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Width</label>
                    <input
                      type="number"
                      value={rectangleInputs.width || ''}
                      onChange={(e) => setRectangleInputs({
                        ...rectangleInputs,
                        width: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="width"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Area</label>
                    <input
                      type="number"
                      value={rectangleInputs.area || ''}
                      onChange={(e) => setRectangleInputs({
                        ...rectangleInputs,
                        area: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="area"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Perimeter</label>
                    <input
                      type="number"
                      value={rectangleInputs.perimeter || ''}
                      onChange={(e) => setRectangleInputs({
                        ...rectangleInputs,
                        perimeter: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="perimeter"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-500">Diagonal</label>
                    <input
                      type="number"
                      value={rectangleInputs.diagonal || ''}
                      onChange={(e) => setRectangleInputs({
                        ...rectangleInputs,
                        diagonal: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="diagonal"
                    />
                  </div>
                </div>
              )}

              {!selectedShape && (
                <div className="text-center text-slate-400 py-8">
                  Select a shape to input variables
                </div>
              )}
            </div>

            {/* Unit Selector */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <label className="text-xs text-slate-500">Unit</label>
              <div className="flex gap-2 mt-2">
                {(['mm', 'cm', 'm', 'km'] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      unit === u ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Calculator */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Calculator</h2>
            
            {/* Shape Selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setSelectedShape('triangle')}
                className={`py-3 rounded-lg font-medium transition ${
                  selectedShape === 'triangle' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                △ Triangle
              </button>
              <button
                onClick={() => setSelectedShape('square')}
                className={`py-3 rounded-lg font-medium transition ${
                  selectedShape === 'square' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                □ Square
              </button>
              <button
                onClick={() => setSelectedShape('rectangle')}
                className={`py-3 rounded-lg font-medium transition ${
                  selectedShape === 'rectangle' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ▢ Rectangle
              </button>
            </div>

            {/* Display */}
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <div className="text-slate-400 text-sm mb-1">
                {selectedShape ? selectedShape.toUpperCase() : 'SELECT SHAPE'}
              </div>
              {result && (
                <div className="text-green-400 text-xl font-mono">
                  {result.status === 'SOLVED' ? '✓ SOLVED' : result.status}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleClear}
                className="py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
              >
                Clear
              </button>
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="py-3 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600 transition"
              >
                Steps
              </button>
              <button
                onClick={handleSolve}
                className="col-span-2 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
              >
                Solve
              </button>
            </div>

            {/* Results */}
            {result && result.status === 'SOLVED' && (
              <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="text-sm font-semibold text-green-700 mb-3">Results</h3>
                
                {selectedShape === 'triangle' && result.sides && result.angles && (
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Side a</div>
                        <div className="font-mono">{result.sides.a?.toFixed(3)} {unit}</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Side b</div>
                        <div className="font-mono">{result.sides.b?.toFixed(3)} {unit}</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Side c</div>
                        <div className="font-mono">{result.sides.c?.toFixed(3)} {unit}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">∠A</div>
                        <div className="font-mono">{result.angles.A?.toFixed(1)}°</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">∠B</div>
                        <div className="font-mono">{result.angles.B?.toFixed(1)}°</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">∠C</div>
                        <div className="font-mono">{result.angles.C?.toFixed(1)}°</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Area</div>
                        <div className="font-mono">{result.area?.toFixed(3)} {unit}²</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Perimeter</div>
                        <div className="font-mono">{result.perimeter?.toFixed(3)} {unit}</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedShape === 'square' && (
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Side</div>
                        <div className="font-mono">{result.side?.toFixed(3)} {unit}</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Perimeter</div>
                        <div className="font-mono">{result.perimeter?.toFixed(3)} {unit}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Area</div>
                        <div className="font-mono">{result.area?.toFixed(3)} {unit}²</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Diagonal</div>
                        <div className="font-mono">{result.diagonal?.toFixed(3)} {unit}</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedShape === 'rectangle' && (
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Length</div>
                        <div className="font-mono">{result.length?.toFixed(3)} {unit}</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Width</div>
                        <div className="font-mono">{result.width?.toFixed(3)} {unit}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Area</div>
                        <div className="font-mono">{result.area?.toFixed(3)} {unit}²</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-slate-500 text-xs">Perimeter</div>
                        <div className="font-mono">{result.perimeter?.toFixed(3)} {unit}</div>
                      </div>
                    </div>
                    <div className="bg-white rounded p-2 text-center">
                      <div className="text-slate-500 text-xs">Diagonal</div>
                      <div className="font-mono">{result.diagonal?.toFixed(3)} {unit}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {result && result.status !== 'SOLVED' && (
              <div className="mt-4 bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="text-sm font-semibold text-red-700">{result.status}</div>
                {result.errors && result.errors.length > 0 && (
                  <div className="text-red-600 text-xs mt-2">
                    {result.errors.map((error: string, index: number) => (
                      <div key={index}>• {error}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Calculation Steps */}
            {showSteps && result && result.steps && result.steps.length > 0 && (
              <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200 max-h-60 overflow-y-auto">
                <h3 className="text-sm font-semibold text-blue-700 mb-3">Calculation Steps</h3>
                <div className="space-y-2">
                  {result.steps.map((step: any, index: number) => (
                    <div key={index} className="bg-white rounded p-2 text-xs">
                      <div className="text-slate-600">{step.formula}</div>
                      <div className="font-mono text-slate-800">{step.substitutedFormula}</div>
                      <div className="text-green-600 font-mono">{step.result?.toFixed(6)}</div>
                      <div className="text-slate-500 mt-1">{step.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Draw */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Draw</h2>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center justify-center min-h-[400px]">
              {renderPolygon() || (
                <div className="text-center text-slate-400">
                  <div className="text-4xl mb-2">📐</div>
                  <div className="text-sm">Solve a shape to see it here</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
