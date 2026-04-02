












// import express from 'express';
// import { Server } from 'socket.io';
// import { createServer } from 'http';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import connectDB from './config/db.js';
// import volunteerRoutes from './routes/volunteerRoutes.js';
// import initializeSocket from './socket/index.js';
// import { setMaxListeners } from 'events';
// import session from 'express-session';
// import MongoStore from 'connect-mongo';
// import Announcement from './models/Announcement.js';



// setMaxListeners(50);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables
// dotenv.config({ path: path.join(__dirname, '.env') });

// // Environment variables check
// console.log('Environment variables check:');
// console.log('NODE_ENV:', process.env.NODE_ENV);
// console.log('PORT:', process.env.PORT);
// console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
// console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
// console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);

// connectDB();

// const app = express();
// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3001'], // Removed 5173, added 3001
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
//   },
//   transports: ['websocket', 'polling'],
//   allowEIO3: true,
// });

// app.set('io', io);

// // CORS Middleware - Must be before session middleware
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3001'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
// }));

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Session configuration - FIXED
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
//   resave: false,
//   saveUninitialized: false, // Changed to false for security
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI,
//     touchAfter: 24 * 3600, // lazy session update
//     ttl: 24 * 60 * 60 // 24 hours session expiry
//   }),
//   cookie: { 
//     secure: process.env.NODE_ENV === 'production', // Only secure in production
//     httpOnly: true, // Prevent XSS attacks
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   },
//   name: 'volunteer.sid' // Custom session name
// }));

// // Enhanced logging middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
//     console.log('Request body keys:', Object.keys(req.body));
//   }
//   // Log session info for debugging (remove in production)
//   if (req.session && req.session.volunteerId) {
//     console.log('Session volunteer ID:', req.session.volunteerId);
//   }
//   next();
// });

// // Static files
// app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

// // Routes
// app.use('/api/volunteers', volunteerRoutes(io));

// // Calls route
// app.get('/api/calls', (req, res) => {
//   res.json({
//     success: true,
//     accepted: [],
//     rejected: []
//   });
// });

// // Subscriptions route
// app.get('/api/subscriptions', (req, res) => {
//   res.json([]);
// });

// // Users route
// app.get('/api/users', (req, res) => {
//   res.json([]);
// });





// // Announcements routes - UPDATED
// app.get('/api/announcements', async (req, res) => {
//   try {
//     const announcements = await Announcement.find({ isActive: true })
//       .populate('createdBy', 'fullName email')
//       .sort({ createdAt: -1 });

//     // Format announcements for frontend compatibility
//     const formattedAnnouncements = announcements.map(announcement => ({
//       _id: announcement._id,
//       title: announcement.title,
//       content: announcement.text, // Map 'text' field to 'content'
//       createdAt: announcement.createdAt,
//       updatedAt: announcement.updatedAt,
//       createdBy: announcement.createdBy?.fullName || 'Admin',
//       date: announcement.date,
//       time: announcement.time
//     }));

//     res.json({
//       success: true,
//       data: formattedAnnouncements,
//       count: formattedAnnouncements.length
//     });
//   } catch (error) {
//     console.error('Error fetching announcements:', error);
//     res.json({
//       success: true,
//       data: [], // Return empty array on error to prevent frontend crashes
//       count: 0
//     });
//   }
// });

// app.post('/api/announcements', async (req, res) => {
//   try {
//     const { title, text, createdBy } = req.body;
    
//     if (!title || !text) {
//       return res.status(400).json({
//         success: false,
//         message: 'Title and text are required'
//       });
//     }

//     const announcement = await Announcement.create({
//       title: title.trim(),
//       text: text.trim(),
//       createdBy: createdBy || null, // Will need actual admin ID
//       isActive: true
//     });

//     await announcement.populate('createdBy', 'fullName email');

//     const formattedAnnouncement = {
//       _id: announcement._id,
//       title: announcement.title,
//       content: announcement.text,
//       createdAt: announcement.createdAt,
//       updatedAt: announcement.updatedAt,
//       createdBy: announcement.createdBy?.fullName || 'Admin',
//       date: announcement.date,
//       time: announcement.time
//     };
    
//     // Emit real-time event
//     io.to('announcementRoom').emit('newAnnouncement', formattedAnnouncement);
//     console.log('New announcement created and emitted:', announcement._id);
    
