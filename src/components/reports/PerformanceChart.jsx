import { useState } from 'react'

const PerformanceChart = ({ data, metric, theme }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <p>No data available</p>
      </div>
    )
  }

  const getMetricValue = (item) => {
    switch (metric) {
      case 'revenue': return item.revenue
      case 'orders': return item.orders
      case 'users': return item.users
      default: return item.revenue
    }
  }

  const getMetricLabel = () => {
    switch (metric) {
      case 'revenue': return 'Revenue ($)'
      case 'orders': return 'Orders'
      case 'users': return 'New Users'
      default: return 'Revenue ($)'
    }
  }

  const maxValue = Math.max(...data.map(getMetricValue))
  const minValue = Math.min(...data.map(getMetricValue))

  const getBarHeight = (value) => {
    const range = maxValue - minValue
    if (range === 0) return 50
    return ((value - minValue) / range) * 200 + 20
  }

  const formatValue = (value) => {
    if (metric === 'revenue') {
      return `$${value.toLocaleString()}`
    }
    return value.toLocaleString()
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="h-64 relative">
      {/* Chart Area */}
      <div className="h-full flex items-end justify-between space-x-1 px-4 py-4">
        {data.map((item, index) => {
          const value = getMetricValue(item)
          const height = getBarHeight(value)
          const isHovered = hoveredIndex === index
          
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className={`absolute bottom-full mb-2 px-3 py-2 rounded-lg shadow-lg border border-border z-10 ${
                  theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
                }`}>
                  <div className="text-center">
                    <p className="text-sm font-medium">{formatDate(item.date)}</p>
                    <p className="text-lg font-bold">{formatValue(value)}</p>
                    <p className="text-xs text-muted-foreground">{getMetricLabel()}</p>
                  </div>
                  {/* Arrow */}
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                    theme === 'dark' ? 'border-t-slate-800' : 'border-t-white'
                  }`}></div>
                </div>
              )}
              
              {/* Bar */}
              <div
                className={`w-full rounded-t-lg transition-all duration-200 ${
                  isHovered
                    ? 'bg-blue-500'
                    : theme === 'dark'
                      ? 'bg-blue-400/70 hover:bg-blue-400'
                      : 'bg-blue-500/70 hover:bg-blue-500'
                }`}
                style={{ height: `${height}px` }}
              />
              
              {/* Date Label */}
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground transform -rotate-45 origin-center">
                  {formatDate(item.date)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4 pr-2">
        <span className="text-xs text-muted-foreground">{formatValue(maxValue)}</span>
        <span className="text-xs text-muted-foreground">{formatValue((maxValue + minValue) / 2)}</span>
        <span className="text-xs text-muted-foreground">{formatValue(minValue)}</span>
      </div>

      {/* Chart Title */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <p className="text-sm font-medium text-muted-foreground">{getMetricLabel()} - Last 15 Days</p>
      </div>
    </div>
  )
}

export default PerformanceChart
