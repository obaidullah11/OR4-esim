import { useState } from 'react'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge,
  Input,
  FormField,
  cn,
  getStatusColor
} from '../UI'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { useTheme } from '../../../context/ThemeContext'

function ThemeDemo() {
  const { theme, resolvedTheme, isLight, isDark, isSystem } = useTheme()
  const [inputValue, setInputValue] = useState('')

  const statuses = ['active', 'inactive', 'pending', 'suspended', 'confirmed', 'cancelled', 'delivered', 'paid', 'failed', 'refunded']
  const buttonVariants = ['primary', 'secondary', 'outline', 'destructive', 'success', 'warning', 'ghost']

  return (
    <div className="space-y-8 p-6">
      {/* Theme Information */}
      <Card>
        <CardHeader>
          <CardTitle>Theme System Demo</CardTitle>
          <CardDescription>
            Comprehensive dark/light theme support for the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Theme</p>
              <Badge variant="outline">{theme}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Resolved Theme</p>
              <Badge variant="outline">{resolvedTheme}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Theme Controls</p>
              <div className="flex space-x-2">
                <ThemeToggle variant="simple" />
                <ThemeToggle variant="dropdown" />
                <ThemeToggle variant="button" showLabel />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className={cn('p-2 rounded', isLight && 'bg-success/10 text-success')}>
              Light: {isLight ? 'Active' : 'Inactive'}
            </div>
            <div className={cn('p-2 rounded', isDark && 'bg-success/10 text-success')}>
              Dark: {isDark ? 'Active' : 'Inactive'}
            </div>
            <div className={cn('p-2 rounded', isSystem && 'bg-success/10 text-success')}>
              System: {isSystem ? 'Active' : 'Inactive'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>All button styles with theme support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {buttonVariants.map(variant => (
              <Button key={variant} variant={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Button Sizes</p>
            <div className="flex items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button loading>Loading</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Status Badges</CardTitle>
          <CardDescription>Status indicators with theme-aware colors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <Badge key={status} status={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            ))}
          </div>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Badge Variants</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Theme-aware form components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Text Input" required>
              <Input 
                placeholder="Enter some text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </FormField>
            
            <FormField label="Select Input">
              <select className="select">
                <option>Choose an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </FormField>
            
            <FormField label="Error State" error="This field is required">
              <Input error placeholder="Input with error..." />
            </FormField>
            
            <FormField label="Disabled Input">
              <Input disabled placeholder="Disabled input..." />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Theme-aware color system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-12 bg-primary rounded border"></div>
              <p className="text-xs">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 bg-secondary rounded border"></div>
              <p className="text-xs">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 bg-muted rounded border"></div>
              <p className="text-xs">Muted</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 bg-accent rounded border"></div>
              <p className="text-xs">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 bg-destructive rounded border"></div>
              <p className="text-xs">Destructive</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 bg-success rounded border"></div>
              <p className="text-xs">Success</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 bg-warning rounded border"></div>
              <p className="text-xs">Warning</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 bg-border rounded border"></div>
              <p className="text-xs">Border</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards with Different Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card shadow="sm">
          <CardContent className="p-4">
            <p className="text-sm">Small Shadow</p>
          </CardContent>
        </Card>
        <Card shadow="md">
          <CardContent className="p-4">
            <p className="text-sm">Medium Shadow</p>
          </CardContent>
        </Card>
        <Card shadow="lg">
          <CardContent className="p-4">
            <p className="text-sm">Large Shadow</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ThemeDemo
