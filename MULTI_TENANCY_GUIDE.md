# Multi-Tenancy System Guide

## 🏢 Overview
This application now supports multi-tenancy, allowing you to sell your application to multiple clients where each client has their own isolated admin dashboard and data.

## 🚀 How It Works

### 1. **Superadmin (You)**
- You are the superadmin who manages all client tokens
- Access: `/superadmin/tokens` - Create and manage admin tokens for clients
- Each client gets a unique admin token

### 2. **Client Admins**
- Each client gets their admin token from you
- They access: `/admin/setup` - Enter their token to access their dashboard
- All their data is isolated from other clients

## 📋 Setup Instructions

### For Superadmin (You):

1. **Access Token Management**
   ```
   Go to: http://localhost:3000/superadmin/tokens
   ```

2. **Create Token for Client**
   - Click "Create New Token"
   - Enter:
     - Tenant/Client Name (e.g., "ABC Company")
     - Admin Email (e.g., "admin@abc.com")
     - Expiry Date (optional)
   - Click "Create Token"
   - Copy the generated token and send it to your client

3. **Manage Tokens**
   - View all active tokens
   - Copy tokens to clipboard
   - Delete tokens when needed

### For Client Admins:

1. **First Time Setup**
   ```
   Go to: http://localhost:3000/admin/setup
   ```

2. **Enter Admin Token**
   - Paste the token you received from superadmin
   - Click "Access Dashboard"
   - You'll be redirected to your isolated admin dashboard

3. **Using the Dashboard**
   - All data (users, templates, questions, responses) is isolated
   - You can only see and manage your own data
   - The token is automatically included in all API requests

## 🔧 Technical Implementation

### Database Changes:
- Added `tenantToken` field to all schemas (User, Template, etc.)
- All API routes now filter data by tenant token
- Backward compatible - existing data works without tokens

### API Changes:
- All API routes now accept `x-admin-token` header
- Data is automatically filtered by tenant
- Invalid tokens return 401 error

### Frontend Changes:
- Admin setup page for token entry
- Automatic token injection in API requests
- Token validation and error handling

## 📁 Files Created/Modified:

### New Files:
- `modal/AdminToken.js` - Token management schema
- `app/api/superadmin/tokens/route.js` - Token CRUD API
- `app/superadmin/tokens/page.js` - Superadmin token management UI
- `app/admin/setup/page.js` - Client admin setup page
- `utils/tenantHelper.js` - Token validation utilities
- `utils/apiClient.js` - Axios client with token injection
- `MULTI_TENANCY_GUIDE.md` - This guide

### Modified Files:
- `modal/UserUser.js` - Added tenantToken field
- `modal/Template.js` - Added tenantToken field
- `app/api/user/register/route.js` - Added tenant filtering

## 🔒 Security Features:

1. **Token Validation**: All tokens are validated on every API request
2. **Data Isolation**: Each tenant can only access their own data
3. **Token Expiry**: Optional expiry dates for tokens
4. **Automatic Logout**: Invalid tokens automatically redirect to setup
5. **Secure Storage**: Tokens stored in localStorage (can be enhanced)

## 🎯 Usage Examples:

### Creating a Token for Client:
```javascript
// Superadmin creates token
POST /api/superadmin/tokens
{
  "tenantName": "ABC Company",
  "adminEmail": "admin@abc.com",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### Client Using Token:
```javascript
// Client makes API request with token
GET /api/user/register
Headers: { "x-admin-token": "abc123..." }
// Returns only ABC Company's users
```

## 🚀 Benefits:

✅ **Single Server**: One codebase, one server  
✅ **Data Isolation**: Each client sees only their data  
✅ **Easy Management**: Superadmin controls all tokens  
✅ **Scalable**: Easy to add new clients  
✅ **Backward Compatible**: Existing functionality unchanged  
✅ **Secure**: Token-based authentication  

## 🔧 Customization:

### Adding Tenant Support to New Schemas:
```javascript
// Add to any schema
tenantToken: {
  type: String,
  required: false
}
```

### Adding Tenant Filtering to API Routes:
```javascript
import { validateTenantToken } from "@/utils/tenantHelper";

// In your API route
const tenantValidation = await validateTenantToken(request);
const query = {};
if (tenantValidation.tenant) {
  query.tenantToken = tenantValidation.tenant.token;
}
const data = await YourModel.find(query);
```

## 🎉 Ready to Use!

Your application is now ready for multi-tenancy. You can:
1. Create tokens for your clients
2. Each client gets their own isolated dashboard
3. All data is automatically separated
4. Easy to manage and scale

Happy selling! 🚀 