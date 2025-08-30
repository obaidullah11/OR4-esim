import { clsx } from 'clsx'

/**
 * Theme utility functions for consistent styling across the admin panel
 */

// Color variants for different component states
export const colorVariants = {
  primary: {
    bg: 'bg-primary',
    text: 'text-primary-foreground',
    border: 'border-primary',
    hover: 'hover:bg-primary/90',
  },
  secondary: {
    bg: 'bg-secondary',
    text: 'text-secondary-foreground',
    border: 'border-secondary',
    hover: 'hover:bg-secondary/80',
  },
  destructive: {
    bg: 'bg-destructive',
    text: 'text-destructive-foreground',
    border: 'border-destructive',
    hover: 'hover:bg-destructive/90',
  },
  success: {
    bg: 'bg-success',
    text: 'text-success-foreground',
    border: 'border-success',
    hover: 'hover:bg-success/90',
  },
  warning: {
    bg: 'bg-warning',
    text: 'text-warning-foreground',
    border: 'border-warning',
    hover: 'hover:bg-warning/90',
  },
  muted: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-muted',
    hover: 'hover:bg-muted/80',
  },
}

// Size variants for components
export const sizeVariants = {
  sm: {
    padding: 'px-3 py-1.5',
    text: 'text-xs',
    height: 'h-8',
  },
  md: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    height: 'h-10',
  },
  lg: {
    padding: 'px-6 py-3',
    text: 'text-base',
    height: 'h-12',
  },
  xl: {
    padding: 'px-8 py-4',
    text: 'text-lg',
    height: 'h-14',
  },
}

// Status colors for different states
export const statusColors = {
  active: 'text-success bg-success/10 border-success/20',
  inactive: 'text-muted-foreground bg-muted border-border',
  pending: 'text-warning bg-warning/10 border-warning/20',
  suspended: 'text-destructive bg-destructive/10 border-destructive/20',
  blocked: 'text-destructive bg-destructive/10 border-destructive/20',
  confirmed: 'text-success bg-success/10 border-success/20',
  cancelled: 'text-muted-foreground bg-muted border-border',
  delivered: 'text-primary bg-primary/10 border-primary/20',
  paid: 'text-success bg-success/10 border-success/20',
  failed: 'text-destructive bg-destructive/10 border-destructive/20',
  refunded: 'text-warning bg-warning/10 border-warning/20',
}

// Common component class combinations
export const componentClasses = {
  card: 'card',
  cardHeader: 'card-header',
  cardTitle: 'card-title',
  cardDescription: 'card-description',
  cardContent: 'card-content',
  cardFooter: 'card-footer',
  
  button: 'btn btn-md',
  buttonPrimary: 'btn btn-primary btn-md',
  buttonSecondary: 'btn btn-secondary btn-md',
  buttonOutline: 'btn btn-outline btn-md',
  buttonDestructive: 'btn btn-destructive btn-md',
  buttonSuccess: 'btn btn-success btn-md',
  buttonWarning: 'btn btn-warning btn-md',
  buttonGhost: 'btn btn-ghost btn-md',
  
  input: 'input',
  textarea: 'textarea',
  select: 'select',
  
  badge: 'badge badge-default',
  badgeSecondary: 'badge badge-secondary',
  badgeDestructive: 'badge badge-destructive',
  badgeSuccess: 'badge badge-success',
  badgeWarning: 'badge badge-warning',
  badgeOutline: 'badge badge-outline',
  
  table: 'table',
  tableHeader: 'table-header',
  tableBody: 'table-body',
  tableRow: 'table-row',
  tableHead: 'table-head',
  tableCell: 'table-cell',
  
  navLink: 'nav-link',
  navLinkActive: 'nav-link nav-link-active',
}

/**
 * Utility function to combine classes with clsx
 * @param {...string} classes - Classes to combine
 * @returns {string} Combined class string
 */
export const cn = (...classes) => clsx(classes)

/**
 * Get status color classes based on status
 * @param {string} status - Status value
 * @returns {string} Status color classes
 */
export const getStatusColor = (status) => {
  const normalizedStatus = status?.toLowerCase()
  return statusColors[normalizedStatus] || statusColors.inactive
}

/**
 * Get button variant classes
 * @param {string} variant - Button variant (primary, secondary, etc.)
 * @param {string} size - Button size (sm, md, lg, xl)
 * @returns {string} Button classes
 */
export const getButtonClasses = (variant = 'primary', size = 'md') => {
  const baseClasses = 'btn'
  const variantClass = `btn-${variant}`
  const sizeClass = `btn-${size}`
  
  return cn(baseClasses, variantClass, sizeClass)
}

/**
 * Get badge variant classes
 * @param {string} variant - Badge variant
 * @returns {string} Badge classes
 */
export const getBadgeClasses = (variant = 'default') => {
  return cn('badge', `badge-${variant}`)
}

/**
 * Theme-aware shadow classes
 */
export const shadows = {
  sm: 'shadow-sm dark:shadow-dark-soft',
  md: 'shadow-soft dark:shadow-dark-soft',
  lg: 'shadow-soft-lg dark:shadow-dark-soft-lg',
  none: 'shadow-none',
}

/**
 * Get shadow classes based on theme
 * @param {string} size - Shadow size
 * @returns {string} Shadow classes
 */
export const getShadowClasses = (size = 'md') => {
  return shadows[size] || shadows.md
}

/**
 * Responsive breakpoint utilities
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

/**
 * Common layout classes
 */
export const layouts = {
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-8 sm:py-12 lg:py-16',
  grid: 'grid gap-4 sm:gap-6 lg:gap-8',
  flex: 'flex items-center justify-between',
  flexCol: 'flex flex-col space-y-4',
  flexRow: 'flex flex-row space-x-4',
}

/**
 * Animation classes
 */
export const animations = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  bounce: 'animate-bounce-subtle',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
}

/**
 * Get animation classes
 * @param {string} animation - Animation type
 * @returns {string} Animation classes
 */
export const getAnimationClasses = (animation) => {
  return animations[animation] || ''
}

/**
 * Focus ring classes for accessibility
 */
export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

/**
 * Transition classes
 */
export const transitions = {
  all: 'transition-all duration-200',
  colors: 'transition-colors duration-200',
  transform: 'transition-transform duration-200',
  opacity: 'transition-opacity duration-200',
}

/**
 * Get transition classes
 * @param {string} type - Transition type
 * @returns {string} Transition classes
 */
export const getTransitionClasses = (type = 'all') => {
  return transitions[type] || transitions.all
}
