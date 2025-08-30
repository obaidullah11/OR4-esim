import { useState } from 'react'

const UserGrowthChart = ({ data, theme }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <p>No data available</p>
      </div>
    )
  }

  // Handle different data structures
  const safeData = data.map(item => ({
    month: item.month || 'Unknown',
    total: item.users || item.total || 0,
    active: item.users || item.active || 0,
    new: item.growth || item.new || 0
  }))

  const maxTotal = Math.max(...safeData.map(item => item.total), 1)
  const maxActive = Math.max(...safeData.map(item => item.active), 1)

  const getLinePoints = (values, max) => {
    const width = 100 // percentage
    const height = 180 // pixels
    
    return values.map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width
      const y = height - ((value / max) * height)
      return `${x},${y}`
    }).join(' ')
  }

  const totalPoints = getLinePoints(safeData.map(item => item.total), maxTotal)
  const activePoints = getLinePoints(safeData.map(item => item.active), maxTotal)

  const formatValue = (value) => {
    return value.toLocaleString()
  }

  return (
    <div className="h-64 relative">
      {/* SVG Chart */}
      <svg className="w-full h-full" viewBox="0 0 100 180" preserveAspectRatio="none">
        {/* Grid Lines */}
        <defs>
          <pattern id="grid" width="10" height="20" patternUnits="userSpaceOnUse">
            <path 
              d="M 10 0 L 0 0 0 20" 
              fill="none" 
              stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100" height="180" fill="url(#grid)" />

        {/* Total Users Line */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={totalPoints}
          className="drop-shadow-sm"
        />

        {/* Active Users Line */}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          points={activePoints}
          className="drop-shadow-sm"
        />

        {/* Data Points */}
        {safeData.map((item, index) => {
          const x = (index / Math.max(safeData.length - 1, 1)) * 100
          const totalY = 180 - ((item.total / maxTotal) * 180)
          const activeY = 180 - ((item.active / maxTotal) * 180)
          const isHovered = hoveredIndex === index

          return (
            <g key={index}>
              {/* Total Users Point */}
              <circle
                cx={x}
                cy={totalY}
                r={isHovered ? "3" : "2"}
                fill="#3b82f6"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              
              {/* Active Users Point */}
              <circle
                cx={x}
                cy={activeY}
                r={isHovered ? "3" : "2"}
                fill="#10b981"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />

              {/* Hover Area */}
              <rect
                x={x - 5}
                y="0"
                width="10"
                height="180"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          )
        })}
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg shadow-lg border border-border z-10 ${
          theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">{safeData[hoveredIndex].month}</p>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs">Total: {formatValue(safeData[hoveredIndex].total)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs">Active: {formatValue(safeData[hoveredIndex].active)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-xs">New: {formatValue(safeData[hoveredIndex].new)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-muted-foreground">Total Users</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-muted-foreground">Active Users</span>
        </div>
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4 pr-2">
        <span className="text-xs text-muted-foreground">{formatValue(maxTotal)}</span>
        <span className="text-xs text-muted-foreground">{formatValue(maxTotal / 2)}</span>
        <span className="text-xs text-muted-foreground">0</span>
      </div>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 w-full flex justify-between px-4 pb-2">
        {safeData.map((item, index) => (
          <span key={index} className="text-xs text-muted-foreground">
            {item.month && typeof item.month === 'string' ? item.month.split(' ')[0] : item.month}
          </span>
        ))}
      </div>
    </div>
  )
}

export default UserGrowthChart
