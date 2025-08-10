import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { componentClasses, getShadowClasses } from '../../../utils/theme'

const Card = forwardRef(({ className, children, shadow = 'md', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        componentClasses.card,
        getShadowClasses(shadow),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

const CardHeader = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(componentClasses.cardHeader, className)}
      {...props}
    >
      {children}
    </div>
  )
})

const CardTitle = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(componentClasses.cardTitle, className)}
      {...props}
    >
      {children}
    </h3>
  )
})

const CardDescription = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(componentClasses.cardDescription, className)}
      {...props}
    >
      {children}
    </p>
  )
})

const CardContent = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(componentClasses.cardContent, className)}
      {...props}
    >
      {children}
    </div>
  )
})

const CardFooter = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(componentClasses.cardFooter, className)}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardTitle.displayName = 'CardTitle'
CardDescription.displayName = 'CardDescription'
CardContent.displayName = 'CardContent'
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
