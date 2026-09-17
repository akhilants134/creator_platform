const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB Atlas connection string
const MONGO_URI = "mongodb+srv://Thelight_101:Ukej6JK3DkNkMKth@cluster0.ngeefqo.mongodb.net/practice_db?retryWrites=true&w=majority";
console.log('Using MONGO_URI:', MONGO_URI);

// Phase 2: Schema & Middleware Implementation
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/**
 * Pre-save middleware to hash password
 * Constraint 1: Use a regular function (not arrow function) for 'this' context.
 */
userSchema.pre('save', async function() {
  // Constraint 2: Use this.isModified('password') to only hash when necessary
  if (!this.isModified('password')) {
    return;
  }

  try {
    console.log('Hashing password for user:', this.username);
    
    // Constraint 3: Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
  } catch (error) {
    // Constraint 4: Throw error to be caught as next(error)
    throw error;
  }
});

const User = mongoose.model('User', userSchema);

// Phase 3: Logic Verification (The Test Script)
async function testSecurityHook() {
  try {
    // 1. Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    // 2. Clear existing practice users (optional, to keep it clean)
    await User.deleteMany({ email: 'test_user@innovate.com' });

    // 3. Instantiate a new User with a plaintext password
    const newUser = new User({
      username: 'InnovateDev',
      email: 'test_user@innovate.com',
      password: 'innovate_secure_2024' // Plaintext password
    });

    console.log('Plaintext password before save:', newUser.password);

    // 4. Trace the Save Operation (triggers the middleware)
    const savedUser = await newUser.save();

    // 5. The Proof: Console log the resulting document
    console.log('\n--- SUCCESS: User Saved Successfully ---');
    console.log('Saved User Object from Database:');
    console.log(savedUser);
    
    // Verify hashing in output
    if (savedUser.password.startsWith('$2b$')) {
      console.log('\n✅ VERIFIED: Password intercepted and hashed successfully.');
    } else {
      console.log('\n❌ ERROR: Password hashing failed.');
    }

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
testSecurityHook();