//     res.status(201).json({
//       success: true,
//       message: 'Announcement created successfully',
//       data: formattedAnnouncement
//     });
//   } catch (error) {
//     console.error('Error creating announcement:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create announcement',
//       error: error.message
//     });
//   }
// });



// // // Announcements routes
// // app.get('/api/announcements', (req, res) => {
// //   res.json([]);
// // });

// // app.post('/api/announcements', (req, res) => {
// //   const { title, text } = req.body;
  
// //   const announcement = {
// //     _id: Date.now().toString(),
// //     title,
// //     text,
// //     createdAt: new Date(),
// //     date: new Date().toLocaleDateString(),
// //     time: new Date().toLocaleTimeString()
// //   };
  
// //   // Emit real-time event
// //   io.to('announcementRoom').emit('newAnnouncement', announcement);
  
// //   res.status(201).json({
// //     success: true,
// //     message: 'Announcement created successfully',
// //     data: announcement
// //   });
// // });







// // Shift assignments routes - ADD THESE NEW ROUTES
// app.get('/api/shifts', async (req, res) => {
//   try {
//     const { status, volunteerId, date } = req.query;
//     let query = { isActive: true };

//     if (status) query.status = status;
//     if (volunteerId) query.volunteerId = volunteerId;
//     if (date) {
//       const queryDate = new Date(date);
//       query.date = {
//         $gte: queryDate,
//         $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000)
//       };
//     }

//     const shifts = await ShiftAssignment.find(query)
//       .populate('volunteerId', 'fullName email phone')
//       .populate('assignedBy', 'fullName email')
//       .sort({ date: -1 });

//     res.json({
//       success: true,
//       data: shifts,
//       count: shifts.length
//     });
//   } catch (error) {
//     console.error('Error fetching shifts:', error);
//     res.json({
//       success: true,
//       data: [],
//       count: 0
//     });
//   }
// });

// app.post('/api/shifts', async (req, res) => {
//   try {
//     const { volunteerId, date, timeSlot, assignedBy, notes } = req.body;

//     if (!volunteerId || !date || !timeSlot) {
//       return res.status(400).json({
//         success: false,
//         message: 'Volunteer ID, date, and time slot are required'
//       });
//     }

//     const shift = await ShiftAssignment.create({
//       volunteerId,
//       date: new Date(date),
//       timeSlot,
//       assignedBy: assignedBy || null,
//       notes: notes || '',
//       status: 'upcoming'
//     });

//     await shift.populate('volunteerId', 'fullName email phone');

//     // Emit real-time event
//     io.to(`volunteer_${volunteerId}`).emit('shiftAssigned', shift);
//     io.to('adminRoom').emit('newShiftAssignment', shift);
    
//     res.status(201).json({
//       success: true,
//       message: 'Shift assigned successfully',
//       data: shift
//     });
//   } catch (error) {
//     console.error('Error assigning shift:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to assign shift',
//       error: error.message
//     });
//   }
// });





// // // Shift assignments routes
// // app.get('/api/shift-assignments', (req, res) => {
// //   res.json([]);
// // });

// // app.post('/api/shift-assignments', (req, res) => {
// //   const { volunteerId, slot } = req.body;
  
// //   const assignment = {
// //     _id: Date.now().toString(),
// //     volunteerId,
// //     slot,
// //     createdAt: new Date()
// //   };
  
// //   // Emit real-time event
// //   io.to('shiftAssignmentRoom').emit('newShiftAssignment', assignment);
  
// //   res.status(201).json({
// //     success: true,
// //     message: 'Shift assigned successfully',
// //     assignment
// //   });
// // });





// // Initialize Socket.IO
// initializeSocket(io);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage()
//   });
// });

// // API status endpoint
// app.get('/api/status', (req, res) => {
//   res.json({
//     success: true,
//     message: 'API is running',
//     timestamp: new Date().toISOString(),
//     socketConnections: io.sockets.sockets.size,
//     sessionStore: 'MongoDB'
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   console.log(`❌ Unhandled route: ${req.method} ${req.path}`);
//   res.status(404).json({ 
//     success: false, 
//     message: `Route ${req.method} ${req.path} not found`,
//     timestamp: new Date().toISOString()
//   });
// });

// // Global error handling middleware
// app.use((err, req, res, next) => {
//   console.error('❌ Global error handler:', err.message);
//   console.error('Stack trace:', err.stack);
  
