import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed', 'pending'],
    default: 'subscribed'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  source: {
    type: String,
    default: 'website'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ createdAt: -1 });



newsletterSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'unsubscribed' && !this.unsubscribedAt) {
      this.unsubscribedAt = new Date();
    } else if (this.status === 'subscribed') {
      this.unsubscribedAt = undefined;
    }
  }
  next();
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;