const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

async function createAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Amplia';
    console.log('Connecting to:', mongoUri.substring(0, 50) + '...');
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existing = await mongoose.connection.db.collection('users').findOne({ email: 'admin@amplia.com' });
    
    if (existing) {
      console.log('Admin user already exists. Updating password and role...');
      const hashedPassword = await bcrypt.hash('Admin@123', 12);
      await mongoose.connection.db.collection('users').updateOne(
        { email: 'admin@amplia.com' },
        { $set: { password: hashedPassword, role: 'superAdmin' } }
      );
      console.log('✅ Admin password and role updated!');
    } else {
      const hashedPassword = await bcrypt.hash('Admin@123', 12);
      
      const result = await mongoose.connection.db.collection('users').insertOne({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@amplia.com',
        password: hashedPassword,
        role: 'superAdmin',
        status: 'active',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Admin user created successfully!');
    }
    
    console.log('Email: admin@amplia.com');
    console.log('Password: Admin@123');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