//   // Don't send stack trace in production
//   const isDevelopment = process.env.NODE_ENV !== 'production';
  
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//     timestamp: new Date().toISOString(),
//     ...(isDevelopment && { stack: err.stack })
//   });
// });

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📡 Socket.IO initialized`);
//   console.log(`🗄️ Database connection: ${process.env.MONGODB_URI ? 'configured' : 'using default'}`);
//   console.log(`🌐 CORS enabled for: http://localhost:3000, http://localhost:3001`);
//   console.log(`📁 Static files served from: ${path.join(__dirname, 'Uploads')}`);
//   console.log(`🔐 Session store: MongoDB`);
// });





















// import express from 'express';
// import { Server } from 'socket.io';
// import { createServer } from 'http';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import connectDB from './config/db.js';
// import volunteerRoutes from './routes/volunteerRoutes.js';
// import initializeSocket from './socket/index.js';
// import { setMaxListeners } from 'events';
// import session from 'express-session';
// import MongoStore from 'connect-mongo';
// import Announcement from './models/Announcement.js';
// import ShiftAssignment from './models/ShiftAssignment.js'; 

// setMaxListeners(50);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, '.env') });



// console.log('Environment variables check:');
// console.log('NODE_ENV:', process.env.NODE_ENV);
// console.log('PORT:', process.env.PORT);
// console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
// console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
// console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);

// connectDB();

// const app = express();
// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3001'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
//   },
//   transports: ['websocket', 'polling'],
//   allowEIO3: true,
// });

// app.set('io', io);


// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3001'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
// }));

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));



// app.use(session({
//   secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI,
//     touchAfter: 24 * 3600,
//     ttl: 24 * 60 * 60
//   }),
//   cookie: { 
//     secure: process.env.NODE_ENV === 'production',
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000
//   },
//   name: 'volunteer.sid'
// }));



// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
//     console.log('Request body keys:', Object.keys(req.body));
//   }
//   if (req.session && req.session.volunteerId) {
//     console.log('Session volunteer ID:', req.session.volunteerId);
//   }
//   next();
// });



// app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
// app.use('/api/volunteers', volunteerRoutes(io));



// app.get('/api/calls', (req, res) => {
//   res.json({
//     success: true,
//     accepted: [],
//     rejected: []
//   });
// });



// app.get('/api/subscriptions', (req, res) => {
//   res.json({
//     success: true,
//     data: []
//   });
// });



// app.get('/api/users', (req, res) => {
//   res.json({
//     success: true,
//     data: []
//   });
// });


// app.get('/api/announcements', async (req, res) => {
//   try {
//     console.log('Fetching announcements from database...');
    
//     const announcements = await Announcement.find({ isActive: true })
//       .populate('createdBy', 'fullName email')
//       .sort({ createdAt: -1 });

//     const formattedAnnouncements = announcements.map(announcement => ({
//       _id: announcement._id,
//       title: announcement.title,
//       content: announcement.text,
//       text: announcement.text, 
//       createdAt: announcement.createdAt,
//       updatedAt: announcement.updatedAt,
//       createdBy: announcement.createdBy?.fullName || 'Admin',
//       date: announcement.date,
//       time: announcement.time
//     }));

//     console.log(`Found ${formattedAnnouncements.length} announcements`);

//     res.json({
//       success: true,
//       data: formattedAnnouncements,
//       count: formattedAnnouncements.length
//     });
//   } catch (error) {
//     console.error('Error fetching announcements:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch announcements',
//       error: error.message
//     });
//   }
// });

// app.post('/api/announcements', async (req, res) => {
//   try {
//     console.log('Creating announcement with data:', req.body);
    
//     const { title, text } = req.body;
    
//     if (!title || !text) {
//       return res.status(400).json({
//         success: false,
//         message: 'Title and text are required'
//       });
//     }

//     const announcement = await Announcement.create({
//       title: title.trim(),
//       text: text.trim(),
//       createdBy: null, 
//       isActive: true
//     });

//     await announcement.populate('createdBy', 'fullName email');

//     const formattedAnnouncement = {
//       _id: announcement._id,
//       title: announcement.title,
//       content: announcement.text,
//       text: announcement.text,
//       createdAt: announcement.createdAt,
//       updatedAt: announcement.updatedAt,
//       createdBy: announcement.createdBy?.fullName || 'Admin',
//       date: announcement.date,
//       time: announcement.time
//     };

//     console.log('Announcement created successfully:', announcement._id);
    
    
//     io.to('announcementRoom').emit('newAnnouncement', formattedAnnouncement);
//     console.log('Emitted newAnnouncement event');
    
