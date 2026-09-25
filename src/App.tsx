import React, { useState } from 'react'
import { solveTriangle } from './geometry-engine/solvers/triangleSolver'
import { solveSquare } from './geometry-engine/solvers/squareSolver'
import { solveRectangle } from './geometry-engine/solvers/rectangleSolver'
import type { TriangleInput, SquareInput, RectangleInput } from './geometry-engine/core/types'

type ShapeType = 'triangle' | 'square' | 'rectangle' | null
type TabType = 'solver' | 'ai-scanner' | 'graph' | 'guide'

function App() {
  const [selectedShape, setSelectedShape] = useState<ShapeType>(null)
  const [unit, setUnit] = useState<'mm' | 'cm' | 'm' | 'km'>('cm')
  const [activeTab, setActiveTab] = useState<TabType>('solver')
  
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

  // Grid rendering for draw panel
  const renderGrid = () => {
    const gridSize = 400
    const cellSize = 20
    const lines = []

    // Vertical lines
    for (let x = 0; x <= gridSize; x += cellSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={gridSize}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      )
    }

    // Horizontal lines
    for (let y = 0; y <= gridSize; y += cellSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={gridSize}
          y2={y}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      )
    }

    return (
      <svg width={gridSize} height={gridSize} className="border border-slate-200">
        {lines}
        {renderPolygon()}
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header with tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {(['solver', 'ai-scanner', 'graph', 'guide'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm transition ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel - Variables */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-700">Variable</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['a', 'b', 'c', 'd', 'z', 'f', 'x', 'y', 'm', 't', 'Ans', 'PreAns'].map((variable) => (
                  <div key={variable} className="text-center">
                    <div className="text-xs text-slate-500 mb-1">{variable}</div>
                    <input
                      type="text"
                      className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              {/* Shape-specific inputs */}
              {selectedShape === 'triangle' && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-600 mb-2">Triangle Inputs</div>
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                        placeholder="C"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setTriangleInputs({
                      ...triangleInputs,
                      isRightTriangle: !triangleInputs.isRightTriangle
                    })}
                    className={`w-full py-1 rounded text-xs font-medium ${
                      triangleInputs.isRightTriangle ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Right Triangle: {triangleInputs.isRightTriangle ? 'ON' : 'OFF'}
                  </button>
                </div>
              )}

              {selectedShape === 'square' && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-600 mb-2">Square Inputs</div>
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                        placeholder="diagonal"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedShape === 'rectangle' && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-600 mb-2">Rectangle Inputs</div>
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
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
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                        placeholder="diagonal"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Unit selector */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 mb-2">Unit</div>
                <div className="flex gap-1">
                  {(['mm', 'cm', 'm', 'km'] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`flex-1 py-1 rounded text-xs font-medium ${
                        unit === u ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Scientific Calculator */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
              <h2 className="text-sm font-semibold text-white">Scientific Calculator</h2>
            </div>
            <div className="p-4">
              {/* Calculator display */}
              <div className="bg-slate-900 rounded-lg p-4 mb-4 border-4 border-slate-700">
                <div className="text-slate-400 text-xs mb-1">
                  {selectedShape ? selectedShape.toUpperCase() : 'SELECT SHAPE'}
                </div>
                <div className="text-green-400 text-lg font-mono h-8">
                  {result && result.status === 'SOLVED' ? '✓ SOLVED' : result?.status || ''}
                </div>
              </div>

              {/* Shape selector */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  onClick={() => setSelectedShape('triangle')}
                  className={`py-2 rounded text-xs font-medium ${
                    selectedShape === 'triangle' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  △ Triangle
                </button>
                <button
                  onClick={() => setSelectedShape('square')}
                  className={`py-2 rounded text-xs font-medium ${
                    selectedShape === 'square' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  □ Square
                </button>
                <button
                  onClick={() => setSelectedShape('rectangle')}
                  className={`py-2 rounded text-xs font-medium ${
                    selectedShape === 'rectangle' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ▢ Rectangle
                </button>
              </div>

              {/* Calculator buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
                  <button
                    key={btn}
                    className={`py-3 rounded text-sm font-medium ${
                      ['÷', '×', '-', '+', '='].includes(btn)
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleClear}
                  className="py-2 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600"
                >
                  AC
                </button>
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="py-2 bg-slate-500 text-white rounded text-xs font-medium hover:bg-slate-600"
                >
                  Steps
                </button>
                <button
                  onClick={handleSolve}
                  className="py-2 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600"
                >
                  Solve
                </button>
              </div>

              {/* Results */}
              {result && result.status === 'SOLVED' && (
                <div className="mt-4 bg-green-50 rounded p-3 border border-green-200">
                  <div className="text-xs font-semibold text-green-700 mb-2">Results</div>
                  
                  {selectedShape === 'triangle' && result.sides && result.angles && (
                    <div className="space-y-1 text-xs">
                      <div className="grid grid-cols-3 gap-1">
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">a</div>
                          <div className="font-mono">{result.sides.a?.toFixed(2)} {unit}</div>
                        </div>
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">b</div>
                          <div className="font-mono">{result.sides.b?.toFixed(2)} {unit}</div>
                        </div>
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">c</div>
                          <div className="font-mono">{result.sides.c?.toFixed(2)} {unit}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">∠A</div>
                          <div className="font-mono">{result.angles.A?.toFixed(1)}°</div>
                        </div>
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">∠B</div>
                          <div className="font-mono">{result.angles.B?.toFixed(1)}°</div>
                        </div>
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">∠C</div>
                          <div className="font-mono">{result.angles.C?.toFixed(1)}°</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">Area</div>
                          <div className="font-mono">{result.area?.toFixed(2)} {unit}²</div>
                        </div>
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">Perimeter</div>
                          <div className="font-mono">{result.perimeter?.toFixed(2)} {unit}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedShape === 'square' && (
                    <div className="space-y-1 text-xs">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">Side</div>
                          <div className="font-mono">{result.side?.toFixed(2)} {unit}</div>
                        </div>
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">Perimeter</div>
                          <div className="font-mono">{result.perimeter?.toFixed(2)} {unit}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">Area</div>
                          <div className="font-mono">{result.area?.toFixed(2)} {unit}²</div>
                        </div>
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">Diagonal</div>
                          <div className="font-mono">{result.diagonal?.toFixed(2)} {unit}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedShape === 'rectangle' && (
                    <div className="space-y-1 text-xs">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">Length</div>
                          <div className="font-mono">{result.length?.toFixed(2)} {unit}</div>
                        </div>
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">Width</div>
                          <div className="font-mono">{result.width?.toFixed(2)} {unit}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">Area</div>
                          <div className="font-mono">{result.area?.toFixed(2)} {unit}²</div>
                        </div>
                        <div className="bg-white rounded p-1 text-center">
                          <div className="text-slate-500">Perimeter</div>
                          <div className="font-mono">{result.perimeter?.toFixed(2)} {unit}</div>
                        </div>
                      </div>
                      <div className="bg-white rounded p-1 text-center">
                        <div className="text-slate-500">Diagonal</div>
                        <div className="font-mono">{result.diagonal?.toFixed(2)} {unit}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {result && result.status !== 'SOLVED' && (
                <div className="mt-4 bg-red-50 rounded p-3 border border-red-200">
                  <div className="text-xs font-semibold text-red-700">{result.status}</div>
                  {result.errors && result.errors.length > 0 && (
                    <div className="text-red-600 text-xs mt-1">
                      {result.errors.map((error: string, index: number) => (
                        <div key={index}>• {error}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Calculation Steps */}
              {showSteps && result && result.steps && result.steps.length > 0 && (
                <div className="mt-4 bg-blue-50 rounded p-3 border border-blue-200 max-h-40 overflow-y-auto">
                  <div className="text-xs font-semibold text-blue-700 mb-2">Calculation Steps</div>
                  <div className="space-y-1">
                    {result.steps.map((step: any, index: number) => (
                      <div key={index} className="bg-white rounded p-1 text-xs">
                        <div className="text-slate-600">{step.formula}</div>
                        <div className="font-mono text-slate-800">{step.substitutedFormula}</div>
                        <div className="text-green-600 font-mono">{step.result?.toFixed(4)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Draw */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-700">Draw</h2>
            </div>
            <div className="p-4 flex items-center justify-center">
              {renderGrid()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
