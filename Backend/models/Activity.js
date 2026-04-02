import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  type: {
    type: String,
    enum: ['Event', 'Training', 'Outreach', 'Support', 'Other'],
    default: 'Other',
    required: true
  },
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed', 'cancelled'],
    default: 'planned',
    required: true
  },
  dateScheduled: {
    type: Date,
    required: true
  },
  dateCompleted: {
    type: Date
  },
  hoursSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  feedback: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
activitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});



activitySchema.index({ volunteerId: 1, status: 1, dateScheduled: -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
