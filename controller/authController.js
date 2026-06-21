const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signToken = require("../utils/signToken");
//const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/* ===============================
  ⬇️ Logic Implement Here ⬇️⬇
================================ */
// Acitve:
const createSendToken = (user,statusCode,res) =>{
  const token = signToken(user._id);
  user.password = undefined;
  user.active = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data:{
      user
    }
  })

}

/* ===============================
   SIGNUP
================================ */
exports.signUp = catchAsync(async (req, res,next) => {
  
    const { name, email, password, passwordConfirm } = req.body;

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      passwordConfirm,
      
    });
    
    createSendToken(user,201,res);
    
  })
  

/* ===============================
   LOGIN
================================ */
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1️⃣ check email & password
//     if (!email || !password) {
//       return res.status(400).json({
//         status: "fail",
//         message: "Please provide email and password",
//       });
//     }

//     // 2️⃣ find user + password
//     const user = await User.findOne({ email }).select("+password");

//     // 3️⃣ user exist & password match?
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({
//         status: "fail",
//         message: "Invalid email or password",
//       });
//     }

//     // 🔐 token generate
//     const token = signToken(user._id,user.role);

//     res.status(200).json({
//       status: "success",
//       token,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: err.message,
//     });
//   }
// };

exports.login = catchAsync(async (req,res,next)=>{

  let email = req.body.email;
  const password = req.body.password;

  //// In body email and password exits or not?
  if(!email || !password){
    return next( new AppError("Please provde email or Password!😊",400));
  }

  email = email.toLowerCase().trim();
   
  // find email or password in DB 
  const user = await User.findOne({email}).select('+password');
 
  // if any one are wrong throw an error 
  if(!user || !(await user.correctPassword(password,user.password))){
    return next(new AppError("Invalid email or Password",401));
  }
  // all things are good then send token 😊
  createSendToken(user,200,res);

});
/* ===============================
   PROTECT 🪖
================================ */

exports.protect = catchAsync(async (req,res,next) =>{
  let token;

  if(
    req.headers.authorization && req.header.authorization.startsWith('Bearer')
  ){
  token = req.headers.authorization.split(' ')[1];
  }

  if(!token){
    return next(new AppError('You are not logged in! Please log in to get access.',401));
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  )

  const currentUser = await User.findById(decoded.id);

  if(!currentUser){
    return next(new AppError('The user belonging to this token no longer exists.',401));
  }

  if(currentUser.passwordChangeAfter(decoded.iat)){
        return next(new AppError('User recently changed password. Please log in again.',401));
  }
    
  req.user = currentUser;
  next();

}
)

/* ===============================
   RESTRICT 🚫
================================ */

exports.restrict = (...roles) =>{
  return(req,res,next) =>{
    if(!roles.includes(req.user.role)){
      return next(
        new AppError('You do not have permission to perform this action 🤚🤚',403)
      )
    }
  }
}
