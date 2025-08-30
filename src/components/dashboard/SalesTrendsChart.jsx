import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { Calendar, TrendingUp } from 'lucide-react'

const SalesTrendsChart = ({ data, loading }) => {
  const { resolvedTheme } = useTheme()
  const [selectedPeriod, setSelectedPeriod] = useState('30days')
  
  // Use real data from API or fallback to sample data
  const chartData = data?.trends || [
    { name: 'Week 1', sales: 1200, orders: 450 },
    { name: 'Week 2', sales: 1900, orders: 670 },
    { name: 'Week 3', sales: 1500, orders: 520 },
    { name: 'Week 4', sales: 2200, orders: 780 },
  ]
  
  // Theme-aware colors
  const colors = {
    primary: resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb',
    secondary: resolvedTheme === 'dark' ? '#10b981' : '#059669',
    grid: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb',
    text: resolvedTheme === 'dark' ? '#d1d5db' : '#6b7280',
    background: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'
  }

  const periods = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' }
  ]

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`
          bg-card border border-border rounded-lg p-3 shadow-lg
          ${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        `}>
          <p className="text-foreground font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'sales' ? 'Sales: $' : 'Orders: '}
              {entry.value.toLocaleString()}
            </p>
          ))}
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
            <h3 className="text-lg font-semibold text-foreground">Sales Trends</h3>
            <p className="text-sm text-muted-foreground">Revenue and order trends over time</p>
          </div>
          <div className="w-20 h-6 bg-muted rounded animate-pulse"></div>
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
          <h3 className="text-lg font-semibold text-foreground">Sales Trends</h3>
          <p className="text-sm text-muted-foreground">Revenue and order trends over time</p>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-green-500">
            {data?.growthPercentage >= 0 ? '+' : ''}{data?.growthPercentage || 0}%
          </span>
        </div>
      </div>

      {/* Period Selection */}
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div className="flex space-x-1">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`
                px-3 py-1 text-xs rounded-md transition-colors
                ${selectedPeriod === period.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors.secondary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey="name" 
              stroke={colors.text}
              fontSize={12}
            />
            <YAxis 
              stroke={colors.text}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke={colors.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#salesGradient)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke={colors.secondary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#ordersGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }}></div>
          <span className="text-sm text-muted-foreground">Sales Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
          <span className="text-sm text-muted-foreground">Order Count</span>
        </div>
      </div>
    </div>
  )
}

export default SalesTrendsChart
