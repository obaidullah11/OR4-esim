import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { ShoppingCart, Calendar, TrendingUp, Package } from 'lucide-react'

const MonthlyOrdersChart = ({ data, loading }) => {
  const { resolvedTheme } = useTheme()
  const [viewType, setViewType] = useState('monthly') // 'monthly' or 'daily'
  
  // Use real data from API or fallback to sample data
  const monthlyData = data?.monthly || [
    { month: 'Jan', orders: 1250, target: 1200, growth: 4.2 },
    { month: 'Feb', orders: 1380, target: 1300, growth: 10.4 },
    { month: 'Mar', orders: 1520, target: 1400, growth: 8.6 },
    { month: 'Apr', orders: 1680, target: 1500, growth: 10.5 },
    { month: 'May', orders: 1850, target: 1600, growth: 10.1 },
    { month: 'Jun', orders: 2100, target: 1700, growth: 13.5 }
  ]

  const dailyData = data?.daily || Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    orders: Math.floor(Math.random() * 100) + 50,
    target: 80
  }))

  const currentData = viewType === 'monthly' ? monthlyData : dailyData
  
  // Theme-aware colors
  const colors = {
    primary: resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb',
    secondary: resolvedTheme === 'dark' ? '#10b981' : '#059669',
    target: resolvedTheme === 'dark' ? '#f59e0b' : '#d97706',
    grid: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb',
    text: resolvedTheme === 'dark' ? '#d1d5db' : '#6b7280'
  }

  // Calculate totals
  const totalOrders = currentData.reduce((sum, item) => sum + item.orders, 0)
  const totalTarget = currentData.reduce((sum, item) => sum + item.target, 0)
  const achievementRate = ((totalOrders / totalTarget) * 100).toFixed(1)

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`
          bg-card border border-border rounded-lg p-3 shadow-lg
          ${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        `}>
          <p className="text-foreground font-medium">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {entry.dataKey === 'orders' ? 'Orders: ' : 'Target: '}
                {entry.value.toLocaleString()}
              </p>
            ))}
            {data.growth && (
              <p className={`text-sm font-medium ${data.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                Growth: {data.growth >= 0 ? '+' : ''}{data.growth}%
              </p>
            )}
          </div>
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
            <h3 className="text-lg font-semibold text-foreground">SIM Orders Overview</h3>
            <p className="text-sm text-muted-foreground">Order volume and target achievement</p>
          </div>
          <div className="w-32 h-6 bg-muted rounded animate-pulse"></div>
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
          <h3 className="text-lg font-semibold text-foreground">SIM Orders Overview</h3>
          <p className="text-sm text-muted-foreground">Order volume and target achievement</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Achievement: <span className={`font-medium ${parseFloat(achievementRate) >= 100 ? 'text-green-500' : 'text-orange-500'}`}>
                {achievementRate}%
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* View Type Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewType('monthly')}
            className={`
              px-3 py-1 text-xs rounded-md transition-colors
              ${viewType === 'monthly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Monthly View
          </button>
          <button
            onClick={() => setViewType('daily')}
            className={`
              px-3 py-1 text-xs rounded-md transition-colors
              ${viewType === 'daily'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Daily View (30d)
          </button>
        </div>

        {/* Summary Stats */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Total Orders</p>
            <p className="font-bold text-foreground">{totalOrders.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Target</p>
            <p className="font-bold text-foreground">{totalTarget.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey={viewType === 'monthly' ? 'month' : 'day'}
              stroke={colors.text}
              fontSize={12}
            />
            <YAxis 
              stroke={colors.text}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="orders" 
              fill={colors.primary}
              radius={[4, 4, 0, 0]}
              name="Orders"
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke={colors.target}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Target"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Indicators */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ShoppingCart className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-foreground">Average Daily Orders</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {Math.round(totalOrders / currentData.length).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {viewType === 'monthly' ? 'per month' : 'per day'}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-foreground">Best Performance</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {Math.max(...currentData.map(d => d.orders)).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            highest {viewType === 'monthly' ? 'monthly' : 'daily'} orders
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-foreground">Target Achievement</span>
          </div>
          <p className={`text-2xl font-bold ${parseFloat(achievementRate) >= 100 ? 'text-green-500' : 'text-orange-500'}`}>
            {achievementRate}%
          </p>
          <p className="text-xs text-muted-foreground">
            of target reached
          </p>
        </div>
      </div>
    </div>
  )
}

export default MonthlyOrdersChart
