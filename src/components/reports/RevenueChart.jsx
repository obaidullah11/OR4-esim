import { useState } from 'react'

const RevenueChart = ({ data, theme }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <p>No data available</p>
      </div>
    )
  }

  const maxRevenue = Math.max(...data.map(item => item.revenue))
  const maxAppRevenue = Math.max(...data.map(item => item.appRevenue))
  const maxResellerRevenue = Math.max(...data.map(item => item.resellerRevenue))

  const getBarHeight = (value, max) => {
    return (value / max) * 180
  }

  const formatValue = (value) => {
    return `$${value.toLocaleString()}`
  }

  return (
    <div className="h-64 relative">
      {/* Chart Area */}
      <div className="h-full flex items-end justify-between space-x-2 px-4 py-4">
        {data.map((item, index) => {
          const isHovered = hoveredIndex === index
          const appHeight = getBarHeight(item.appRevenue, maxRevenue)
          const resellerHeight = getBarHeight(item.resellerRevenue, maxRevenue)
          
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
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium">{item.month}</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-xs">App Users: {formatValue(item.appRevenue)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-xs">Resellers: {formatValue(item.resellerRevenue)}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-1">
                        <span className="text-sm font-bold">Total: {formatValue(item.revenue)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                    theme === 'dark' ? 'border-t-slate-800' : 'border-t-white'
                  }`}></div>
                </div>
              )}
              
              {/* Stacked Bars */}
              <div className="w-full flex flex-col items-center space-y-1">
                {/* Reseller Revenue (Top) */}
                <div
                  className={`w-full rounded-t-lg transition-all duration-200 ${
                    isHovered
                      ? 'bg-green-500'
                      : theme === 'dark'
                        ? 'bg-green-400/70 hover:bg-green-400'
                        : 'bg-green-500/70 hover:bg-green-500'
                  }`}
                  style={{ height: `${resellerHeight}px` }}
                />
                
                {/* App Revenue (Bottom) */}
                <div
                  className={`w-full rounded-b-lg transition-all duration-200 ${
                    isHovered
                      ? 'bg-blue-500'
                      : theme === 'dark'
                        ? 'bg-blue-400/70 hover:bg-blue-400'
                        : 'bg-blue-500/70 hover:bg-blue-500'
                  }`}
                  style={{ height: `${appHeight}px` }}
                />
              </div>
              
              {/* Month Label */}
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">
                  {item.month && typeof item.month === 'string' ? item.month.split(' ')[0] : item.month || 'N/A'}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="absolute top-0 right-0 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-muted-foreground">App Users</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-muted-foreground">Resellers</span>
        </div>
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4 pr-2">
        <span className="text-xs text-muted-foreground">{formatValue(maxRevenue)}</span>
        <span className="text-xs text-muted-foreground">{formatValue(maxRevenue / 2)}</span>
        <span className="text-xs text-muted-foreground">$0</span>
      </div>

      {/* Chart Title */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <p className="text-sm font-medium text-muted-foreground">Monthly Revenue Breakdown</p>
      </div>
    </div>
  )
}

export default RevenueChart
