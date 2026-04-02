// models/UpdateRequest.js
import mongoose from 'mongoose';

const updateRequestSchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  updatedData: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedFields: [{
    type: String,
    required: true
  }],
  reason: {
    type: String,
    trim: true
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('UpdateRequest', updateRequestSchema);
