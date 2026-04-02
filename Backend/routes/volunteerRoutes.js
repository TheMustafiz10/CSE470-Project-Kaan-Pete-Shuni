






import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  registerVolunteer,
  loginVolunteer,
  getVolunteers,
  getVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadProfileImage,
  getVolunteerCalls,
  getVolunteerCallHistory,
  getIncomingCalls,
  acceptCall,
  rejectCall,
  endCall,
  submitUpdateRequest,
  getVolunteerUpdateRequests,
  getPendingVolunteers,
  getUpdateRequests,
  approveUpdateRequest,
  rejectUpdateRequest,
  deleteUpdateRequest,
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getStatistics,
  searchVolunteers,
  approveVolunteer,
  rejectVolunteer,

  getVolunteerShifts,
  uploadCallProof,
  assignShift,
  updateShiftStatus,
  getAllShiftAssignments,
  getActiveVolunteers,
  getAnnouncementsWithData
} from '../controllers/volunteerController.js';

const router = express.Router();

// File upload
const uploadDir = 'Uploads/profiles/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created upload directory:', uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024,  
    files: 1 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
    }
  },
});



// Multer error handler
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File size too large. Maximum 5MB allowed.' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  } else if (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
  next();
};





const logRequest = (req, res, next) => {
  console.log(`📝 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body keys:', Object.keys(req.body));
  }
  next();
};










// Async error handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};



const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (id && !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  next();
};



export default (io) => {
  // Shift management routes
  router.get('/:id/shifts', logRequest, validateObjectId, asyncHandler(getVolunteerShifts));
  router.post('/shifts/assign', logRequest, asyncHandler((req, res) => {
    return assignShift(req, res, io);
  }));
  router.put('/shifts/:shiftId/status', logRequest, asyncHandler((req, res) => {
    return updateShiftStatus(req, res, io);
  }));
  router.get('/shifts/all', logRequest, asyncHandler(getAllShiftAssignments));

  // Proof upload route
  router.post('/:id/upload-proof', logRequest, validateObjectId, asyncHandler(uploadCallProof));

  // Active volunteers tracking
  router.get('/active/current', logRequest, asyncHandler(getActiveVolunteers));

  // Enhanced announcements route (add this after existing routes)
  router.get('/announcements/with-data', logRequest, asyncHandler(getAnnouncementsWithData));


  
  
  // POST route for login - stores volunteer ID in the session
  router.post('/login', logRequest, asyncHandler(loginVolunteer));

  // GET route for profile - uses the volunteer ID from the session to fetch the profile
  router.get('/profile', logRequest, asyncHandler(getProfile)); 



  router.post('/register', logRequest, asyncHandler((req, res) => {
    console.log('POST /api/volunteers/register called');
    return registerVolunteer(req, res, io);
  }));

  router.get('/statistics', logRequest, asyncHandler(getStatistics));
  router.get('/search', logRequest, asyncHandler(searchVolunteers));
  router.get('/pending', logRequest, asyncHandler(getPendingVolunteers));

  router.get('/update/requests', logRequest, asyncHandler(getUpdateRequests));
  router.put('/update/approve/:requestId', logRequest, asyncHandler((req, res) => {
    return approveUpdateRequest(req, res, io);
  }));
  router.put('/update/reject/:requestId', logRequest, asyncHandler((req, res) => {
    return rejectUpdateRequest(req, res, io);
  }));

  router.post('/profile/image', 
    logRequest,
    upload.single('profileImage'), 
    uploadErrorHandler, 
    asyncHandler(uploadProfileImage)
  );

  router.get('/calls/incoming', logRequest, asyncHandler(getIncomingCalls));
  router.post('/calls/accept', logRequest, asyncHandler((req, res) => {
    return acceptCall(req, res, io);
  }));
  router.post('/calls/reject', logRequest, asyncHandler((req, res) => {
    return rejectCall(req, res, io);
  }));
  router.post('/calls/end', logRequest, asyncHandler((req, res) => {
    return endCall(req, res, io);
  }));

  router.get('/profile/:id', logRequest, validateObjectId, asyncHandler(getProfile));
  router.put('/profile/:id', logRequest, validateObjectId, asyncHandler(updateProfile));
  router.delete('/profile/:id', logRequest, validateObjectId, asyncHandler(deleteProfile));

  router.post('/:id/update-request', logRequest, validateObjectId, asyncHandler((req, res) => {
    return submitUpdateRequest(req, res, io);
  }));
  router.get('/:id/update-requests', logRequest, validateObjectId, asyncHandler(getVolunteerUpdateRequests));
  router.delete('/:id/update-request/:requestId', logRequest, validateObjectId, asyncHandler((req, res) => {
    return deleteUpdateRequest(req, res, io);
  }));

  router.get('/:id/calls', logRequest, validateObjectId, asyncHandler(getVolunteerCalls));
  router.get('/:id/call-history', logRequest, validateObjectId, asyncHandler(getVolunteerCallHistory));

  router.get('/:id/activities', logRequest, validateObjectId, asyncHandler(getActivities));
  router.post('/:id/activities', logRequest, validateObjectId, asyncHandler((req, res) => {
    return createActivity(req, res, io);
  }));
  router.put('/:id/activities/:activityId', logRequest, validateObjectId, asyncHandler((req, res) => {
    return updateActivity(req, res, io);
  }));
  router.delete('/:id/activities/:activityId', logRequest, validateObjectId, asyncHandler((req, res) => {
    return deleteActivity(req, res, io);
  }));

  // Admin actions on Approve or Reject
  router.put('/:id/approve', logRequest, validateObjectId, asyncHandler((req, res) => {
    console.log('Approving volunteer via route:', req.params.id);
    return approveVolunteer(req, res, io);
  }));
  router.put('/:id/reject', logRequest, validateObjectId, asyncHandler((req, res) => {
    console.log('Rejecting volunteer via route:', req.params.id);
    return rejectVolunteer(req, res, io);
  }));

  // General volunteer CRUD operations
  router.get('/', logRequest, asyncHandler(getVolunteers));
  router.get('/:id', logRequest, validateObjectId, asyncHandler(getVolunteer));
  router.put('/:id', logRequest, validateObjectId, asyncHandler((req, res) => {
    return updateVolunteer(req, res, io);
  }));
  router.delete('/:id', logRequest, validateObjectId, asyncHandler((req, res) => {
    return deleteVolunteer(req, res, io);
  }));

  router.use((err, req, res, next) => {
    console.error('Volunteer route error:', err.message);
    console.error('Stack trace:', err.stack);

    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry. Email may already exist.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  return router;
};
