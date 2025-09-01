import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import { 
  User, 
  Smartphone, 
  CreditCard, 
  Cog, 
  Mail, 
  Database,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react'

const WORKFLOW_STEPS = [
  {
    id: 1,
    title: 'Client Info',
    description: 'Add customer details',
    icon: User,
    color: 'blue'
  },
  {
    id: 2,
    title: 'Select Plan',
    description: 'Choose eSIM bundle',
    icon: Smartphone,
    color: 'purple'
  },
  {
    id: 3,
    title: 'Payment',
    description: 'Process transaction',
    icon: CreditCard,
    color: 'green'
  },
  {
    id: 4,
    title: 'Provision',
    description: 'Create eSIM profile',
    icon: Cog,
    color: 'orange'
  },
  {
    id: 5,
    title: 'Delivery',
    description: 'Send QR & details',
    icon: Mail,
    color: 'indigo'
  },
  {
    id: 6,
    title: 'Complete',
    description: 'Save to database',
    icon: Database,
    color: 'emerald'
  }
]

function WorkflowStepIndicator({ currentStep, completedSteps = [], errorStep = null, className }) {
  const { resolvedTheme } = useTheme()

  const getStepStatus = (stepId) => {
    if (errorStep === stepId) return 'error'
    if (completedSteps.includes(stepId)) return 'completed'
    if (stepId === currentStep) return 'active'
    if (stepId < currentStep) return 'completed'
    return 'pending'
  }

  const getStepColors = (step, status) => {
    const baseColors = {
      blue: 'from-blue-500 to-cyan-500',
      purple: 'from-purple-500 to-pink-500',
      green: 'from-green-500 to-emerald-500',
      orange: 'from-orange-500 to-red-500',
      indigo: 'from-indigo-500 to-purple-500',
      emerald: 'from-emerald-500 to-teal-500'
    }

    switch (status) {
      case 'completed':
        return {
          bg: `bg-gradient-to-br ${baseColors[step.color]}`,
          text: 'text-white',
          border: 'border-transparent',
          icon: 'text-white'
        }
      case 'active':
        return {
          bg: resolvedTheme === 'dark' 
            ? `bg-gradient-to-br ${baseColors[step.color]} animate-glow` 
            : `bg-gradient-to-br ${baseColors[step.color]} shadow-lg`,
          text: 'text-white',
          border: 'border-white/20 ring-2 ring-white/30',
          icon: 'text-white'
        }
      case 'error':
        return {
          bg: 'bg-gradient-to-br from-red-500 to-red-600',
          text: 'text-white',
          border: 'border-red-300 ring-2 ring-red-200',
          icon: 'text-white'
        }
      default:
        return {
          bg: resolvedTheme === 'dark' 
            ? 'bg-slate-700/50' 
            : 'bg-gray-100/50',
          text: 'text-muted-foreground',
          border: 'border-border',
          icon: 'text-muted-foreground'
        }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return Check
      case 'active':
        return Clock
      case 'error':
        return AlertCircle
      default:
        return null
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile Version - Vertical */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {WORKFLOW_STEPS.map((step, index) => {
            const status = getStepStatus(step.id)
            const colors = getStepColors(step, status)
            const StatusIcon = getStatusIcon(status)
            const StepIcon = step.icon

            return (
              <div
                key={step.id}
                className={cn(
                  'flex items-center space-x-4 p-4 rounded-xl transition-all duration-500',
                  status === 'active' && 'scale-105',
                  'slide-up'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Step Circle */}
                <div className={cn(
                  'relative flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-300',
                  colors.bg,
                  colors.border
                )}>
                  {StatusIcon ? (
                    <StatusIcon className={cn('w-6 h-6', colors.icon)} />
                  ) : (
                    <StepIcon className={cn('w-6 h-6', colors.icon)} />
                  )}
                  {status === 'active' && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent animate-pulse-soft"></div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h3 className={cn(
                    'font-semibold text-sm transition-colors duration-300',
                    status === 'active' ? 'text-foreground' : colors.text
                  )}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Connection Line */}
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div className="absolute left-10 top-16 w-0.5 h-8 bg-border"></div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Desktop Version - Horizontal */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {WORKFLOW_STEPS.map((step, index) => {
            const status = getStepStatus(step.id)
            const colors = getStepColors(step, status)
            const StatusIcon = getStatusIcon(status)
            const StepIcon = step.icon

            return (
              <div key={step.id} className="flex items-center">
                {/* Step */}
                <div 
                  className={cn(
                    'flex flex-col items-center space-y-3 transition-all duration-500',
                    status === 'active' && 'scale-110',
                    'slide-up'
                  )}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Step Circle */}
                  <div className={cn(
                    'relative flex items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all duration-300',
                    colors.bg,
                    colors.border
                  )}>
                    {StatusIcon ? (
                      <StatusIcon className={cn('w-8 h-8', colors.icon)} />
                    ) : (
                      <StepIcon className={cn('w-8 h-8', colors.icon)} />
                    )}
                    {status === 'active' && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent animate-pulse-soft"></div>
                    )}
                    
                    {/* Step Number Badge */}
                    <div className={cn(
                      'absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center',
                      status === 'completed' || status === 'active' 
                        ? 'bg-white text-gray-900' 
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {step.id}
                    </div>
                  </div>

                  {/* Step Label */}
                  <div className="text-center">
                    <h3 className={cn(
                      'font-semibold text-sm transition-colors duration-300',
                      status === 'active' ? 'text-foreground' : colors.text
                    )}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connection Line */}
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div className={cn(
                    'h-0.5 w-16 mx-4 transition-colors duration-500',
                    getStepStatus(step.id + 1) === 'completed' || getStepStatus(step.id + 1) === 'active'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'bg-border'
                  )}>
                    <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WorkflowStepIndicator
