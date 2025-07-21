const mongoose = require('mongoose');

const AdminTokenSchema = new mongoose.Schema({
  token: { 
    type: String, 
    unique: true, 
    required: true 
  },
  tenantName: { 
    type: String, 
    required: true 
  },
  adminEmail: { 
    type: String, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date 
  }
});

module.exports = mongoose.models.AdminToken || mongoose.model('AdminToken', AdminTokenSchema); 