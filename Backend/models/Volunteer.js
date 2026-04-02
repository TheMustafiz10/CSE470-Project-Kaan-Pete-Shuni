


import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name must not exceed 100 characters']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: { 
      type: String, 
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\+]?[0-9\-\(\)\s]{10,20}$/, 'Please enter a valid phone number']
    },
    dob: { 
      type: Date, 
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function(date) {
          const today = new Date();
          const minAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
          const maxAge = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
          return date >= minAge && date <= maxAge;
        },
        message: 'Age must be between 16 and 120 years'
      }
    },
    profileImage: { 
      type: String, 
      default: null 
    },
    address: {
      street: { 
        type: String, 
        required: [true, 'Street address is required'],
        trim: true,
        maxlength: [200, 'Street address must not exceed 200 characters']
      },
      city: { 
        type: String, 
        required: [true, 'City is required'],
        trim: true,
        maxlength: [50, 'City must not exceed 50 characters']
      },
      state: { 
        type: String, 
        required: [true, 'State is required'],
        trim: true,
        maxlength: [50, 'State must not exceed 50 characters']
      },
      postalCode: { 
        type: String, 
        required: [true, 'Postal code is required'],
        trim: true,
        maxlength: [20, 'Postal code must not exceed 20 characters']
      },
      country: { 
        type: String, 
        default: 'Bangladesh',
        maxlength: [50, 'Country must not exceed 50 characters']
      } 
    },
    volunteerType: {
      type: String,
      required: [true, 'Volunteer type is required'],
      enum: {
        values: ["helpline", "non-helpline", "individual", "organization", "group"],
        message: 'Volunteer type must be one of: helpline, non-helpline, individual, organization, group'
      }
    },
    volunteerRoles: {
      type: [String],
      required: [true, 'At least one volunteer role is required'],
      validate: [
        {
          validator: function (roles) {
            return roles && roles.length > 0;
          },
          message: "At least one volunteer role must be selected"
        },
        {
          validator: function (roles) {
            return roles.every(role => role && typeof role === 'string' && role.trim().length > 0);
          },
          message: "All volunteer roles must be valid non-empty strings"
        }
      ]
    },

    availability: {
      days: {
        type: [String],
        required: [true, 'Availability days are required'],
        validate: {
          validator: function (days) {
            if (!days || days.length === 0) return false;
            const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            return days.every(day => validDays.includes(day));
          },
          message: "At least one valid availability day must be selected"
        }
      },

      times: {
        type: [String],
        required: [true, 'Availability times are required'],
        validate: {
          validator: function (times) {
            return times && times.length > 0;
          },
          message: "At least one availability time must be selected"
        }
      },

      timeSlots: [String],
      timezone: { 
        type: String, 
        default: 'Asia/Dhaka' 
      }
    },
    
    additionalInfo: {
      whyVolunteer: { 
        type: String,
        maxlength: [1000, 'Why volunteer response must not exceed 1000 characters']
      },
      skillsExperience: { 
        type: String,
        maxlength: [1000, 'Skills and experience must not exceed 1000 characters']
      },
      experience: { 
        type: String,
        maxlength: [1000, 'Experience must not exceed 1000 characters']
      }, 
      motivation: { 
        type: String,
        maxlength: [1000, 'Motivation must not exceed 1000 characters']
      }, 
      skills: [String] 
    },

    consent: {
      agreePolicy: { 
        type: Boolean, 
        required: [true, 'Policy agreement is required'],
        validate: {
          validator: function(value) {
            return value === true;
          },
          message: "You must agree to the volunteer policy"
        }
      },

      consentContact: { 
        type: Boolean, 
        required: [true, 'Contact consent is required'],
        validate: {
          validator: function(value) {
            return value === true;
          },
          message: "You must consent to be contacted"
        }
      },

      confirmInfo: { 
        type: Boolean, 
        required: [true, 'Information confirmation is required'],
        validate: {
          validator: function(value) {
            return value === true;
          },
          message: "You must confirm that all information is accurate"
        }
      },
      
      cyberLawConsent: { 
        type: Boolean, 
        required: [true, 'Cyber law consent is required'],
        validate: {
          validator: function(value) {
            return value === true;
          },
          message: "You must agree to abide by cyber security laws"
        }
      }
    },

    registrationDate: { 
      type: Date, 
      default: Date.now 
    },
    
    lastLogin: {
      type: Date
    },
    
    isAdmin: { 
      type: Boolean, 
      default: false 
    },
    
    isApproved: { 
      type: Boolean, 
      default: false 
    }, 
    
    isActive: { 
      type: Boolean, 
      default: true 
    },
    
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "pending", "approved", "rejected"],
        message: 'Status must be one of: active, inactive, pending, approved, rejected'
      },
      default: "pending" 
    },
    
    isCurrentlyInCall: { 
      type: Boolean, 
      default: false 
    },
    
    currentCallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Call",
      default: null
    }
  },
  { 
    timestamps: true,
    versionKey: '__v'
  }
);



volunteerSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  

  
  if (this.status === 'approved') {
    this.isApproved = true;
    this.isActive = true;
  } else if (this.status === 'rejected') {
    this.isApproved = false;
    this.isActive = false;
  } else if (this.status === 'pending') {
    this.isApproved = false;
  }
  
  next();
});



volunteerSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  const update = this.getUpdate();
  

  
  if (update.email) {
    update.email = update.email.toLowerCase();
  }
  

  
  if (update.status === 'approved') {
    update.isApproved = true;
    update.isActive = true;
  } else if (update.status === 'rejected') {
    update.isApproved = false;
    update.isActive = false;
  }
  
  next();
});




volunteerSchema.methods.canTakeCalls = function() {
  return this.volunteerType === 'helpline' && 
         this.status === 'approved' && 
         this.isApproved && 
         this.isActive && 
         !this.isCurrentlyInCall;
};



volunteerSchema.methods.getAvailabilityForDay = function(day) {
  if (!this.availability.days.includes(day)) {
    return [];
  }
  return this.availability.times;
};



volunteerSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase().trim() });
};



volunteerSchema.statics.findAvailableHelplineVolunteers = function() {
  return this.find({
    volunteerType: 'helpline',
    status: 'approved',
    isApproved: true,
    isActive: true,
    isCurrentlyInCall: false
  });
};


volunteerSchema.statics.findByTypeAndStatus = function(type, status) {
  return this.find({
    volunteerType: type,
    status: status
  });
};




volunteerSchema.virtual('age').get(function() {
  if (!this.dob) return null;
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});




volunteerSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  
  return [
    this.address.street,
    this.address.city,
    this.address.state,
    this.address.postalCode,
    this.address.country
  ].filter(Boolean).join(', ');
});



volunteerSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

volunteerSchema.set('toObject', { virtuals: true });



volunteerSchema.index({ email: 1 }, { unique: true });
volunteerSchema.index({ status: 1 });
volunteerSchema.index({ volunteerType: 1 });
volunteerSchema.index({ isApproved: 1 });
volunteerSchema.index({ isActive: 1 });
volunteerSchema.index({ volunteerType: 1, status: 1 });
volunteerSchema.index({ volunteerType: 1, isApproved: 1 });
volunteerSchema.index({ createdAt: -1 });
volunteerSchema.index({ registrationDate: -1 });



volunteerSchema.index({
  fullName: 'text',
  email: 'text',
  phone: 'text',
  'address.city': 'text',
  'address.state': 'text'
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

export default Volunteer;