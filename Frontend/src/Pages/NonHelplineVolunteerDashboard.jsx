







// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { io } from 'socket.io-client';
// import "./CSS/NonHelplineVolunteerDashboard.css";

// const NonHelplineVolunteerDashboard = () => {
//   // Profile states
//   const [volunteer, setVolunteer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
  

//   const [announcements, setAnnouncements] = useState([]);
//   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
//   const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);
//   const [lastAnnouncementCheck, setLastAnnouncementCheck] = useState(new Date());
  
//   const [updateRequests, setUpdateRequests] = useState([]);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [updateRequestData, setUpdateRequestData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     dob: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       postalCode: ''
//     },
//     volunteerRoles: [],
//     availability: {
//       days: [],
//       times: []
//     },
//     additionalInfo: {
//       whyVolunteer: '',
//       skillsExperience: '',
//       otherNonHelpline: ''
//     },
//     consent: {
//       agreePolicy: false,
//       consentContact: false,
//       confirmInfo: false,
//       cyberLawConsent: false
//     }
//   });
  
//   // Activity states
//   const [activities, setActivities] = useState([]);
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [filteredActivities, setFilteredActivities] = useState([]);
  
//   // Modal states
//   const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
//   const [showUpdateForm, setShowUpdateForm] = useState(false);
  
//   // Socket reference
//   const socketRef = useRef(null);
//   const navigate = useNavigate();
  
//   const categories = [
//     'Event Support', 'Fundraising', 'Community Outreach', 'Campus Ambassador',
//     'Social Media & Digital Promotion', 'Content Writing / Blogging',
//     'Graphic Design / Creative Support', 'Technical Support (e.g., IT, website)',
//     'Translation / Language Support', 'Photography / Videography',
//     'Mentorship / Training', 'Case Follow-up Coordinator',
//     'Crisis Response Assistant', 'Resource & Referral Assistant'
//   ];

//   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   const timeSlots = [
//     '12:00 AM - 4:00 AM',
//     '4:00 AM - 8:00 AM',
//     '8:00 AM - 12:00 PM',
//     '12:00 PM - 4:00 PM',
//     '4:00 PM - 8:00 PM',
//     '8:00 PM - 12:00 AM'
//   ];

//   // Notification helper function
//   const showNotification = (message) => {
//     if (Notification.permission === 'granted') {
//       new Notification('Non-Helpline Volunteer Portal', {
//         body: message,
//         icon: '/favicon.ico'
//       });
//     }
//   };

//   useEffect(() => {
//     const volunteerData = JSON.parse(localStorage.getItem('volunteer') || '{}');
//     if (!volunteerData._id) {
//       navigate('/volunteer-login');
//       return;
//     }
//     if (volunteerData.volunteerType !== 'non-helpline') {
//       navigate('/volunteer-dashboard');
//       return;
//     }
//     setVolunteer(volunteerData);
//     fetchVolunteerData(volunteerData._id);
//     setupRealTimeUpdates(volunteerData._id);
    
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, [navigate]);

//   useEffect(() => {
//     if (categoryFilter === '') {
//       setFilteredActivities(activities);
//     } else {
//       setFilteredActivities(activities.filter(activity => 
//         activity.category === categoryFilter
//       ));
//     }
//   }, [activities, categoryFilter]);

//   // FIXED: Real-time Socket.IO setup
//   const setupRealTimeUpdates = (volunteerId) => {
//     // Disconnect existing socket if any
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//     }

//     // Create new socket connection
//     socketRef.current = io('http://localhost:5000', {
//       transports: ["websocket"],
//       reconnectionAttempts: 5,
//       timeout: 10000,
//     });

//     const socket = socketRef.current;

//     socket.on('connect', () => {
//       console.log('Non-helpline volunteer connected to server');
//       socket.emit('joinVolunteerRoom', volunteerId);
//       socket.emit('joinAnnouncementRoom');
//       socket.emit('joinUpdateRequestRoom');
//       socket.emit('joinRoom', `volunteer_${volunteerId}`);
//       socket.emit('joinRoom', 'volunteerRoom');
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from server');
//     });

//     socket.on('connect_error', (error) => {
//       console.error('Connection error:', error);
//     });

//     // Real-time listeners
//     socket.on('volunteerUpdated', (updatedVolunteer) => {
//       if (updatedVolunteer._id === volunteerId) {
//         setVolunteer(updatedVolunteer);
//         localStorage.setItem('volunteer', JSON.stringify(updatedVolunteer));
//         // Update updateRequestData with new volunteer data
//         setUpdateRequestData({
//           fullName: updatedVolunteer.fullName || '',
//           email: updatedVolunteer.email || '',
//           phone: updatedVolunteer.phone || '',
//           dob: updatedVolunteer.dob || '',
//           address: {
//             street: updatedVolunteer.address?.street || '',
//             city: updatedVolunteer.address?.city || '',
//             state: updatedVolunteer.address?.state || '',
//             postalCode: updatedVolunteer.address?.postalCode || ''
//           },
//           volunteerRoles: updatedVolunteer.volunteerRoles || [],
//           availability: {
//             days: updatedVolunteer.availability?.days || [],
//             times: updatedVolunteer.availability?.times || []
//           },
//           additionalInfo: {
//             whyVolunteer: updatedVolunteer.additionalInfo?.whyVolunteer || '',
//             skillsExperience: updatedVolunteer.additionalInfo?.skillsExperience || '',
//             otherNonHelpline: updatedVolunteer.additionalInfo?.otherNonHelpline || ''
//           },
//           consent: {
//             agreePolicy: updatedVolunteer.consent?.agreePolicy || false,
//             consentContact: updatedVolunteer.consent?.consentContact || false,
//             confirmInfo: updatedVolunteer.consent?.confirmInfo || false,
//             cyberLawConsent: updatedVolunteer.consent?.cyberLawConsent || false
//           }
//         });
//       }
//     });

