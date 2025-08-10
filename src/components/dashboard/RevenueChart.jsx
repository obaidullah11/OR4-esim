import { useState } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { DollarSign, TrendingUp, Target, Calendar } from 'lucide-react'

const RevenueChart = ({ data, loading }) => {
  const { resolvedTheme } = useTheme()
  const [timeframe, setTimeframe] = useState('6months')
  
  // Use real data from API or fallback to sample data
  const revenueData = data?.monthly || [
    { period: 'Jan', revenue: 35000, target: 32000, growth: 9.4, orders: 980 },
    { period: 'Feb', revenue: 42000, target: 38000, growth: 20.0, orders: 1150 },
    { period: 'Mar', revenue: 38000, target: 40000, growth: -9.5, orders: 1050 },
    { period: 'Apr', revenue: 45000, target: 42000, growth: 18.4, orders: 1250 },
    { period: 'May', revenue: 52000, target: 48000, growth: 15.6, orders: 1380 },
    { period: 'Jun', revenue: 58000, target: 52000, growth: 11.5, orders: 1520 }
  ]
  
  // Theme-aware colors
  const colors = {
    revenue: resolvedTheme === 'dark' ? '#10b981' : '#059669',
    target: resolvedTheme === 'dark' ? '#f59e0b' : '#d97706',
    growth: resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb',
    grid: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb',
    text: resolvedTheme === 'dark' ? '#d1d5db' : '#6b7280'
  }

  // Calculate summary stats
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalTarget = revenueData.reduce((sum, item) => sum + item.target, 0)
  const avgGrowth = (revenueData.reduce((sum, item) => sum + item.growth, 0) / revenueData.length).toFixed(1)
  const achievementRate = ((totalRevenue / totalTarget) * 100).toFixed(1)

  const timeframes = [
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '12months', label: '12 Months' }
  ]

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`
          bg-card border border-border rounded-lg p-4 shadow-lg
          ${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        `}>
          <p className="text-foreground font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm" style={{ color: colors.revenue }}>
              Revenue: ${data.revenue.toLocaleString()}
            </p>
            <p className="text-sm" style={{ color: colors.target }}>
              Target: ${data.target.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Orders: {data.orders.toLocaleString()}
            </p>
            <p className={`text-sm font-medium ${data.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Growth: {data.growth >= 0 ? '+' : ''}{data.growth}%
            </p>
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
            <h3 className="text-lg font-semibold text-foreground">Revenue Analytics</h3>
            <p className="text-sm text-muted-foreground">Revenue performance vs targets</p>
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
          <h3 className="text-lg font-semibold text-foreground">Revenue Analytics</h3>
          <p className="text-sm text-muted-foreground">Revenue performance vs targets</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Achievement: <span className={`font-medium ${parseFloat(achievementRate) >= 100 ? 'text-green-500' : 'text-orange-500'}`}>
                {achievementRate}%
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Timeframe Selection */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`
                px-3 py-1 text-xs rounded-md transition-colors
                ${timeframe === tf.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Total Revenue</p>
            <p className="font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Avg Growth</p>
            <p className={`font-bold ${parseFloat(avgGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {avgGrowth >= 0 ? '+' : ''}{avgGrowth}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey="period" 
              stroke={colors.text}
              fontSize={12}
            />
            <YAxis 
              stroke={colors.text}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Revenue bars */}
            <Bar 
              dataKey="revenue" 
              fill={colors.revenue}
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
            
            {/* Target line */}
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke={colors.target}
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: colors.target, strokeWidth: 2, r: 4 }}
              name="Target"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-foreground">Total Revenue</span>
          </div>
          <p className="text-xl font-bold text-foreground">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            Last {timeframe === '3months' ? '3' : timeframe === '6months' ? '6' : '12'} months
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-foreground">Target Achievement</span>
          </div>
          <p className={`text-xl font-bold ${parseFloat(achievementRate) >= 100 ? 'text-green-500' : 'text-orange-500'}`}>
            {achievementRate}%
          </p>
          <p className="text-xs text-muted-foreground">
            of ${totalTarget.toLocaleString()} target
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-foreground">Average Growth</span>
          </div>
          <p className={`text-xl font-bold ${parseFloat(avgGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {avgGrowth >= 0 ? '+' : ''}{avgGrowth}%
          </p>
          <p className="text-xs text-muted-foreground">
            month over month
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-foreground">Best Month</span>
          </div>
          <p className="text-xl font-bold text-foreground">
            ${Math.max(...revenueData.map(d => d.revenue)).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            highest monthly revenue
          </p>
        </div>
      </div>
    </div>
  )
}

export default RevenueChart
