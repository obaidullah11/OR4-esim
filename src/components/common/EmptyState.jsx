import { Package, Users, CreditCard, FileText, Inbox } from 'lucide-react'

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = "No data available", 
  message = "There are no items to display at the moment.",
  actionButton = null 
}) => {
  return (
    <tr>
      <td colSpan="100%" className="p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-muted/30 rounded-full">
            <Icon className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-md">{message}</p>
          </div>
          {actionButton && (
            <div className="mt-4">
              {actionButton}
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

// Predefined empty states for common use cases
export const OrdersEmptyState = () => (
  <EmptyState
    icon={Package}
    title="No orders found"
    message="No orders match your current filters. Try adjusting your search criteria or create a new order."
  />
)

export const UsersEmptyState = () => (
  <EmptyState
    icon={Users}
    title="No users found"
    message="No users match your current filters. Try adjusting your search criteria."
  />
)

export const PaymentsEmptyState = () => (
  <EmptyState
    icon={CreditCard}
    title="No transactions found"
    message="No payment transactions match your current filters. Try adjusting your search criteria."
  />
)

export const ResellersEmptyState = () => (
  <EmptyState
    icon={Users}
    title="No resellers found"
    message="No resellers match your current filters. Try adjusting your search criteria."
  />
)

export const ReportsEmptyState = () => (
  <EmptyState
    icon={FileText}
    title="No reports available"
    message="No reports match your current criteria. Try adjusting your filters or date range."
  />
)

export default EmptyState
