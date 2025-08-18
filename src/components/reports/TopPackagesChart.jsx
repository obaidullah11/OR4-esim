import { useState } from 'react'

const TopPackagesChart = ({ data, theme }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <p>No data available</p>
      </div>
    )
  }

  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316'  // orange
  ]

  const total = data.reduce((sum, item) => sum + item.sales, 0)
  let currentAngle = 0

  const createArcPath = (centerX, centerY, radius, startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle)
    const end = polarToCartesian(centerX, centerY, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ")
  }

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  const formatValue = (value) => {
    return value.toLocaleString()
  }

  return (
    <div className="h-64 relative flex items-center">
      {/* Pie Chart */}
      <div className="w-1/2 h-full flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.slice(0, 6).map((item, index) => {
            const percentage = (item.sales / total) * 100
            const angle = (percentage / 100) * 360
            const isHovered = hoveredIndex === index
            
            const path = createArcPath(100, 100, isHovered ? 85 : 80, currentAngle, currentAngle + angle)
            currentAngle += angle

            return (
              <path
                key={index}
                d={path}
                fill={colors[index % colors.length]}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                opacity={isHovered ? 1 : 0.8}
              />
            )
          })}
          
          {/* Center Circle */}
          <circle
            cx="100"
            cy="100"
            r="40"
            fill={theme === 'dark' ? '#1e293b' : '#ffffff'}
            stroke={theme === 'dark' ? '#334155' : '#e5e7eb'}
            strokeWidth="2"
          />
          
          {/* Center Text */}
          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="text-xs fill-current text-muted-foreground"
          >
            Total Sales
          </text>
          <text
            x="100"
            y="110"
            textAnchor="middle"
            className="text-sm font-bold fill-current text-foreground"
          >
            {formatValue(total)}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="w-1/2 h-full flex flex-col justify-center space-y-2 pl-4">
        {data.slice(0, 6).map((item, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
              hoveredIndex === index
                ? theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                : 'hover:bg-muted/50'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.sales} sales ({item.percentage}%)
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                ${item.revenue.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        
        {data.length > 6 && (
          <div className="flex items-center space-x-3 p-2 text-muted-foreground">
            <div className="w-4 h-4 rounded bg-gray-300" />
            <div className="flex-1">
              <p className="text-sm">Others</p>
              <p className="text-xs">
                {data.slice(6).reduce((sum, item) => sum + item.sales, 0)} sales
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hover Tooltip */}
      {hoveredIndex !== null && (
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg shadow-lg border border-border z-10 ${
          theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="text-center">
            <p className="text-sm font-medium">{data[hoveredIndex].name}</p>
            <p className="text-lg font-bold">{data[hoveredIndex].sales} sales</p>
            <p className="text-sm">${data[hoveredIndex].revenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{data[hoveredIndex].percentage}% of total</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TopPackagesChart
