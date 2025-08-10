import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { Crown, Users, TrendingUp } from 'lucide-react'

const TopResellersChart = ({ data, loading }) => {
  const { resolvedTheme } = useTheme()
  const [chartType, setChartType] = useState('pie') // 'pie' or 'bar'
  
  // Use real data from API or fallback to sample data
  const resellersData = data?.resellers || [
    { name: 'TechCorp Ltd', sales: 45000, orders: 1250, percentage: 28.5, color: '#3b82f6' },
    { name: 'Global SIM Co', sales: 32000, orders: 890, percentage: 20.3, color: '#10b981' },
    { name: 'Mobile Solutions', sales: 28000, orders: 780, percentage: 17.7, color: '#f59e0b' },
    { name: 'ConnectPro', sales: 22000, orders: 620, percentage: 13.9, color: '#ef4444' },
    { name: 'SimMaster Inc', sales: 18000, orders: 510, percentage: 11.4, color: '#8b5cf6' },
    { name: 'Others', sales: 13000, orders: 350, percentage: 8.2, color: '#6b7280' }
  ]

  // Theme-aware colors
  const colors = {
    text: resolvedTheme === 'dark' ? '#d1d5db' : '#6b7280',
    grid: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'
  }

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`
          bg-card border border-border rounded-lg p-3 shadow-lg
          ${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        `}>
          <p className="text-foreground font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">Sales: ${data.sales.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Orders: {data.orders.toLocaleString()}</p>
          <p className="text-sm font-medium" style={{ color: data.color }}>
            {data.percentage}% of total
          </p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`
          bg-card border border-border rounded-lg p-3 shadow-lg
          ${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        `}>
          <p className="text-foreground font-medium">{label}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            Sales: ${payload[0].value.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Top Performing Resellers</h3>
            <p className="text-sm text-muted-foreground">Revenue breakdown by reseller partners</p>
          </div>
          <div className="w-16 h-6 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="h-80 bg-muted/50 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top Performing Resellers</h3>
          <p className="text-sm text-muted-foreground">Revenue breakdown by reseller partners</p>
        </div>
        <div className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium text-foreground">Top {resellersData.length}</span>
        </div>
      </div>

      {/* Chart Type Toggle */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setChartType('pie')}
            className={`
              px-3 py-1 text-xs rounded-md transition-colors
              ${chartType === 'pie'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Pie Chart
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`
              px-3 py-1 text-xs rounded-md transition-colors
              ${chartType === 'bar'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Bar Chart
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={resellersData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="sales"
              >
                {resellersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          ) : (
            <BarChart data={resellersData.slice(0, 5)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="name" 
                stroke={colors.text}
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke={colors.text}
                fontSize={12}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                {resellersData.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Reseller List */}
      <div className="mt-6 space-y-3">
        <h4 className="text-sm font-medium text-foreground mb-3">Detailed Breakdown</h4>
        {resellersData.slice(0, 5).map((reseller, index) => (
          <div key={reseller.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: reseller.color }}
                ></div>
                <span className="text-sm font-medium text-foreground">{reseller.name}</span>
              </div>
              {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-right">
                <p className="font-medium text-foreground">${reseller.sales.toLocaleString()}</p>
                <p className="text-muted-foreground">{reseller.orders} orders</p>
              </div>
              <div className="flex items-center space-x-1 text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">{reseller.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopResellersChart
