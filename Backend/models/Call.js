// models/Call.js
import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  // User Information
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  userPhone: {
    type: String,
    required: [true, 'User phone is required'],
    trim: true
  },
  userId: {
    type: String,
    default: null
  },
  
  // Volunteer Information
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    default: null
  },
  
  // Call Details
  status: {
    type: String,
    enum: ['incoming', 'accepted', 'rejected', 'completed', 'missed'],
    default: 'incoming'
  },
  
  // Timestamps
  startTime: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  
  // Call Duration
  duration: {
    type: String,
    default: '0h 0m 0s'
  },
  durationInSeconds: {
    type: Number,
    default: 0
  },
  
  // Call Content
  callSummary: {
    type: String,
    maxlength: 1000
  },
  callNotes: {
    type: String,
    maxlength: 2000
  },
  
  // De-escalation Status
  deEscalated: {
    type: Boolean,
    default: false
  },
  
  // Rejection Reason
  rejectionReason: {
    type: String,
    maxlength: 500
  },
  reason: { // Alternative field name for backward compatibility
    type: String,
    maxlength: 500
  },
  
  // Priority Level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Call Category
  category: {
    type: String,
    enum: ['crisis', 'support', 'information', 'referral', 'follow-up', 'other'],
    default: 'support'
  },
  
  // Proof Upload
  proofImage: {
    type: String,
    default: null
  },
  proofUploadedAt: {
    type: Date
  },
  
  // Call Rating (by user)
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxlength: 1000
  },
  
  // Follow-up Required
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  followUpNotes: {
    type: String,
    maxlength: 500
  },
  
  // Call Metadata
  callType: {
    type: String,
    enum: ['inbound', 'outbound', 'follow-up'],
    default: 'inbound'
  },
  
  // Additional fields for compatibility
  date: {
    type: String,
    default: function() {
      return this.startTime ? this.startTime.toLocaleDateString() : new Date().toLocaleDateString();
    }
  },
  time: {
    type: String,
    default: function() {
      return this.startTime ? this.startTime.toLocaleTimeString() : new Date().toLocaleTimeString();
    }
  },
  user: { // Alternative field name
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
callSchema.index({ volunteerId: 1, status: 1 });
callSchema.index({ status: 1, createdAt: -1 });
callSchema.index({ volunteerId: 1, createdAt: -1 });
callSchema.index({ userName: 1 });
callSchema.index({ userPhone: 1 });
callSchema.index({ priority: 1, status: 1 });

// Pre-save middleware to calculate duration
callSchema.pre('save', function(next) {
  if (this.startTime && this.completedAt) {
    const durationMs = this.completedAt - this.startTime;
    this.durationInSeconds = Math.floor(durationMs / 1000);
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    
    this.duration = `${hours}h ${minutes}m ${seconds}s`;
  }
  
  // Set user field for backward compatibility
  if (!this.user && this.userName) {
    this.user = this.userName;
  }
  
  // Set reason field for backward compatibility
  if (!this.reason && this.rejectionReason) {
    this.reason = this.rejectionReason;
  }
  
  next();
});

// Instance method to calculate current call duration
callSchema.methods.getCurrentDuration = function() {
  if (!this.startTime) return '0h 0m 0s';
  
  const now = this.completedAt || new Date();
  const durationMs = now - this.startTime;
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  
  return `${hours}h ${minutes}m ${seconds}s`;
};

// Instance method to mark call as accepted
callSchema.methods.accept = function(volunteerId) {
  this.status = 'accepted';
  this.volunteerId = volunteerId;
  this.acceptedAt = new Date();
  return this.save();
};

// Instance method to mark call as rejected
callSchema.methods.reject = function(volunteerId, reason) {
  this.status = 'rejected';
  this.volunteerId = volunteerId;
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  this.reason = reason; // For backward compatibility
  return this.save();
};

// Instance method to mark call as completed
callSchema.methods.complete = function(summary, deEscalated = false) {
  this.status = 'completed';
  this.completedAt = new Date();
  if (summary) this.callSummary = summary;
  this.deEscalated = deEscalated;
  return this.save();
};

// Static method to find calls by volunteer
callSchema.statics.findByVolunteer = function(volunteerId, status = null) {
  const query = { volunteerId };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to find incoming calls
callSchema.statics.findIncoming = function() {
  return this.find({ status: 'incoming' }).sort({ createdAt: -1 });
};

// Static method to find active calls
callSchema.statics.findActive = function() {
  return this.find({ 
    status: 'accepted',
    completedAt: { $exists: false }
  }).populate('volunteerId', 'fullName email phone');
};

export default mongoose.model('Call', callSchema);