//     res.status(201).json({
//       success: true,
//       message: 'Announcement created successfully',
//       data: formattedAnnouncement
//     });
//   } catch (error) {
//     console.error('Error creating announcement:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create announcement',
//       error: error.message
//     });
//   }
// });



// app.get('/api/shift-assignments', async (req, res) => {
//   try {
//     console.log('Fetching shift assignments from database...');
    
//     const { status, volunteerId, date } = req.query;
//     let query = { isActive: true };

//     if (status) query.status = status;
//     if (volunteerId) query.volunteerId = volunteerId;
//     if (date) {
//       const queryDate = new Date(date);
//       query.date = {
//         $gte: queryDate,
//         $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000)
//       };
//     }

//     const shifts = await ShiftAssignment.find(query)
//       .populate('volunteerId', 'fullName email phone')
//       .populate('assignedBy', 'fullName email')
//       .sort({ date: -1 });

//     console.log(`Found ${shifts.length} shift assignments`);

//     res.json({
//       success: true,
//       data: shifts,
//       count: shifts.length
//     });
//   } catch (error) {
//     console.error('Error fetching shifts:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch shifts',
//       error: error.message
//     });
//   }
// });

// app.post('/api/shift-assignments', async (req, res) => {
//   try {
//     console.log('Creating shift assignment with data:', req.body);
    
//     const { volunteerId, slot, date, assignedBy, notes } = req.body;

//     if (!volunteerId || !slot) {
//       return res.status(400).json({
//         success: false,
//         message: 'Volunteer ID and time slot are required'
//       });
//     }


    
//     const existingShift = await ShiftAssignment.findOne({
//       volunteerId,
//       timeSlot: slot,
//       date: new Date(date || new Date()),
//       isActive: true
//     });

//     if (existingShift) {
//       return res.status(400).json({
//         success: false,
//         message: 'Shift already assigned for this volunteer and time slot'
//       });
//     }

//     const shift = await ShiftAssignment.create({
//       volunteerId,
//       date: new Date(date || new Date()),
//       timeSlot: slot,
//       assignedBy: assignedBy || null,
//       notes: notes || '',
//       status: 'upcoming'
//     });

//     await shift.populate('volunteerId', 'fullName email phone');
//     await shift.populate('assignedBy', 'fullName email');

//     console.log('Shift assignment created successfully:', shift._id);


    
//     io.to(`volunteer_${volunteerId}`).emit('shiftAssigned', shift);
//     io.to('shiftAssignmentRoom').emit('newShiftAssignment', shift);
//     io.to('adminRoom').emit('newShiftAssignment', shift);
//     console.log('Emitted shift assignment events');
    
//     res.status(201).json({
//       success: true,
//       message: 'Shift assigned successfully',
//       assignment: shift, 
//       data: shift
//     });
//   } catch (error) {
//     console.error('Error assigning shift:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to assign shift',
//       error: error.message
//     });
//   }
// });



// initializeSocket(io);



// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage()
//   });
// });



// app.get('/api/status', (req, res) => {
//   res.json({
//     success: true,
//     message: 'API is running',
//     timestamp: new Date().toISOString(),
//     socketConnections: io.sockets.sockets.size,
//     sessionStore: 'MongoDB'
//   });
// });



// app.use((req, res) => {
//   console.log(`❌ Unhandled route: ${req.method} ${req.path}`);
//   res.status(404).json({ 
//     success: false, 
//     message: `Route ${req.method} ${req.path} not found`,
//     timestamp: new Date().toISOString()
//   });
// });



// app.use((err, req, res, next) => {
//   console.error('❌ Global error handler:', err.message);
//   console.error('Stack trace:', err.stack);
  
//   const isDevelopment = process.env.NODE_ENV !== 'production';
  
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//     timestamp: new Date().toISOString(),
//     ...(isDevelopment && { stack: err.stack })
//   });
// });

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📡 Socket.IO initialized`);
//   console.log(`🗄️ Database connection: ${process.env.MONGODB_URI ? 'configured' : 'using default'}`);
//   console.log(`🌐 CORS enabled for: http://localhost:3000, http://localhost:3001`);
//   console.log(`📁 Static files served from: ${path.join(__dirname, 'Uploads')}`);
//   console.log(`🔐 Session store: MongoDB`);
// });














