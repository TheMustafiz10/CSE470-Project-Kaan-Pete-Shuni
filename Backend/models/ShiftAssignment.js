


import mongoose from 'mongoose';

const shiftAssignmentSchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: [true, 'Volunteer ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Shift date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    enum: [
      '12:00 AM – 4:00 AM',
      '4:00 AM – 8:00 AM', 
      '8:00 AM – 12:00 PM',
      '12:00 PM – 4:00 PM',
      '4:00 PM – 8:00 PM',
      '8:00 PM – 12:00 AM',
      'Flexible / Available 24 Hours'
    ]
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'missed'],
    default: 'upcoming'
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer', // Admin who assigned
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});



shiftAssignmentSchema.index({ volunteerId: 1, date: 1 });
shiftAssignmentSchema.index({ date: 1, status: 1 });
shiftAssignmentSchema.index({ status: 1 });



shiftAssignmentSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  const shiftDate = new Date(this.date);
  
  // Check if it's the shift date and within time slot
  if (shiftDate.toDateString() === now.toDateString()) {
    const currentHour = now.getHours();
    
    switch(this.timeSlot) {
      case '12:00 AM – 4:00 AM':
        return currentHour >= 0 && currentHour < 4;
      case '4:00 AM – 8:00 AM':
        return currentHour >= 4 && currentHour < 8;
      case '8:00 AM – 12:00 PM':
        return currentHour >= 8 && currentHour < 12;
      case '12:00 PM – 4:00 PM':
        return currentHour >= 12 && currentHour < 16;
      case '4:00 PM – 8:00 PM':
        return currentHour >= 16 && currentHour < 20;
      case '8:00 PM – 12:00 AM':
        return currentHour >= 20 && currentHour < 24;
      case 'Flexible / Available 24 Hours':
        return true;
      default:
        return false;
    }
  }
  return false;
};

// Static method to find active shifts
shiftAssignmentSchema.statics.findActiveShifts = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    },
    status: 'active',
    isActive: true
  }).populate('volunteerId', 'fullName email phone');
};

export default mongoose.model('ShiftAssignment', shiftAssignmentSchema);