// models/User.js (Updated)

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: [8, 'Age must be at least 8'],
    max: [120, 'Age cannot exceed 120']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);