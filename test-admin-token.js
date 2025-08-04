const mongoose = require('mongoose');
const AdminToken = require('./modal/AdminToken');

// Connect to MongoDB using the same connection string
const MONGODB_URI = "mongodb+srv://saurabhiitr01:4uprAFSOQufMvGVO@cluster0.4pxd0b8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function testAdminToken() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin tokens exist
    const tokens = await AdminToken.find({ isActive: true });
    console.log('Active admin tokens found:', tokens.length);
    
    if (tokens.length === 0) {
      console.log('No admin tokens found. Creating a test token...');
      
      const adminToken = new AdminToken({
        token: 'ADMIN123456',
        tenantName: 'Test Tenant',
        adminEmail: 'admin@example.com',
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });

      await adminToken.save();
      console.log('Test admin token created:', adminToken.token);
    } else {
      console.log('Existing admin tokens:');
      tokens.forEach(token => {
        console.log(`- Token: ${token.token}, Tenant: ${token.tenantName}, Email: ${token.adminEmail}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

testAdminToken(); 