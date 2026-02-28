console.log('✅ userModel loaded');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name']
  },

  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: 8,
    select: false
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same'
    }
  }
});


// 🔐 HASH PASSWORD + REMOVE passwordConfirm (SINGLE middleware)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  // hash password
  this.password = await bcrypt.hash(this.password, 12);

  // remove confirm field
  this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);
module.exports = User;
