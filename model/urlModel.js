console.log("✅URL model Loaded");

const mongoose = require('mongoose');
const { trim } = require('validator');

const urlSchema = new mongoose.Schema(
  
  {
    originalUrl: {
      type: String,
      required:[true,"Please provide a URL"],
      trim: true
    },
    
    shortCode:{
      type: String,
      required: [true, "Short code is required"],
      unique: true,
      trim: true
      },

    clicks:{
      type: Number,
      default: 0
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true,"URL must belong to a user"]
    },

    expiresAt: {
      type: Date,
      default: null // Set expiration to 30 days from creation}
    }
     },
     {
      timestamps: true
     }
);

const Url = mongoose.model("Url",urlSchema);
module.exports = Url;