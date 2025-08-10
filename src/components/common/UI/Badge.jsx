import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { getBadgeClasses, getStatusColor } from '../../../utils/theme'

const Badge = forwardRef(({ 
  className, 
  variant = 'default', 
  status = null,
  children, 
  ...props 
}, ref) => {
  // If status is provided, use status colors instead of variant
  const badgeClasses = status 
    ? cn('badge border', getStatusColor(status))
    : getBadgeClasses(variant)

  return (
    <div
      ref={ref}
      className={cn(badgeClasses, className)}
      {...props}
    >
      {children}
    </div>
  )
})

Badge.displayName = 'Badge'

export default Badge
