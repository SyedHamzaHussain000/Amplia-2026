// Script to create admin user
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Amplia');
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const result = await mongoose.connection.db.collection('users').insertOne({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@amplia.com',
      password: hashedPassword,
      role: 'super_admin',
      status: 'active',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@amplia.com');
    console.log('Password: Admin@123');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
