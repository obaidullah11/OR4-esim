# OR4 eSIM Management System - Frontend

A modern, responsive React-based admin panel and reseller dashboard for managing eSIM services, built with cutting-edge technologies and featuring role-based access control, real-time updates, and comprehensive analytics.

## 🚀 Features

### Core Functionality
- **Multi-Role Dashboard**: Separate interfaces for Admin and Reseller roles
- **Real-time Updates**: Live order status tracking and notifications
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: System-wide theme switching with persistence
- **Advanced Authentication**: JWT-based auth with OTP verification
- **Data Visualization**: Interactive charts and analytics dashboards

### Admin Panel Features
- **User Management**: Complete CRUD operations for users and resellers
- **Order Management**: Track, update, and manage all orders
- **Analytics Dashboard**: Revenue charts, sales trends, and performance metrics
- **Payment Processing**: Transaction management and refund handling
- **Settings Management**: System configuration and profile management
- **Reporting**: Comprehensive reports with export functionality

### Reseller Dashboard Features
- **Client Management**: Add, edit, and manage client accounts
- **eSIM Assignment**: Assign and track eSIM services for clients
- **Order History**: View and manage order history
- **Profile Settings**: Update profile and change passwords
- **Real-time Status**: Live updates on eSIM activation and order status

## 🏗️ Project Structure

```
OR4-eSim-frontend/
├── public/                   # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Shared UI components
│   │   │   ├── UI/         # Base UI components (Button, Input, etc.)
│   │   │   ├── Layout/     # Layout components
│   │   │   ├── Header/     # Header component
│   │   │   └── Sidebar/    # Navigation components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── orders/         # Order management components
│   │   ├── resellers/      # Reseller management components
│   │   ├── clients/        # Client management components
│   │   ├── reports/        # Reporting components
│   │   └── transactions/   # Payment components
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── orders/         # Order management pages
│   │   ├── resellers/      # Reseller pages
│   │   ├── settings/       # Settings pages
│   │   └── resellers_dashboard/ # Reseller-specific pages
│   ├── services/           # API service layer
│   │   ├── apiService.js   # Base API client
│   │   ├── authService.js  # Authentication services
│   │   ├── orderService.js # Order management
│   │   └── ...             # Other service modules
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx # Authentication state
│   │   └── ThemeContext.jsx # Theme management
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── data/               # Static data (countries, etc.)
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration
```

## 🛠️ Technology Stack

### Core Framework
- **React 18.2.0**: Modern React with hooks and concurrent features
- **Vite 5.0.0**: Fast build tool and development server
- **React Router DOM 6.20.1**: Client-side routing

### UI & Styling
- **Tailwind CSS 3.3.6**: Utility-first CSS framework
- **Framer Motion 10.16.16**: Animation library
- **Lucide React 0.294.0**: Modern icon library
- **React Hot Toast 2.4.1**: Toast notifications

### Data Visualization
- **Recharts 2.15.4**: Chart library for React
- **Reaviz 16.0.6**: Advanced data visualization
- **@visx/***: Low-level visualization components

### Development Tools
- **ESLint**: Code linting
- **Autoprefixer**: CSS vendor prefixes
- **PostCSS**: CSS processing

### State Management
- **React Context API**: Global state management
- **React Hook Form 7.48.2**: Form handling and validation

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API server running (see backend README)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd OR4-eSim-frontend

# Install dependencies
npm install
# or
yarn install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_BASE_URL=https://or4esim.duckdns.org/api/v1
VITE_API_TIMEOUT=30000

# Application Settings
VITE_APP_NAME=OR4 eSIM Management
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_REAL_TIME=true
```

### 3. Start Development Server

```bash
# Start development server
npm run dev
# or
yarn dev

# Open browser to http://localhost:3000
```

### 4. Build for Production

```bash
# Build for production
npm run build
# or
yarn build

# Preview production build
npm run preview
# or
yarn preview
```

## 🎨 UI Components

### Base Components

#### Button Component
```jsx
import { Button } from './components/common/UI'

<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

#### Input Component
```jsx
import { Input, FormField } from './components/common/UI'

<FormField label="Email" error={errors.email}>
  <Input
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={setEmail}
  />
</FormField>
```

#### Card Component
```jsx
import { Card } from './components/common/UI'

<Card className="p-6">
  <Card.Header>
    <Card.Title>Dashboard</Card.Title>
  </Card.Header>
  <Card.Content>
    Content goes here
  </Card.Content>
</Card>
```

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login**: JWT token-based authentication
2. **Role Detection**: Automatic role-based routing
3. **Protected Routes**: Route-level access control
4. **Token Management**: Automatic token refresh

### Usage Example

```jsx
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { user, isAuthenticated } = useAuth()

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
}
```

## 🎯 State Management

### Authentication Context

```jsx
import { useAuth } from './context/AuthContext'

function Component() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    updateProfile 
  } = useAuth()

  // Use authentication state
}
```

### Theme Context

```jsx
import { useTheme } from './context/ThemeContext'

function Component() {
  const { 
    theme, 
    resolvedTheme, 
    setTheme, 
    toggleTheme 
  } = useTheme()

  // Use theme state
}
```

## 📊 Data Visualization

### Chart Components

```jsx
import { RevenueChart } from './components/dashboard/RevenueChart'
import { SalesTrendsChart } from './components/dashboard/SalesTrendsChart'

<RevenueChart data={revenueData} />
<SalesTrendsChart data={salesData} />
```

## 🔧 API Integration

### Service Layer Architecture

```jsx
// services/apiService.js - Base API client
import apiService from './services/apiService'

// Automatic token handling, error management, and request/response interceptors

// services/orderService.js - Specific service
export const orderService = {
  getOrders: (params) => apiService.get('/orders/', { params }),
  createOrder: (data) => apiService.post('/orders/', data),
  updateOrder: (id, data) => apiService.put(`/orders/${id}/`, data),
}
```

## 🎨 Styling & Theming

### Tailwind CSS Classes

```jsx
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Dark mode support
<div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
```

## 🚀 Deployment

### Build Configuration

```bash
# Build for production
npm run build

# Output will be in 'dist/' directory
```

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://or4esim.duckdns.org/api/v1
VITE_APP_NAME=OR4 eSIM Management
VITE_ENABLE_ANALYTICS=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

### Coding Standards

- Use functional components with hooks
- Follow the established folder structure
- Write descriptive commit messages
- Add comments for complex logic
- Ensure responsive design compatibility

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- Check the component documentation in `/src/components/`
- Review the service layer in `/src/services/`
- Contact the development team

---

**Note**: This frontend application requires the backend API to be running. Please refer to the backend README for setup instructions.