import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';  // NEW
import initializeSocket from './socket/index.js';
import { setMaxListeners } from 'events';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import Announcement from './models/Announcement.js';
import ShiftAssignment from './models/ShiftAssignment.js';
import Newsletter from './models/Newsletter.js';  // NEW

setMaxListeners(50);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Environment variables check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);

connectDB();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

app.set('io', io);

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600,
    ttl: 24 * 60 * 60
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  name: 'volunteer.sid'
}));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
    console.log('Request body keys:', Object.keys(req.body));
  }
  if (req.session && req.session.volunteerId) {
    console.log('Session volunteer ID:', req.session.volunteerId);
  }
  next();
});

app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/api/volunteers', volunteerRoutes(io));
app.use('/api/newsletter', newsletterRoutes(io));  // NEW: Newsletter routes

app.get('/api/calls', (req, res) => {
  res.json({
    success: true,
    accepted: [],
    rejected: []
  });
});



// UPDATED: Newsletter subscriptions endpoint
app.get('/api/subscriptions', async (req, res) => {
  try {
    console.log('Fetching newsletter subscriptions from database...');
    
    const { status, page = 1, limit = 100 } = req.query;
    let query = { isActive: true };

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const subscriptions = await Newsletter.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Newsletter.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    console.log(`Found ${subscriptions.length} newsletter subscriptions`);

    res.json({
      success: true,
      data: subscriptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions',
      error: error.message
    });
  }
});

// Newsletter subscription status update
app.put('/api/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['subscribed', 'unsubscribed', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be subscribed, unsubscribed, or pending'
      });
    }

    const subscription = await Newsletter.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    console.log('Subscription status updated:', subscription.email, status);

    // Emit real-time update
    io.to('subscriptionRoom').emit('subscriptionUpdated', subscription);
    io.to('adminRoom').emit('subscriptionUpdated', subscription);
    console.log('Emitted subscription status update event');

    res.json({
      success: true,
      message: 'Subscription status updated successfully',
      data: subscription
    });

  } catch (error) {
    console.error('Error updating subscription status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription status',
      error: error.message
    });
  }
});

app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// UPDATED: Announcements with real-time volunteer notifications
app.get('/api/announcements', async (req, res) => {
  try {
    console.log('Fetching announcements from database...');
    
    const announcements = await Announcement.find({ isActive: true })
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    const formattedAnnouncements = announcements.map(announcement => ({
      _id: announcement._id,
      title: announcement.title,
      content: announcement.text,
      text: announcement.text, 
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
      createdBy: announcement.createdBy?.fullName || 'Admin',
      date: announcement.date,
      time: announcement.time
    }));

    console.log(`Found ${formattedAnnouncements.length} announcements`);

    res.json({
      success: true,
      data: formattedAnnouncements,
      count: formattedAnnouncements.length
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message
    });
  }
});





// Replace the existing announcement POST endpoint with this:
app.post('/api/announcements', async (req, res) => {
  try {
    console.log('Creating announcement with data:', req.body);
    
    const { title, text } = req.body;
    
    if (!title || !text) {
      return res.status(400).json({
        success: false,
        message: 'Title and text are required'
      });
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      text: text.trim(),
      createdBy: null, 
      isActive: true
    });

    await announcement.populate('createdBy', 'fullName email');

    const formattedAnnouncement = {
      _id: announcement._id,
      title: announcement.title,
      content: announcement.text,
      text: announcement.text,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
      createdBy: announcement.createdBy?.fullName || 'Admin',
      date: announcement.date,
      time: announcement.time
    };

    console.log('Announcement created successfully:', announcement._id);
    
    // UPDATED: Emit to all rooms including individual volunteer rooms
    io.to('announcementRoom').emit('newAnnouncement', formattedAnnouncement);
    io.to('volunteerRoom').emit('newAnnouncement', formattedAnnouncement);
    io.to('adminRoom').emit('newAnnouncement', formattedAnnouncement);
    
    // Emit to all connected clients (volunteers and admins)
    io.emit('newAnnouncement', formattedAnnouncement);
    
    console.log('Emitted newAnnouncement event to all rooms and clients');
    
    res.status(201).json({
      success: true,
      message: 'Announcement created and sent to all volunteers successfully',
      data: formattedAnnouncement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message
    });
  }
});
















// app.post('/api/announcements', async (req, res) => {
//   try {
//     console.log('Creating announcement with data:', req.body);
    
//     const { title, text } = req.body;
    
//     if (!title || !text) {
//       return res.status(400).json({
//         success: false,
//         message: 'Title and text are required'
//       });
//     }

