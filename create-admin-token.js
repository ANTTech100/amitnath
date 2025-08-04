const mongoose = require('mongoose');
const AdminToken = require('./modal/AdminToken');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createAdminToken() {
  try {
    // Create a new admin token
    const adminToken = new AdminToken({
      token: 'ADMIN123456', // You can change this to any token you want
      tenantName: 'Test Tenant',
      adminEmail: 'admin@example.com',
      isActive: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Expires in 1 year
    });

    await adminToken.save();
    console.log('Admin token created successfully:', adminToken.token);
    console.log('You can now use this token in the admin setup page');
  } catch (error) {
    console.error('Error creating admin token:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminToken(); 