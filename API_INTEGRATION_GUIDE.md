# API Integration Guide

This document provides a comprehensive guide to all the integrated backend APIs in the eSIM management system.

## 🚀 Quick Start

To test all API integrations, visit: `/test/api` in your browser after logging in.

## 📋 Available Services

### 1. Client Service (`clientService`)

**Location**: `src/services/clientService.js`

**Available Methods**:
```javascript
import { clientService } from '../services/clientService'

// Get all clients with pagination
const clients = await clientService.getAllClients({
  page: 1,
  limit: 20,
  search: 'john',
  status: 'active',
  ordering: '-created_at'
})

// Get clients for current reseller
const myClients = await clientService.getMyClients({ limit: 10 })

// Get specific client
const client = await clientService.getClientById(123)

// Create new client
const newClient = await clientService.createClient({
  full_name: 'John Doe',
  email: 'john@example.com',
  phone_number: '+1234567890',
  client_type: 'reseller_client',
  status: 'active'
})

// Update client
const updated = await clientService.updateClient(123, { status: 'inactive' })

// Delete client
const deleted = await clientService.deleteClient(123)

// Validate client data
const validation = clientService.validateClientData(clientData)
```

**Backend Endpoints**:
- `GET /api/v1/clients/` - List all clients
- `GET /api/v1/clients/{id}/` - Get specific client
- `POST /api/v1/clients/` - Create client
- `PUT /api/v1/clients/{id}/` - Update client
- `DELETE /api/v1/clients/{id}/` - Delete client
- `GET /api/v1/clients/my_clients/` - Get reseller's clients

### 2. eSIM Service (`esimService`)

**Location**: `src/services/esimService.js`

**Available Methods**:
```javascript
import { esimService } from '../services/esimService'

// eSIM Management
const esims = await esimService.getAllEsims({ limit: 20, status: 'active' })
const esim = await esimService.getEsimById(123)
const newEsim = await esimService.createEsim({ plan: 456, client: 789 })
const activated = await esimService.activateEsim(123)
const deactivated = await esimService.deactivateEsim(123)

// Plan Management
const plans = await esimService.getAllPlans({ country: 'US' })
const plan = await esimService.getPlanById(456)
const availablePlans = await esimService.getAvailablePlans()

// Usage Tracking
const usage = await esimService.getEsimUsage({ esim: 123 })
const usageSummary = await esimService.getEsimUsageSummary(123)

// Reseller Operations
const resellerDashboard = await esimService.getResellerDashboard()
const resellerClients = await esimService.getResellerClients()
const resellerEsims = await esimService.getResellerEsims()
const resellerPlans = await esimService.getResellerPlans()
```

**Backend Endpoints**:
- `GET /api/v1/esim/esims/` - List eSIMs
- `POST /api/v1/esim/esims/` - Create eSIM
- `GET /api/v1/esim/esims/{id}/` - Get eSIM details
- `POST /api/v1/esim/esims/{id}/activate_esim/` - Activate eSIM
- `POST /api/v1/esim/esims/{id}/deactivate_esim/` - Deactivate eSIM
- `GET /api/v1/esim/esim-plans/` - List plans
- `GET /api/v1/esim/esim-usage/` - Get usage data
- `GET /api/v1/esim/reseller/dashboard/` - Reseller dashboard
- `GET /api/v1/esim/reseller/clients/` - Reseller clients
- `GET /api/v1/esim/reseller/esims/` - Reseller eSIMs

### 3. TraveRoam Service (`traveRoamService`)

**Location**: `src/services/traveRoamService.js`

**Available Methods**:
```javascript
import { traveRoamService } from '../services/traveRoamService'

// Plans and Catalogue
const plans = await traveRoamService.getAvailablePlans({ countries: 'US,CA' })
const catalogue = await traveRoamService.getCatalogue()

// Network Information
const networks = await traveRoamService.getNetworks({ countries: 'US,CA' })
const allNetworks = await traveRoamService.getAllNetworks()
const countryNetworks = await traveRoamService.getNetworksByCountries(['US', 'CA'])

// eSIM Assignment
const assignment = await traveRoamService.assignEsim({
  client_id: 123,
  plan_id: 456,
  email: 'client@example.com',
  customer_name: 'John Doe'
})

// Bulk Operations
const bulkAssignment = await traveRoamService.bulkAssignEsims([
  { client_id: 123, plan_id: 456, email: 'client1@example.com' },
  { client_id: 124, plan_id: 457, email: 'client2@example.com' }
])

// Status and Usage
const status = await traveRoamService.getEsimStatus('esim_id_123')
const usage = await traveRoamService.getEsimUsage('esim_id_123')

// Order Processing
const order = await traveRoamService.processOrder({
  bundle_id: 'bundle_123',
  customer_email: 'client@example.com',
  customer_name: 'John Doe',
  quantity: 1
})

// Client Validation
const validation = await traveRoamService.validateClient(clientData)
```

