console.log('✅ userModel loaded');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
//const { default: isEmail } = require('validator/lib/isEmail');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
     required: [true, 'User must have a name']
  },

  email: {
    type: String,
    required: [true, 'User must have an email'],
    validate:[validator.isEmail,'Please provide valid email! 😐'],
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
  },
  role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
},
passwordChangedAt: Date,

active:{
  type:Boolean,
  default:true,
  select:false
}
});


// 🔐 HASH PASSWORD + REMOVE passwordConfirm (SINGLE middleware)

// userSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;

//   // hash password
//   this.password = await bcrypt.hash(this.password, 12);

//   // remove confirm field
//   this.passwordConfirm = undefined;
// });

// Hash password///////////////////
userSchema.pre('save', async function () {
  /// this password are new or update then it give false else true 
  if(!this.isModified('password')) return;

  // here password are hash with 12 time roation
  this.password = await bcrypt.hash(this.password,12);
  //we undefined here becoz in res we can not want to send passwordonfirm to the user 
  this.passwordConfirm = undefined;
  
});

// the time where password are change 
userSchema.pre('save', async function(){
  if(this.isModified('password') || this.isNew) return;
  this.passwordChangeAt = Date.now() - 1000;
});

/// query middleware-->

userSchema.pre('/^find/', function(){
      this.find({Acitve: {$ne: false}});
});

//// INSTANCE MIDDLEWARE 
userSchema.methods.correctPassword = async function ( canidatePassword,userPassword){
        return await bcrypt.compare(canidatePassword,userPassword);
}

//PasswordChangeAfter
userSchema.methods.passwordChangeAfter = function(JWTTimeStamp) {
  if(this.passwordChangedAt){
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime()/1000,
      10,
    )
    return JWTTimeStamp<changeTimeStamp;
  }
  return false;

}



const User = mongoose.model('User', userSchema);
module.exports = User;
