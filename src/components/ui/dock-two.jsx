import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-1, 1, -1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const DockIconButton = React.forwardRef(
  ({ icon: Icon, label, onClick, className, isActive, gradient, color }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
          "relative group p-2 rounded-lg transition-all duration-300",
          "hover:bg-secondary/80 backdrop-blur-sm",
          isActive && "bg-primary/10 shadow-md",
          className
        )}
      >
        <div className={cn(
          "relative z-10 transition-all duration-300",
          isActive && "scale-105"
        )}>
          <Icon className={cn(
            "w-5 h-5 transition-colors duration-300",
            isActive ? color : "text-muted-foreground group-hover:text-foreground"
          )} />
        </div>
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className={cn(
              "absolute inset-0 rounded-xl opacity-20",
              `bg-gradient-to-r ${gradient}`
            )}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        
        {/* Tooltip */}
        <span className={cn(
          "absolute -top-8 left-1/2 -translate-x-1/2 z-20",
          "px-2 py-1 rounded text-xs font-medium",
          "bg-popover text-popover-foreground border shadow-md",
          "opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100",
          "transition-all duration-200 whitespace-nowrap pointer-events-none"
        )}>
          {label}
        </span>
      </motion.button>
    )
  }
)
DockIconButton.displayName = "DockIconButton"

const EnhancedDock = React.forwardRef(
  ({ items, className, activeItem }, ref) => {
    return (
      <div ref={ref} className={cn("w-full flex items-center justify-center", className)}>
        <motion.div
          initial="initial"
          animate="animate"
          variants={floatingAnimation}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-xl",
            "backdrop-blur-xl border shadow-lg",
            "bg-background/90 border-border/50",
            "hover:shadow-xl transition-all duration-300",
            "hover:bg-background/95"
          )}
        >
          {items.map((item) => (
            <DockIconButton
              key={item.label}
              {...item}
              isActive={activeItem === item.href}
            />
          ))}
        </motion.div>
      </div>
    )
  }
)
EnhancedDock.displayName = "EnhancedDock"

export { EnhancedDock, DockIconButton }