//     const announcement = await Announcement.create({
//       title: title.trim(),
//       text: text.trim(),
//       createdBy: null, 
//       isActive: true
//     });

//     await announcement.populate('createdBy', 'fullName email');

//     const formattedAnnouncement = {
//       _id: announcement._id,
//       title: announcement.title,
//       content: announcement.text,
//       text: announcement.text,
//       createdAt: announcement.createdAt,
//       updatedAt: announcement.updatedAt,
//       createdBy: announcement.createdBy?.fullName || 'Admin',
//       date: announcement.date,
//       time: announcement.time
//     };

//     console.log('Announcement created successfully:', announcement._id);
    
//     // UPDATED: Emit to both admin and all volunteers
//     io.to('announcementRoom').emit('newAnnouncement', formattedAnnouncement);
//     io.to('volunteerRoom').emit('newAnnouncement', formattedAnnouncement);
//     io.emit('newAnnouncement', formattedAnnouncement); // Broadcast to all connected clients
//     console.log('Emitted newAnnouncement event to all rooms including volunteers');
    
//     res.status(201).json({
//       success: true,
//       message: 'Announcement created and sent to all volunteers successfully',
//       data: formattedAnnouncement
//     });
//   } catch (error) {
//     console.error('Error creating announcement:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create announcement',
//       error: error.message
//     });
//   }
// });

























app.get('/api/shift-assignments', async (req, res) => {
  try {
    console.log('Fetching shift assignments from database...');
    
    const { status, volunteerId, date } = req.query;
    let query = { isActive: true };

    if (status) query.status = status;
    if (volunteerId) query.volunteerId = volunteerId;
    if (date) {
      const queryDate = new Date(date);
      query.date = {
        $gte: queryDate,
        $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    const shifts = await ShiftAssignment.find(query)
      .populate('volunteerId', 'fullName email phone')
      .populate('assignedBy', 'fullName email')
      .sort({ date: -1 });

    console.log(`Found ${shifts.length} shift assignments`);

    res.json({
      success: true,
      data: shifts,
      count: shifts.length
    });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shifts',
      error: error.message
    });
  }
});

app.post('/api/shift-assignments', async (req, res) => {
  try {
    console.log('Creating shift assignment with data:', req.body);
    
    const { volunteerId, slot, date, assignedBy, notes } = req.body;

    if (!volunteerId || !slot) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer ID and time slot are required'
      });
    }
    
    const existingShift = await ShiftAssignment.findOne({
      volunteerId,
      timeSlot: slot,
      date: new Date(date || new Date()),
      isActive: true
    });

    if (existingShift) {
      return res.status(400).json({
        success: false,
        message: 'Shift already assigned for this volunteer and time slot'
      });
    }

    const shift = await ShiftAssignment.create({
      volunteerId,
      date: new Date(date || new Date()),
      timeSlot: slot,
      assignedBy: assignedBy || null,
      notes: notes || '',
      status: 'upcoming'
    });

    await shift.populate('volunteerId', 'fullName email phone');
    await shift.populate('assignedBy', 'fullName email');

    console.log('Shift assignment created successfully:', shift._id);
    
    io.to(`volunteer_${volunteerId}`).emit('shiftAssigned', shift);
    io.to('shiftAssignmentRoom').emit('newShiftAssignment', shift);
    io.to('adminRoom').emit('newShiftAssignment', shift);
    console.log('Emitted shift assignment events');
    
    res.status(201).json({
      success: true,
      message: 'Shift assigned successfully',
      assignment: shift, 
      data: shift
    });
  } catch (error) {
    console.error('Error assigning shift:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign shift',
      error: error.message
    });
  }
});

initializeSocket(io);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    socketConnections: io.sockets.sockets.size,
    sessionStore: 'MongoDB'
  });
});

app.use((req, res) => {
  console.log(`❌ Unhandled route: ${req.method} ${req.path}`);
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err.message);
  console.error('Stack trace:', err.stack);
  
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO initialized`);
  console.log(`🗄️ Database connection: ${process.env.MONGODB_URI ? 'configured' : 'using default'}`);
  console.log(`🌐 CORS enabled for: http://localhost:3000, http://localhost:3001`);
  console.log(`📁 Static files served from: ${path.join(__dirname, 'Uploads')}`);
  console.log(`🔐 Session store: MongoDB`);
  console.log(`📧 Newsletter routes: /api/newsletter`);
});