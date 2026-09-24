import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">GeoSolve</h1>
        <p className="text-lg text-gray-600 mb-6">Intelligent Geometry Calculator</p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-700">Geometry solver engine loaded successfully!</p>
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Count: {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
