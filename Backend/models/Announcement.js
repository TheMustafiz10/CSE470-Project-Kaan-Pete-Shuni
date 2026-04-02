





import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  text: {
    type: String,
    required: [true, 'Announcement text is required'],
    trim: true,
    maxlength: 1000
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  time: {
    type: String,
    default: () => new Date().toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    })
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Announcement', announcementSchema);