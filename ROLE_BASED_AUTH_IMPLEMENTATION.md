# Role-Based Authentication Implementation

## Overview
This document outlines the complete implementation of role-based authentication in the frontend, which integrates with the existing backend role-based system.

## ✅ Backend Implementation (Already Complete)
- **User Model with Roles**: Admin, Reseller, Client, Public User
- **JWT Authentication**: Login returns user role in token payload
- **Dashboard API**: Returns role-specific data based on user role
- **Role-based Access Control**: All ViewSets filter data by user role
- **Role Properties**: `is_admin`, `is_reseller`, `is_client` properties on User model

## ✅ Frontend Implementation (Now Complete)

### 1. Role-Based Utilities (`src/utils/auth.js`)
- **USER_ROLES**: Constants for all user roles
- **Role Checking Functions**: `isAdmin()`, `isReseller()`, `isClient()`, etc.
- **Route Access Control**: `canAccessRoute()` function
- **Default Dashboard Routes**: `getDefaultDashboardRoute()` function

### 2. Custom Hooks (`src/hooks/useRole.js`)
- **useRole()**: Main hook for role-based functionality
- **useIsAdmin()**: Specific hook for admin role checking
- **useIsReseller()**: Specific hook for reseller role checking
- **useHasManagementRole()**: Hook for admin/reseller roles

### 3. Enhanced AuthContext (`src/context/AuthContext.jsx`)
- **Role Information**: Exposes user role data and helper functions
- **Role Helpers**: Built-in role checking methods
- **Integration**: Seamlessly integrates with existing auth flow

### 4. Route Protection Components
- **ProtectedRoute** (`src/components/auth/ProtectedRoute.jsx`): General route protection
- **AdminRoute**: Specific protection for admin-only routes
- **ResellerRoute**: Specific protection for reseller-only routes
- **ClientRoute**: Specific protection for client-only routes

### 5. Automatic Role-Based Redirection
- **Login Flow**: Automatically redirects users to appropriate dashboard
- **AutoRedirect Component**: Handles root route redirection based on role
- **Smart Navigation**: Prevents unauthorized access attempts

### 6. Role-Based Navigation
- **DockSidebar**: Shows/hides menu items based on user role
- **DashboardLayout**: Displays user role and information
- **Dynamic Menus**: Navigation adapts to user permissions

### 7. Protected Routes in App.jsx
- **Admin Routes**: `/dashboard`, `/resellers`, `/users`, `/orders`, etc.
- **Reseller Routes**: `/reseller-dashboard/*`
- **Test Routes**: Protected for admin users only
- **Role-Based Access**: Each route checks user role before rendering

## 🔧 How It Works

### Login Flow
1. User enters credentials on login page
2. Backend validates and returns JWT with user role
3. Frontend stores token and user data
4. User is automatically redirected to role-appropriate dashboard
5. Navigation and routes adapt to user's role

### Route Protection
1. Each protected route wraps content in role-specific components
2. Components check user authentication and role
3. Unauthorized users are redirected to appropriate dashboard
4. Loading states handle authentication checks

### Role Checking
```javascript
// Using the useRole hook
const { isAdmin, isReseller, canAccessRoute } = useRole()

// Using AuthContext directly
const { hasRole, USER_ROLES } = useAuth()
const canManageUsers = hasRole([USER_ROLES.ADMIN, USER_ROLES.RESELLER])

// Using utility functions
import { isAdmin, canAccessRoute } from '../utils/auth'
const adminAccess = isAdmin(user)
const routeAccess = canAccessRoute(user, '/dashboard')
```

## 🧪 Testing

### Test Page (`/test/role-auth`)
- **Authentication Status**: Shows current auth state
- **Role Checks**: Visual indicators for all role checks
- **Mock Login**: Test buttons for different roles
- **Route Access**: Tests access to all protected routes
- **Raw Data**: Displays user object for debugging

### Manual Testing Steps
1. Navigate to `/test/role-auth`
2. Test login with different mock roles
3. Verify role-based redirection works
4. Check route access permissions
5. Test navigation menu filtering

## 📁 File Structure
```
src/
├── utils/
│   └── auth.js                 # Role utilities and constants
├── hooks/
│   └── useRole.js             # Custom role hooks
├── context/
│   └── AuthContext.jsx        # Enhanced with role info
├── components/
│   └── auth/
│       ├── ProtectedRoute.jsx  # Route protection components
│       └── RoleBasedRoute.jsx  # Alternative route protection
├── pages/
│   ├── auth/
│   │   └── LoginPage.jsx      # Updated with role redirection
│   └── test/
│       └── RoleBasedAuthTest.jsx # Testing page
└── App.jsx                    # Updated with protected routes
```

## 🚀 Usage Examples

### Protecting a Route
```jsx
// Admin only
<AdminRoute>
  <DashboardPage />
</AdminRoute>

// Reseller only
<ResellerRoute>
  <ResellerDashboard />
</ResellerRoute>

// Multiple roles
<ProtectedRoute roles={[USER_ROLES.ADMIN, USER_ROLES.RESELLER]}>
  <ManagementPage />
</ProtectedRoute>
```

### Conditional Rendering
```jsx
function MyComponent() {
  const { isAdmin, isReseller } = useRole()
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
      {isReseller && <ResellerPanel />}
      {(isAdmin || isReseller) && <ManagementTools />}
    </div>
  )
}
```

### Navigation Menu
```jsx
function Navigation() {
  const { canAccessRoute } = useRole()
  
  return (
    <nav>
      {canAccessRoute('/dashboard') && <Link to="/dashboard">Dashboard</Link>}
      {canAccessRoute('/reseller-dashboard') && <Link to="/reseller-dashboard">Reseller</Link>}
    </nav>
  )
}
```

## 🔒 Security Notes
- All route protection is enforced on both frontend and backend
- Frontend protection is for UX only - backend enforces actual security
- JWT tokens contain role information for backend validation
- Role checks are performed on every route navigation
- Unauthorized access attempts redirect to appropriate dashboard

## ✅ Implementation Status
All role-based authentication features are now fully implemented and integrated with the existing backend system. The frontend now properly handles:

- ✅ Role-based route protection
- ✅ Automatic role-based redirection after login
- ✅ Role-aware navigation and menus
- ✅ Comprehensive role checking utilities
- ✅ Integration with existing JWT authentication
- ✅ Testing and debugging tools
