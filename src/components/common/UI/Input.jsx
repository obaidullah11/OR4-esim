import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { componentClasses } from '../../../utils/theme'

const Input = forwardRef(({ 
  className, 
  type = 'text',
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        componentClasses.input,
        error && 'border-destructive focus-visible:ring-destructive',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

const Textarea = forwardRef(({ 
  className, 
  error = false,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        componentClasses.textarea,
        error && 'border-destructive focus-visible:ring-destructive',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

const Select = forwardRef(({ 
  className, 
  children,
  error = false,
  ...props 
}, ref) => {
  return (
    <select
      className={cn(
        componentClasses.select,
        error && 'border-destructive focus-visible:ring-destructive',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})

const Label = forwardRef(({ 
  className, 
  children,
  required = false,
  ...props 
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )
})

const FormField = ({ 
  label, 
  error, 
  required = false, 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

Input.displayName = 'Input'
Textarea.displayName = 'Textarea'
Select.displayName = 'Select'
Label.displayName = 'Label'

export { Input, Textarea, Select, Label, FormField }