//     socket.on('newAnnouncement', (announcement) => {
//       console.log('New announcement received:', announcement);
//       setAnnouncements((prev) => {
//         if (!prev.some(a => a._id === announcement._id)) {
//           return [announcement, ...prev];
//         }
//         return prev;
//       });
//       setHasNewAnnouncement(true);
//       setLastAnnouncementCheck(new Date());
//       showNotification(`New announcement: ${announcement.title}`);
//     });

//     socket.on('newUpdateRequest', (updateRequest) => {
//       if (updateRequest.volunteerId === volunteerId) {
//         setUpdateRequests((prev) => {
//           // Prevent duplicate requests by checking _id
//           if (!prev.some(req => req._id === updateRequest._id)) {
//             return [...prev, updateRequest];
//           }
//           return prev;
//         });
//       }
//     });

//     socket.on('updateRequestApproved', (data) => {
//       console.log('Update request approved:', data);
//       if (data.volunteerId === volunteerId || data.message) {
//         alert('Your profile update request has been approved!');
//         setUpdateRequests((prev) => prev.filter((r) => r._id !== data.requestId));
//         // Fetch updated volunteer data
//         fetchVolunteerData(volunteerId);
//       }
//     });

//     socket.on('updateRequestRejected', (data) => {
//       console.log('Update request rejected:', data);
//       if (data.volunteerId === volunteerId || data.message) {
//         alert(`Your profile update request has been rejected. Reason: ${data.reason || data.message || 'No reason provided'}`);
//         setUpdateRequests((prev) => prev.filter((r) => r._id !== data.requestId));
//       }
//     });

//     socket.on('updateRequestDeleted', (data) => {
//       if (data.volunteerId === volunteerId) {
//         setUpdateRequests((prev) => prev.filter((r) => r._id !== data.requestId));
//       }
//     });

//     socket.on('newActivity', (activity) => {
//       if (activity.volunteerId === volunteerId) {
//         setActivities((prev) => [...prev, activity]);
//       }
//     });

//     return socket;
//   };

//   // REAL-TIME DATA FETCHING: Initial fetch only
//   const fetchVolunteerData = async (volunteerId) => {
//     try {
//       setLoading(true);
//       const [profileRes, requestsRes, announcementsRes, activitiesRes] = await Promise.all([
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}`),
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/update-requests`),
//         axios.get('http://localhost:5000/api/announcements'),
//         axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/activities`)
//       ]);

//       // Update profile data
//       if (profileRes.data.success) {
//         const updatedVolunteer = profileRes.data.data;
//         setVolunteer(updatedVolunteer);
//         localStorage.setItem('volunteer', JSON.stringify(updatedVolunteer));
        
//         // Update form data with current volunteer data
//         setUpdateRequestData({
//           fullName: updatedVolunteer.fullName || '',
//           email: updatedVolunteer.email || '',
//           phone: updatedVolunteer.phone || '',
//           dob: updatedVolunteer.dob || '',
//           address: {
//             street: updatedVolunteer.address?.street || '',
//             city: updatedVolunteer.address?.city || '',
//             state: updatedVolunteer.address?.state || '',
//             postalCode: updatedVolunteer.address?.postalCode || ''
//           },
//           volunteerRoles: updatedVolunteer.volunteerRoles || [],
//           availability: {
//             days: updatedVolunteer.availability?.days || [],
//             times: updatedVolunteer.availability?.times || []
//           },
//           additionalInfo: {
//             whyVolunteer: updatedVolunteer.additionalInfo?.whyVolunteer || '',
//             skillsExperience: updatedVolunteer.additionalInfo?.skillsExperience || '',
//             otherNonHelpline: updatedVolunteer.additionalInfo?.otherNonHelpline || ''
//           },
//           consent: {
//             agreePolicy: updatedVolunteer.consent?.agreePolicy || false,
//             consentContact: updatedVolunteer.consent?.consentContact || false,
//             confirmInfo: updatedVolunteer.consent?.confirmInfo || false,
//             cyberLawConsent: updatedVolunteer.consent?.cyberLawConsent || false
//           }
//         });
//       }

//       // Update requests data
//       if (requestsRes.data.success) {
//         setUpdateRequests(requestsRes.data.data);
//       }

//       // Update announcements data - sort by date, newest first
//       if (announcementsRes.data.success) {
//         const sortedAnnouncements = (announcementsRes.data.data || [])
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setAnnouncements(sortedAnnouncements);
//       }

//       // Update activities data
//       if (activitiesRes.data.success) {
//         setActivities(activitiesRes.data.data);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching volunteer data:', error);
//       setError('Error loading dashboard data');
//       setLoading(false);
//     }
//   };

//   // FIXED: Update request submission with proper data structure
//   const handleUpdateRequest = async () => {
//     if (updateRequests.length > 0) {
//       alert('Cannot submit new request while previous one is pending approval or rejection.');
//       return;
//     }
//     try {
//       console.log('Submitting update request for non-helpline volunteer:', volunteer._id);
      
//       // Prepare the data structure to match the volunteer format
//       const requestData = {
//         fullName: updateRequestData.fullName,
//         email: updateRequestData.email,
//         phone: updateRequestData.phone,
//         dob: updateRequestData.dob,
//         address: {
//           street: updateRequestData.address?.street || '',
//           city: updateRequestData.address?.city || '',
//           state: updateRequestData.address?.state || '',
//           postalCode: updateRequestData.address?.postalCode || ''
//         },
//         additionalInfo: {
//           whyVolunteer: updateRequestData.additionalInfo?.whyVolunteer || '',
//           skillsExperience: updateRequestData.additionalInfo?.skillsExperience || '',
//           otherNonHelpline: updateRequestData.additionalInfo?.otherNonHelpline || ''
//         },
//         consent: {
//           agreePolicy: updateRequestData.consent?.agreePolicy || false,
//           consentContact: updateRequestData.consent?.consentContact || false,
//           confirmInfo: updateRequestData.consent?.confirmInfo || false,
//           cyberLawConsent: updateRequestData.consent?.cyberLawConsent || false
//         },
//         availability: {
//           days: updateRequestData.availability?.days || [],
//           times: updateRequestData.availability?.times || []
//         },
//         volunteerRoles: updateRequestData.volunteerRoles || []
//       };