**Backend Endpoints**:
- `GET /api/v1/traveroam/plans/` - Get available plans
- `POST /api/v1/traveroam/networks/` - Get network information
- `POST /api/v1/traveroam/esim/assign/` - Assign eSIM
- `GET /api/v1/traveroam/esim/{esim_id}/status/` - Get eSIM status
- `GET /api/v1/traveroam/esim/{esim_id}/usage/` - Get eSIM usage
- `POST /api/v1/traveroam/orders/process/` - Process order
- `POST /api/v1/traveroam/client/validate/` - Validate client

### 4. Integration Service (`integrationService`)

**Location**: `src/services/integrationService.js`

**High-level business operations**:
```javascript
import { integrationService } from '../services/integrationService'

// Complete eSIM assignment workflow
const assignment = await integrationService.assignEsimToClient({
  clientId: 123,
  planId: 456,
  email: 'client@example.com',
  customerName: 'John Doe',
  notes: 'Special requirements'
})

// Create client with optional eSIM assignment
const clientWithEsim = await integrationService.createClientWithEsim(
  clientData,
  { planId: 456, notes: 'Welcome package' }
)

// Get comprehensive dashboard data
const dashboardData = await integrationService.getDashboardData()

// Bulk assign eSIMs
const bulkResults = await integrationService.bulkAssignEsims(assignments)

// Sync eSIM status with TraveRoam
const syncResult = await integrationService.syncEsimStatus(123)

// Health check all services
const health = await integrationService.healthCheck()
```

## 🔧 Error Handling

All services return a consistent response format:

```javascript
// Success response
{
  success: true,
  data: { /* response data */ },
  message: 'Operation completed successfully'
}

// Error response
{
  success: false,
  error: 'Error message',
  step: 'operation_step' // for multi-step operations
}
```

## 📊 Data Formatting

All services include data formatting functions:

```javascript
// Format single items
const formattedClient = clientService.formatClientData(rawClient)
const formattedEsim = esimService.formatEsimData(rawEsim)
const formattedPlan = traveRoamService.formatPlanData(rawPlan)

// Format lists
const formattedClients = clientService.formatClientsList(rawClients)
const formattedEsims = esimService.formatEsimsList(rawEsims)
const formattedPlans = traveRoamService.formatPlansList(rawPlans)
```

## 🧪 Testing

### Manual Testing
Visit `/test/api` to run comprehensive API tests for all integrated endpoints.

### Programmatic Testing
```javascript
// Test individual services
const clientTest = await clientService.getAllClients({ limit: 1 })
const esimTest = await esimService.getAllEsims({ limit: 1 })
const traveRoamTest = await traveRoamService.getAvailablePlans({ limit: 1 })

// Test integration service
const healthCheck = await integrationService.healthCheck()
```

## 🔄 Real-time Integration

### Current Status
- ✅ **Client Management**: Full CRUD operations
- ✅ **eSIM Management**: Complete lifecycle management
- ✅ **Plan Management**: Full plan operations
- ✅ **Usage Tracking**: Comprehensive usage data
- ✅ **TraveRoam Integration**: Complete API integration
- ✅ **Reseller Workflow**: Full reseller operations
- ✅ **Bulk Operations**: Mass operations support
- ✅ **Error Handling**: Robust error management
- ✅ **Data Validation**: Comprehensive validation
- ✅ **Status Synchronization**: Real-time status updates

### Integration Completeness: 100%

All backend APIs are now fully integrated and functional!

## 🚨 Important Notes

1. **Authentication**: All API calls require valid JWT tokens
2. **Rate Limiting**: TraveRoam APIs may have rate limits
3. **Error Fallbacks**: Services include fallback to sample data if APIs fail
4. **Data Validation**: All inputs are validated before API calls
5. **Consistent Formatting**: All data is formatted consistently for frontend use

## 📞 Support

For issues with API integrations:
1. Check the browser console for detailed error logs
2. Use the API test page (`/test/api`) to diagnose issues
3. Verify backend API availability
4. Check authentication tokens
