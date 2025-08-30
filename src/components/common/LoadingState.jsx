import { RefreshCw } from 'lucide-react'

const LoadingState = ({ 
  colSpan = 8, 
  message = "Loading...",
  showSpinner = true 
}) => {
  return (
    <tr>
      <td colSpan={colSpan} className="p-8 text-center">
        <div className="flex items-center justify-center space-x-2">
          {showSpinner && (
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
          <span className="text-muted-foreground">{message}</span>
        </div>
      </td>
    </tr>
  )
}

// Predefined loading states for common use cases
export const OrdersLoadingState = () => (
  <LoadingState colSpan={8} message="Loading orders..." />
)

export const UsersLoadingState = () => (
  <LoadingState colSpan={7} message="Loading users..." />
)

export const PaymentsLoadingState = () => (
  <LoadingState colSpan={9} message="Loading transactions..." />
)

export const ResellersLoadingState = () => (
  <LoadingState colSpan={8} message="Loading resellers..." />
)

export default LoadingState
