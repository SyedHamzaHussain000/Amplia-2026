const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

async function testPassword() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Amplia');
    const user = await mongoose.connection.db.collection('users').findOne({ email: 'admin@amplia.com' });
    
    console.log('User found:', !!user);
    console.log('Email:', user.email);
    console.log('Stored password hash:', user.password);
    
    const result = await bcrypt.compare('Admin@123', user.password);
    console.log('Password match:', result);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testPassword();
