import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <Loader2 
      className={clsx(
        'animate-spin text-primary-600',
        sizeClasses[size],
        className
      )} 
    />
  )
}

export default LoadingSpinner