//       const response = await axios.post(
//         `http://localhost:5000/api/volunteers/${volunteer._id}/update-request`,
//         requestData,
//         {
//           headers: { 'Content-Type': 'application/json' },
//           timeout: 10000
//         }
//       );
      
//       if (response.data.success) {
//         alert('Update request submitted successfully! Please wait for admin approval.');
//         setShowUpdateForm(false);
//         // Rely on socket.io 'newUpdateRequest' event to add the request to updateRequests
//       }
//     } catch (error) {
//       console.error('Error submitting update request:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
//       alert(`Failed to submit update request: ${errorMessage}`);
//     }
//   };

//   const handleDeleteUpdateRequest = async (requestId) => {
//     if (!window.confirm('Are you sure you want to delete this update request?')) return;
    
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/api/volunteers/${volunteer._id}/update-request/${requestId}`
//       );
      
//       if (response.data.success) {
//         setUpdateRequests(prev => prev.filter(req => req._id !== requestId));
//         alert('Update request deleted successfully!');
//       }
//     } catch (error) {
//       console.error('Error deleting update request:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
//       alert(`Failed to delete update request: ${errorMessage}`);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('volunteer');
//     localStorage.removeItem('volunteerToken');
//     localStorage.removeItem('isLoggedIn');
//     navigate('/volunteer-login');
//   };

//   const handleInputChange = (field, value) => {
//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');
//       setUpdateRequestData(prev => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value }
//       }));
//     } else {
//       setUpdateRequestData(prev => ({ ...prev, [field]: value }));
//     }
//   };

//   const handleArrayChange = (field, value, isChecked) => {
//     setUpdateRequestData(prev => ({
//       ...prev,
//       [field]: isChecked 
//         ? [...prev[field], value]
//         : prev[field].filter(item => item !== value)
//     }));
//   };

//   const handleAvailabilityChange = (type, value, isChecked) => {
//     setUpdateRequestData(prev => ({
//       ...prev,
//       availability: {
//         ...prev.availability,
//         [type]: isChecked 
//           ? [...prev.availability[type], value]
//           : prev.availability[type].filter(item => item !== value)
//       }
//     }));
//   };

//   const requestNotificationPermission = () => {
//     if (Notification.permission === 'default') {
//       Notification.requestPermission().then(permission => {
//         if (permission === 'granted') {
//           alert('Notifications enabled! You will now receive alerts for new announcements.');
//         }
//       });
//     } else if (Notification.permission === 'granted') {
//       alert('Notifications are already enabled!');
//     } else {
//       alert('Notifications are blocked. Please enable them in your browser settings.');
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading dashboard...</div>;
//   }

//   if (error) {
//     return <div className="error">{error}</div>;
//   }

//   return (
//     <div className="volunteer-dashboard">
//       {/* Header */}
//       <div className="dashboard-header">
//         <div className="header-content">
//           <h1>Non-Helpline Volunteer Dashboard</h1>
//           <div className="header-actions">
//             <button 
//               className={`notification-btn ${hasNewAnnouncement ? 'has-notification' : ''}`}
//               onClick={() => {
//                 setIsAnnouncementModalOpen(true);
//                 setHasNewAnnouncement(false);
//               }}
//             >
//               📢 Announcements {hasNewAnnouncement && <span className="notification-dot"></span>}
//             </button>
//             <button onClick={requestNotificationPermission} className="enable-notifications-btn">
//               🔔 Enable Notifications
//             </button>
//             <button onClick={handleLogout} className="logout-btn">Logout</button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="dashboard-content">
//         {/* Profile Section */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2>Profile Information</h2>
//             <span className="live-badge">Live Updates</span>
//             <button 
//               onClick={() => setShowUpdateForm(true)}
//               className="btn btn-primary"
//               disabled={updateRequests.length > 0}
//               title={updateRequests.length > 0 ? "Cannot submit new request while previous one is pending" : ""}
//             >
//               Request Profile Update
//             </button>
//           </div>
//           <div className="profile-info">
//             <div className="info-row">
//               <span className="label">Name:</span>
//               <span className="value">{volunteer?.fullName}</span>
//             </div>
//             <div className="info-row">
//               <span className="label">Email:</span>
//               <span className="value">{volunteer?.email}</span>
//             </div>
//             <div className="info-row">
//               <span className="label">Phone:</span>
//               <span className="value">{volunteer?.phone}</span>
//             </div>
//             <div className="info-row">
//               <span className="label">Type:</span>
//               <span className="value">Non-Helpline Volunteer</span>
//             </div>
//             <div className="info-row">
//               <span className="label">Status:</span>
//               <span className={`status-badge ${volunteer?.status || (volunteer?.isApproved ? 'approved' : 'pending')}`}>
//                 {volunteer?.status || (volunteer?.isApproved ? 'approved' : 'pending')}
//               </span>
//             </div>
//             <div className="info-row">
//               <span className="label">Volunteer Roles:</span>
//               <span className="value">{volunteer?.volunteerRoles?.join(', ') || 'Not specified'}</span>
//             </div>
//             {volunteer?.lastLogin && (
//               <div className="info-row">
//                 <span className="label">Last Login:</span>
//                 <span className="value">{new Date(volunteer.lastLogin).toLocaleString()}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Update Requests Section */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2>Update Requests</h2>
//             <span className="live-badge">Live Updates</span>
//           </div>
//           <div className="update-requests">
//             {updateRequests.length === 0 ? (
//               <p>No pending update requests</p>
//             ) : (
//               <div className="requests-table">
//                 {updateRequests.map(request => (
//                   <div key={request._id} className="request-item">
//                     <div className="request-info">
//                       <div className="request-status">
//                         Status: <span className={`status ${request.status}`}>{request.status}</span>
//                       </div>
//                       <div className="request-date">
//                         Submitted: {new Date(request.createdAt).toLocaleDateString()}
//                       </div>
//                       {request.adminResponse && (
//                         <div className="admin-response">
//                           Admin Response: {request.adminResponse}
//                         </div>
//                       )}
//                     </div>
//                     <button 
//                       onClick={() => handleDeleteUpdateRequest(request._id)}
//                       className="btn btn-danger btn-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Activities Section */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2>My Activities</h2>
//             <div className="filter-section">
//               <select 
//                 value={categoryFilter} 
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 className="category-filter"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="activities-table">
//             {filteredActivities.length === 0 ? (
//               <p>No activities found</p>
//             ) : (
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Title</th>
//                     <th>Category</th>
//                     <th>Date</th>
//                     <th>Status</th>
//                     <th>Description</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredActivities.map(activity => (
//                     <tr key={activity._id}>
//                       <td>{activity.title}</td>
//                       <td>{activity.category}</td>
//                       <td>{new Date(activity.date).toLocaleDateString()}</td>
//                       <td>
//                         <span className={`status ${activity.status}`}>
//                           {activity.status}
//                         </span>
//                       </td>
//                       <td>{activity.description}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Update Form Modal */}
//       {showUpdateForm && (
//         <div className="modal-overlay">
//           <div className="modal-content large-modal">
//             <div className="modal-header">
//               <h2>Request Profile Update</h2>
//               <button 
//                 onClick={() => setShowUpdateForm(false)}
//                 className="close-btn"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               <div className="form-group">
//                 <label>Full Name:</label>
//                 <input
//                   type="text"
//                   value={updateRequestData.fullName}
//                   onChange={(e) => handleInputChange('fullName', e.target.value)}
//                   placeholder={volunteer?.fullName}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Email:</label>
//                 <input
//                   type="email"
//                   value={updateRequestData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   placeholder={volunteer?.email}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Phone:</label>
//                 <input
//                   type="tel"
//                   value={updateRequestData.phone}
//                   onChange={(e) => handleInputChange('phone', e.target.value)}
//                   placeholder={volunteer?.phone}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Date of Birth:</label>
//                 <input
//                   type="date"
//                   value={updateRequestData.dob}
//                   onChange={(e) => handleInputChange('dob', e.target.value)}
//                 />
//               </div>

//               <div className="form-section">
//                 <h3>Address</h3>
//                 <div className="form-group">
//                   <label>Street:</label>
//                   <input
//                     type="text"
//                     value={updateRequestData.address.street}
//                     onChange={(e) => handleInputChange('address.street', e.target.value)}
//                     placeholder={volunteer?.address?.street}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>City:</label>
//                   <input
//                     type="text"
//                     value={updateRequestData.address.city}
//                     onChange={(e) => handleInputChange('address.city', e.target.value)}
//                     placeholder={volunteer?.address?.city}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>State:</label>
//                   <input
//                     type="text"
//                     value={updateRequestData.address.state}
//                     onChange={(e) => handleInputChange('address.state', e.target.value)}
//                     placeholder={volunteer?.address?.state}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Postal Code:</label>
//                   <input
//                     type="text"
//                     value={updateRequestData.address.postalCode}
//                     onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
//                     placeholder={volunteer?.address?.postalCode}
//                   />
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h3>Volunteer Roles</h3>
//                 <div className="checkbox-group">
//                   {categories.map(category => (
//                     <label key={category} className="checkbox-item">
//                       <input
//                         type="checkbox"
//                         checked={updateRequestData.volunteerRoles.includes(category)}
//                         onChange={(e) => handleArrayChange('volunteerRoles', category, e.target.checked)}
//                       />
//                       {category}
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h3>Availability</h3>
//                 <div className="availability-section">
//                   <h4>Days</h4>
//                   <div className="checkbox-group">
//                     {daysOfWeek.map(day => (
//                       <label key={day} className="checkbox-item">
//                         <input
//                           type="checkbox"
//                           checked={updateRequestData.availability.days.includes(day)}
//                           onChange={(e) => handleAvailabilityChange('days', day, e.target.checked)}
//                         />
//                         {day}
//                       </label>
//                     ))}
//                   </div>
//                   <h4>Times</h4>
//                   <div className="checkbox-group">
//                     {timeSlots.map(time => (
//                       <label key={time} className="checkbox-item">
//                         <input
//                           type="checkbox"
//                           checked={updateRequestData.availability.times.includes(time)}
//                           onChange={(e) => handleAvailabilityChange('times', time, e.target.checked)}
//                         />
//                         {time}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h3>Additional Information</h3>
//                 <div className="form-group">
//                   <label>Why do you want to volunteer?</label>
//                   <textarea
//                     value={updateRequestData.additionalInfo.whyVolunteer}
//                     onChange={(e) => handleInputChange('additionalInfo.whyVolunteer', e.target.value)}
//                     rows="3"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Skills and Experience:</label>
//                   <textarea
//                     value={updateRequestData.additionalInfo.skillsExperience}
//                     onChange={(e) => handleInputChange('additionalInfo.skillsExperience', e.target.value)}
//                     rows="3"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Other Non-Helpline Experience:</label>
//                   <textarea
//                     value={updateRequestData.additionalInfo.otherNonHelpline}
//                     onChange={(e) => handleInputChange('additionalInfo.otherNonHelpline', e.target.value)}
//                     rows="2"
//                   />
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h3>Consent & Agreements</h3>
//                 <div className="checkbox-group">
//                   <label className="checkbox-item">
//                     <input
//                       type="checkbox"
//                       checked={updateRequestData.consent.agreePolicy}
//                       onChange={(e) => handleInputChange('consent.agreePolicy', e.target.checked)}
//                     />
//                     I agree to the policy and guidelines
//                   </label>
//                   <label className="checkbox-item">
//                     <input
//                       type="checkbox"
//                       checked={updateRequestData.consent.consentContact}
//                       onChange={(e) => handleInputChange('consent.consentContact', e.target.checked)}
//                     />
//                     I consent to be contacted by the organization
//                   </label>
//                   <label className="checkbox-item">
//                     <input
//                       type="checkbox"
//                       checked={updateRequestData.consent.confirmInfo}
//                       onChange={(e) => handleInputChange('consent.confirmInfo', e.target.checked)}
//                     />
//                     I confirm that all information provided is accurate
//                   </label>
//                   <label className="checkbox-item">
//                     <input
//                       type="checkbox"
//                       checked={updateRequestData.consent.cyberLawConsent}
//                       onChange={(e) => handleInputChange('consent.cyberLawConsent', e.target.checked)}
//                     />
//                     I understand and agree to cyber law compliance
//                   </label>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button onClick={() => setShowUpdateForm(false)} className="btn btn-secondary">
//                 Cancel
//               </button>
//               <button onClick={handleUpdateRequest} className="btn btn-primary">
//                 Submit Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Announcements Modal */}
//       {isAnnouncementModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content large-modal">
//             <div className="modal-header">
//               <h2>{selectedAnnouncement ? selectedAnnouncement.title : 'Announcements'}</h2>
//               <button 
//                 onClick={() => {
//                   setIsAnnouncementModalOpen(false);
//                   setSelectedAnnouncement(null);
//                 }}
//                 className="close-btn"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               {selectedAnnouncement ? (
//                 <div className="announcement-detail">
//                   <div className="announcement-header">
//                     <h3>{selectedAnnouncement.title}</h3>
//                     <span className="announcement-date">
//                       {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="announcement-content">
//                     <p>{selectedAnnouncement.content}</p>
//                     {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
//                       <div className="announcement-attachments">
//                         <h4>Attachments:</h4>
//                         <ul>
//                           {selectedAnnouncement.attachments.map((attachment, index) => (
//                             <li key={index}>
//                               <a href={attachment.url} target="_blank" rel="noopener noreferrer">
//                                 {attachment.name || `Attachment ${index + 1}`}
//                               </a>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                   <div className="modal-footer">
//                     <button 
//                       onClick={() => setSelectedAnnouncement(null)} 
//                       className="btn btn-secondary"
//                     >
//                       Back to List
//                     </button>
//                   </div>
//                 </div>
//               ) : announcements.length === 0 ? (
//                 <p>No announcements available</p>
//               ) : (
//                 <div className="announcements-list">
//                   {announcements.map(announcement => (
//                     <div 
//                       key={announcement._id} 
//                       className="announcement-item"
//                       onClick={() => setSelectedAnnouncement(announcement)}
//                       role="button"
//                       tabIndex={0}
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter' || e.key === ' ') {
//                           setSelectedAnnouncement(announcement);
//                         }
//                       }}
//                     >
//                       <div className="announcement-header">
//                         <h3>{announcement.title}</h3>
//                         <span className="announcement-date">
//                           {new Date(announcement.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div className="announcement-content">
//                         <p>{announcement.content.substring(0, 100)}...</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             {!selectedAnnouncement && (
//               <div className="modal-footer">
//                 <button 
//                   onClick={() => setIsAnnouncementModalOpen(false)} 
//                   className="btn btn-secondary"
//                 >
//                   Close
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NonHelplineVolunteerDashboard;



















import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import "./CSS/NonHelplineVolunteerDashboard.css";

const NonHelplineVolunteerDashboard = () => {
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);
  const [lastAnnouncementCheck, setLastAnnouncementCheck] = useState(new Date());
  

  
  const [updateRequests, setUpdateRequests] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateRequestData, setUpdateRequestData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: ''
    },
    volunteerRoles: [],
    availability: {
      days: [],
      times: []
    },
    additionalInfo: {
      whyVolunteer: '',
      skillsExperience: '',
      otherNonHelpline: ''
    },
    consent: {
      agreePolicy: false,
      consentContact: false,
      confirmInfo: false,
      cyberLawConsent: false
    }
  });

  
  const [activities, setActivities] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredActivities, setFilteredActivities] = useState([]);
  

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  

  const socketRef = useRef(null);
  const navigate = useNavigate();
  
  const categories = [
    'Event Support', 'Fundraising', 'Community Outreach', 'Campus Ambassador',
    'Social Media & Digital Promotion', 'Content Writing / Blogging',
    'Graphic Design / Creative Support', 'Technical Support (e.g., IT, website)',
    'Translation / Language Support', 'Photography / Videography',
    'Mentorship / Training', 'Case Follow-up Coordinator',
    'Crisis Response Assistant', 'Resource & Referral Assistant'
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '12:00 AM - 4:00 AM',
    '4:00 AM - 8:00 AM',
    '8:00 AM - 12:00 PM',
    '12:00 PM - 4:00 PM',
    '4:00 PM - 8:00 PM',
    '8:00 PM - 12:00 AM'
  ];


  
  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification('Non-Helpline Volunteer Portal', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  useEffect(() => {
    const volunteerData = JSON.parse(localStorage.getItem('volunteer') || '{}');
    if (!volunteerData._id) {
      navigate('/volunteer-login');
      return;
    }
    if (volunteerData.volunteerType !== 'non-helpline') {
      navigate('/volunteer-dashboard');
      return;
    }
    setVolunteer(volunteerData);
    fetchVolunteerData(volunteerData._id);
    setupRealTimeUpdates(volunteerData._id);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [navigate]);

  useEffect(() => {
    if (categoryFilter === '') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter(activity => 
        activity.category === categoryFilter
      ));
    }
  }, [activities, categoryFilter]);


  
  const setupRealTimeUpdates = (volunteerId) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

 
    
    socketRef.current = io('http://localhost:5000', {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Non-helpline volunteer connected to server');
      socket.emit('joinVolunteerRoom', volunteerId);
      socket.emit('joinAnnouncementRoom');
      socket.emit('joinUpdateRequestRoom');
      socket.emit('joinRoom', `volunteer_${volunteerId}`);
      socket.emit('joinRoom', 'volunteerRoom');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });



    // Real-time listeners
    socket.on('volunteerUpdated', (updatedVolunteer) => {
      if (updatedVolunteer._id === volunteerId) {
        setVolunteer(updatedVolunteer);
        localStorage.setItem('volunteer', JSON.stringify(updatedVolunteer));
        setUpdateRequestData({
          fullName: updatedVolunteer.fullName || '',
          email: updatedVolunteer.email || '',
          phone: updatedVolunteer.phone || '',
          dob: updatedVolunteer.dob || '',
          address: {
            street: updatedVolunteer.address?.street || '',
            city: updatedVolunteer.address?.city || '',
            state: updatedVolunteer.address?.state || '',
            postalCode: updatedVolunteer.address?.postalCode || ''
          },
          volunteerRoles: updatedVolunteer.volunteerRoles || [],
          availability: {
            days: updatedVolunteer.availability?.days || [],
            times: updatedVolunteer.availability?.times || []
          },
          additionalInfo: {
            whyVolunteer: updatedVolunteer.additionalInfo?.whyVolunteer || '',
            skillsExperience: updatedVolunteer.additionalInfo?.skillsExperience || '',
            otherNonHelpline: updatedVolunteer.additionalInfo?.otherNonHelpline || ''
          },
          consent: {
            agreePolicy: updatedVolunteer.consent?.agreePolicy || false,
            consentContact: updatedVolunteer.consent?.consentContact || false,
            confirmInfo: updatedVolunteer.consent?.confirmInfo || false,
            cyberLawConsent: updatedVolunteer.consent?.cyberLawConsent || false
          }
        });
      }
    });

    socket.on('newAnnouncement', (announcement) => {
      console.log('New announcement received:', announcement);
      setAnnouncements((prev) => {
        if (!prev.some(a => a._id === announcement._id)) {
          return [announcement, ...prev];
        }
        return prev;
      });
      setHasNewAnnouncement(true);
      setLastAnnouncementCheck(new Date());
      showNotification(`New announcement: ${announcement.title}`);
    });

    socket.on('newUpdateRequest', (updateRequest) => {
      if (updateRequest.volunteerId === volunteerId || updateRequest.volunteerId?._id === volunteerId) {
        setUpdateRequests((prev) => {
          if (!prev.some(req => req._id === updateRequest._id)) {
            return [...prev, { ...updateRequest, status: 'pending' }];
          }
          return prev;
        });
      }
    });

    socket.on('updateRequestApproved', (data) => {
      console.log('Update request approved:', data);
      const requestId = data.requestId || data.reqId || data._id;
      const volId = data.volunteerId?._id || data.volunteerId;
      if (volId === volunteerId && requestId) {
        setUpdateRequests((prev) => prev.filter((r) => r._id !== requestId));
        alert('Your profile update request has been approved!');
        fetchVolunteerData(volunteerId);
      }
    });

    socket.on('updateRequestRejected', (data) => {
      console.log('Update request rejected:', data);
      const requestId = data.requestId || data.reqId || data._id;
      const volId = data.volunteerId?._id || data.volunteerId;
      if (volId === volunteerId && requestId) {
        setUpdateRequests((prev) => prev.filter((r) => r._id !== requestId));
        alert(`Your profile update request has been rejected. Reason: ${data.reason || data.message || 'No reason provided'}`);
      }
    });

    socket.on('updateRequestDeleted', (data) => {
      console.log('Update request deleted:', data);
      const requestId = data.requestId || data.reqId || data._id;
      const volId = data.volunteerId?._id || data.volunteerId;
      if (volId === volunteerId && requestId) {
        setUpdateRequests((prev) => prev.filter((r) => r._id !== requestId));
      }
    });

    socket.on('newActivity', (activity) => {
      if (activity.volunteerId === volunteerId) {
        setActivities((prev) => [...prev, activity]);
      }
    });

    return socket;
  };



  
  const fetchVolunteerData = async (volunteerId) => {
    try {
      setLoading(true);
      const [profileRes, requestsRes, announcementsRes, activitiesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}`),
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/update-requests`),
        axios.get('http://localhost:5000/api/announcements'),
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/activities`)
      ]);

 
      
      if (profileRes.data.success) {
        const updatedVolunteer = profileRes.data.data;
        setVolunteer(updatedVolunteer);
        localStorage.setItem('volunteer', JSON.stringify(updatedVolunteer));
        
  
        
        setUpdateRequestData({
          fullName: updatedVolunteer.fullName || '',
          email: updatedVolunteer.email || '',
          phone: updatedVolunteer.phone || '',
          dob: updatedVolunteer.dob || '',
          address: {
            street: updatedVolunteer.address?.street || '',
            city: updatedVolunteer.address?.city || '',
            state: updatedVolunteer.address?.state || '',
            postalCode: updatedVolunteer.address?.postalCode || ''
          },
          volunteerRoles: updatedVolunteer.volunteerRoles || [],
          availability: {
            days: updatedVolunteer.availability?.days || [],
            times: updatedVolunteer.availability?.times || []
          },
          additionalInfo: {
            whyVolunteer: updatedVolunteer.additionalInfo?.whyVolunteer || '',
            skillsExperience: updatedVolunteer.additionalInfo?.skillsExperience || '',
            otherNonHelpline: updatedVolunteer.additionalInfo?.otherNonHelpline || ''
          },
          consent: {
            agreePolicy: updatedVolunteer.consent?.agreePolicy || false,
            consentContact: updatedVolunteer.consent?.consentContact || false,
            confirmInfo: updatedVolunteer.consent?.confirmInfo || false,
            cyberLawConsent: updatedVolunteer.consent?.cyberLawConsent || false
          }
        });
      }

      if (requestsRes.data.success) {
        setUpdateRequests(requestsRes.data.data);
      }


      // Update announcements data - sort by date, newest first
      if (announcementsRes.data.success) {
        const sortedAnnouncements = (announcementsRes.data.data || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAnnouncements(sortedAnnouncements);
      }

      if (activitiesRes.data.success) {
        setActivities(activitiesRes.data.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
      setError('Error loading dashboard data');
      setLoading(false);
    }
  };




  // Update request submission
  const handleUpdateRequest = async () => {
    if (updateRequests.length > 0) {
      alert('Cannot submit new request while previous one is pending approval or rejection.');
      return;
    }
    try {
      console.log('Submitting update request for non-helpline volunteer:', volunteer._id);
      
 
      const requestData = {
        fullName: updateRequestData.fullName,
        email: updateRequestData.email,
        phone: updateRequestData.phone,
        dob: updateRequestData.dob,
        address: {
          street: updateRequestData.address?.street || '',
          city: updateRequestData.address?.city || '',
          state: updateRequestData.address?.state || '',
          postalCode: updateRequestData.address?.postalCode || ''
        },
        additionalInfo: {
          whyVolunteer: updateRequestData.additionalInfo?.whyVolunteer || '',
          skillsExperience: updateRequestData.additionalInfo?.skillsExperience || '',
          otherNonHelpline: updateRequestData.additionalInfo?.otherNonHelpline || ''
        },
        consent: {
          agreePolicy: updateRequestData.consent?.agreePolicy || false,
          consentContact: updateRequestData.consent?.consentContact || false,
          confirmInfo: updateRequestData.consent?.confirmInfo || false,
          cyberLawConsent: updateRequestData.consent?.cyberLawConsent || false
        },
        availability: {
          days: updateRequestData.availability?.days || [],
          times: updateRequestData.availability?.times || []
        },
        volunteerRoles: updateRequestData.volunteerRoles || []
      };

      const response = await axios.post(
        `http://localhost:5000/api/volunteers/${volunteer._id}/update-request`,
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
      
      if (response.data.success) {
        alert('Update request submitted successfully! Please wait for admin approval.');
        setShowUpdateForm(false);
      }
    } catch (error) {
      console.error('Error submitting update request:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to submit update request: ${errorMessage}`);
    }
  };

  const handleDeleteUpdateRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this update request?')) return;
    
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/volunteers/${volunteer._id}/update-request/${requestId}`
      );
      
      if (response.data.success) {
        setUpdateRequests(prev => prev.filter(req => req._id !== requestId));
        alert('Update request deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting update request:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to delete update request: ${errorMessage}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('volunteer');
    localStorage.removeItem('volunteerToken');
    localStorage.removeItem('isLoggedIn');
    navigate('/volunteer-login');
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUpdateRequestData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setUpdateRequestData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayChange = (field, value, isChecked) => {
    setUpdateRequestData(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleAvailabilityChange = (type, value, isChecked) => {
    setUpdateRequestData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [type]: isChecked 
          ? [...prev.availability[type], value]
          : prev.availability[type].filter(item => item !== value)
      }
    }));
  };

  const requestNotificationPermission = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          alert('Notifications enabled! You will now receive alerts for new announcements.');
        }
      });
    } else if (Notification.permission === 'granted') {
      alert('Notifications are already enabled!');
    } else {
      alert('Notifications are blocked. Please enable them in your browser settings.');
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="volunteer-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {volunteer.fullName}!</h1>
          <p className="volunteer-type">Non-Helpline Volunteer</p>
          <div className="header-actions">
            <button 
              className={`notification-btn ${hasNewAnnouncement ? 'has-notification' : ''}`}
              onClick={() => {
                setIsAnnouncementModalOpen(true);
                setHasNewAnnouncement(false);
              }}
            >
              📢 Announcements {hasNewAnnouncement && <span className="notification-dot"></span>}
            </button>
            <button onClick={requestNotificationPermission} className="enable-notifications-btn">
              🔔 Enable Notifications
            </button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>




      <div className="dashboard-content">
        {/* Profile Section */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Profile Information</h2>
            {/* <span className="live-badge">Live Updates</span> */}
            <button 
              onClick={() => setShowUpdateForm(true)}
              className="btn btn-primary"
              disabled={updateRequests.length > 0}
              title={updateRequests.length > 0 ? "Cannot submit new request while previous one is pending" : ""}
            >
              Request Profile Update
            </button>
          </div>
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{volunteer?.fullName}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{volunteer?.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Phone:</span>
              <span className="value">{volunteer?.phone}</span>
            </div>
            <div className="info-row">
              <span className="label">Type:</span>
              <span className="value">Non-Helpline Volunteer</span>
            </div>
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`status-badge ${volunteer?.status || (volunteer?.isApproved ? 'approved' : 'pending')}`}>
                {volunteer?.status || (volunteer?.isApproved ? 'approved' : 'pending')}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Volunteer Roles:</span>
              <span className="value">{volunteer?.volunteerRoles?.join(', ') || 'Not specified'}</span>
            </div>
            {volunteer?.lastLogin && (
              <div className="info-row">
                <span className="label">Last Login:</span>
                <span className="value">{new Date(volunteer.lastLogin).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>



        {/* Update Requests Section */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Update Requests</h2>
            {/* <span className="live-badge">Live Updates</span> */}
          </div>
          <div className="update-requests">
            {updateRequests.length === 0 ? (
              <p>No pending update requests</p>
            ) : (
              <div className="requests-table">
                {updateRequests.map(request => (
                  <div key={request._id} className="request-item">
                    <div className="request-info">
                      <div className="request-status">
                        Status: <span className={`status ${request.status}`}>{request.status}</span>
                      </div>
                      <div className="request-date">
                        Submitted: {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      {request.adminResponse && (
                        <div className="admin-response">
                          Admin Response: {request.adminResponse}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDeleteUpdateRequest(request._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>





        {/* Activities Section */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>My Activities</h2>
            <div className="filter-section">
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="category-filter"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="activities-table">
            {filteredActivities.length === 0 ? (
              <p>No activities found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map(activity => (
                    <tr key={activity._id}>
                      <td>{activity.title}</td>
                      <td>{activity.category}</td>
                      <td>{new Date(activity.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${activity.status}`}>
                          {activity.status}
                        </span>
                      </td>
                      <td>{activity.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>




      {/* Update Form Modal */}
      {showUpdateForm && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>Request Profile Update</h2>
              <button 
                onClick={() => setShowUpdateForm(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  value={updateRequestData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder={volunteer?.fullName}
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={updateRequestData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={volunteer?.email}
                />
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={updateRequestData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={volunteer?.phone}
                />
              </div>

              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  value={updateRequestData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                />
              </div>

              <div className="form-section">
                <h3>Address</h3>
                <div className="form-group">
                  <label>Street:</label>
                  <input
                    type="text"
                    value={updateRequestData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    placeholder={volunteer?.address?.street}
                  />
                </div>
                <div className="form-group">
                  <label>City:</label>
                  <input
                    type="text"
                    value={updateRequestData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    placeholder={volunteer?.address?.city}
                  />
                </div>
                <div className="form-group">
                  <label>State:</label>
                  <input
                    type="text"
                    value={updateRequestData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    placeholder={volunteer?.address?.state}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code:</label>
                  <input
                    type="text"
                    value={updateRequestData.address.postalCode}
                    onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                    placeholder={volunteer?.address?.postalCode}
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Volunteer Roles</h3>
                <div className="checkbox-group">
                  {categories.map(category => (
                    <label key={category} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={updateRequestData.volunteerRoles.includes(category)}
                        onChange={(e) => handleArrayChange('volunteerRoles', category, e.target.checked)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Availability</h3>
                <div className="availability-section">
                  <h4>Days</h4>
                  <div className="checkbox-group">
                    {daysOfWeek.map(day => (
                      <label key={day} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={updateRequestData.availability.days.includes(day)}
                          onChange={(e) => handleAvailabilityChange('days', day, e.target.checked)}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                  <h4>Times</h4>
                  <div className="checkbox-group">
                    {timeSlots.map(time => (
                      <label key={time} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={updateRequestData.availability.times.includes(time)}
                          onChange={(e) => handleAvailabilityChange('times', time, e.target.checked)}
                        />
                        {time}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Additional Information</h3>
                <div className="form-group">
                  <label>Why do you want to volunteer?</label>
                  <textarea
                    value={updateRequestData.additionalInfo.whyVolunteer}
                    onChange={(e) => handleInputChange('additionalInfo.whyVolunteer', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Skills and Experience:</label>
                  <textarea
                    value={updateRequestData.additionalInfo.skillsExperience}
                    onChange={(e) => handleInputChange('additionalInfo.skillsExperience', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Other Non-Helpline Experience:</label>
                  <textarea
                    value={updateRequestData.additionalInfo.otherNonHelpline}
                    onChange={(e) => handleInputChange('additionalInfo.otherNonHelpline', e.target.value)}
                    rows="2"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Consent & Agreements</h3>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={updateRequestData.consent.agreePolicy}
                      onChange={(e) => handleInputChange('consent.agreePolicy', e.target.checked)}
                    />
                    I agree to the policy and guidelines
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={updateRequestData.consent.consentContact}
                      onChange={(e) => handleInputChange('consent.consentContact', e.target.checked)}
                    />
                    I consent to be contacted by the organization
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={updateRequestData.consent.confirmInfo}
                      onChange={(e) => handleInputChange('consent.confirmInfo', e.target.checked)}
                    />
                    I confirm that all information provided is accurate
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={updateRequestData.consent.cyberLawConsent}
                      onChange={(e) => handleInputChange('consent.cyberLawConsent', e.target.checked)}
                    />
                    I understand and agree to cyber law compliance
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowUpdateForm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleUpdateRequest} className="btn btn-primary">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements Modal */}
      {isAnnouncementModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>{selectedAnnouncement ? selectedAnnouncement.title : 'Announcements'}</h2>
              <button 
                onClick={() => {
                  setIsAnnouncementModalOpen(false);
                  setSelectedAnnouncement(null);
                }}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {selectedAnnouncement ? (
                <div className="announcement-detail">
                  <div className="announcement-header">
                    <h3>{selectedAnnouncement.title}</h3>
                    <span className="announcement-date">
                      {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="announcement-content">
                    <p>{selectedAnnouncement.content}</p>
                    {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                      <div className="announcement-attachments">
                        <h4>Attachments:</h4>
                        <ul>
                          {selectedAnnouncement.attachments.map((attachment, index) => (
                            <li key={index}>
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                {attachment.name || `Attachment ${index + 1}`}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button 
                      onClick={() => setSelectedAnnouncement(null)} 
                      className="btn btn-secondary"
                    >
                      Back to List
                    </button>
                  </div>
                </div>
              ) : announcements.length === 0 ? (
                <p>No announcements available</p>
              ) : (
                <div className="announcements-list">
                  {announcements.map(announcement => (
                    <div 
                      key={announcement._id} 
                      className="announcement-item"
                      onClick={() => setSelectedAnnouncement(announcement)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedAnnouncement(announcement);
                        }
                      }}
                    >
                      <div className="announcement-header">
                        <h3>{announcement.title}</h3>
                        <span className="announcement-date">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="announcement-content">
                        <p>{announcement.content.substring(0, 100)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {!selectedAnnouncement && (
              <div className="modal-footer">
                <button 
                  onClick={() => setIsAnnouncementModalOpen(false)} 
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NonHelplineVolunteerDashboard;
