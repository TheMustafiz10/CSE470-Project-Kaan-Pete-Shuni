import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'unsubscribed'],
    default: 'active'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Subscription', subscriptionSchema);