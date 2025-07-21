import AdminToken from '../modal/AdminToken';

// Get tenant from token
export async function getTenantFromToken(token) {
  try {
    if (!token) {
      return { success: false, message: 'Missing admin token' };
    }
    const tenant = await AdminToken.findOne({ token, isActive: true });
    if (!tenant) {
      return { success: false, message: 'Invalid or inactive admin token' };
    }
    if (tenant.expiresAt && new Date() > new Date(tenant.expiresAt)) {
      return { success: false, message: 'Admin token has expired' };
    }
    return {
      success: true,
      tenant: {
        token: tenant.token,
        tenantName: tenant.tenantName,
        adminEmail: tenant.adminEmail
      }
    };
  } catch (error) {
    console.error('Error validating tenant token:', error);
    return { success: false, message: 'Token validation error' };
  }
}

export async function validateTenantToken(token) {
  const result = await getTenantFromToken(token);
  if (!result.success) {
    return {
      success: false,
      error: result.message,
      status: 401
    };
  }
  return {
    success: true,
    tenant: result.tenant
  };
} 