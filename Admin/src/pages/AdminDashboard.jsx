








// import React, { useState, useMemo, useEffect, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { io } from "socket.io-client";
// import "./CSS/AdminDashboard.css";

// const fixedTimeSlots = [
//   "12:00 AM – 4:00 AM",
//   "4:00 AM – 8:00 AM",
//   "8:00 AM – 12:00 PM",
//   "12:00 PM – 4:00 PM",
//   "4:00 PM – 8:00 PM",
//   "8:00 PM – 12:00 AM",
// ];

// // SectionHeader Component
// function SectionHeader({ title, notification, onClick }) {
//   return (
//     <div className="section-header" onClick={onClick} style={{ cursor: "pointer" }}>
//       <h2>
//         {title} {notification && <span className="notification-dot" />}
//       </h2>
//     </div>
//   );
// }

// // Card Component
// const Card = ({ title, value }) => (
//   <div className="card">
//     <h3>{title}</h3>
//     <p>{value}</p>
//   </div>
// );

// // Approval Requests Table
// const Table = ({ title, data, onApprove, onReject, onView, onDelete }) => (
//   <div className="table-section">
//     <h2>{title}</h2>
//     <table>
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Email</th>
//           <th>Phone</th>
//           <th>Status</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.length === 0 ? (
//           <tr>
//             <td colSpan="5">No data available</td>
//           </tr>
//         ) : (
//           data.map((vol) => (
//             <tr key={vol._id}>
//               <td>{vol.fullName}</td>
//               <td>{vol.email}</td>
//               <td>{vol.phone}</td>
//               <td>
//                 <span className={`status-badge ${vol.status}`}>{vol.status}</span>
//               </td>
//               <td>
//                 <button onClick={() => onView(vol)}>Info</button>
//                 {vol.status !== "approved" && (
//                   <button onClick={() => onApprove(vol._id)}>Approve</button>
//                 )}
//                 {vol.status !== "rejected" && (
//                   <button onClick={() => onReject(vol._id)}>Reject</button>
//                 )}
//                 <button onClick={() => onDelete(vol._id)}>Delete</button>
//               </td>
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   </div>
// );

// // SearchableVolunteerTable Component
// const SearchableVolunteerTable = ({
//   title,
//   volunteers,
//   onApprove,
//   onReject,
//   onDelete,
//   onView,
//   showCallStats,
// }) => {
//   const [searchName, setSearchName] = useState("");
//   const [searchSlot, setSearchSlot] = useState("");
//   const [searchCategory, setSearchCategory] = useState("");
//   const [searchDays, setSearchDays] = useState([]);

//   const categories = [
//     "Event Support",
//     "Fundraising",
//     "Community Outreach",
//     "Campus Ambassador",
//     "Social Media & Digital Promotion",
//     "Content Writing / Blogging",
//     "Graphic Design / Creative Support",
//     "Technical Support (e.g., IT, website)",
//     "Translation / Language Support",
//     "Photography / Videography",
//     "Mentorship / Training",
//     "Case Follow-up Coordinator",
//     "Crisis Response Assistant",
//     "Resource & Referral Assistant",
//   ];

//   const weekDays = [
//     "Saturday",
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//   ];

//   const handleDayChange = (day) => {
//     setSearchDays((prev) =>
//       prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
//     );
//   };

//   const filteredVolunteers = useMemo(
//     () =>
//       volunteers.filter((v) => {
//         const nameMatch = v.fullName.toLowerCase().includes(searchName.toLowerCase());
//         const slotMatch =
//           searchSlot === "" || (v.availability?.times && v.availability.times.some((slot) => slot === searchSlot));
//         const categoryMatch =
//           searchCategory === "" ||
//           (v.volunteerRoles && v.volunteerRoles.some((interest) => interest === searchCategory));
//         const dayMatch =
//           searchDays.length === 0 || (v.availability?.days && searchDays.every((day) => v.availability.days.includes(day)));

//         return nameMatch && slotMatch && categoryMatch && dayMatch;
//       }),
//     [volunteers, searchName, searchSlot, searchCategory, searchDays]
//   );

//   const uniqueNames = [...new Set(volunteers.map((v) => v.fullName))];

//   return (
//     <div className="table-section">
//       <h2>{title}</h2>
//       <div className="search-filters">
//         <input
//           list={`${title}-names`}
//           placeholder="Search by name"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//         />
//         <datalist id={`${title}-names`}>
//           {uniqueNames.map((n) => (
//             <option key={n} value={n} />
//           ))}
//         </datalist>

//         {title === "Helpline Volunteers" ? (
//           <>
//             <input
//               list={`${title}-slots`}
//               placeholder="Search by time slot"
//               value={searchSlot}
//               onChange={(e) => setSearchSlot(e.target.value)}
//             />
//             <datalist id={`${title}-slots`}>
//               {fixedTimeSlots.map((s) => (
//                 <option key={s} value={s} />
//               ))}
//             </datalist>
//           </>
//         ) : (
//           <>
//             <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
//               <option value="">All Categories</option>
//               {categories.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//           </>
//         )}

//         <div className="day-filter">
//           <span>Search by days: </span>
//           {weekDays.map((day) => (
//             <label key={day} style={{ marginRight: "10px" }}>
//               <input
//                 type="checkbox"
//                 checked={searchDays.includes(day)}
//                 onChange={() => handleDayChange(day)}
//               />
//               {day}
//             </label>
//           ))}
//         </div>
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Status</th>
//             {showCallStats && (
//               <>
//                 <th>Accepted Calls</th>
//                 <th>Rejected Calls</th>
//               </>
//             )}
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredVolunteers.length === 0 ? (
//             <tr>
//               <td colSpan={showCallStats ? "7" : "5"}>No volunteers found</td>
//             </tr>
//           ) : (
//             filteredVolunteers.map((vol) => (
//               <tr key={vol._id}>
//                 <td>{vol.fullName}</td>
//                 <td>{vol.email}</td>
//                 <td>{vol.phone}</td>
//                 <td>
//                   <span className={`status-badge ${vol.status}`}>{vol.status}</span>
//                 </td>
//                 {showCallStats && (
//                   <>
//                     <td>{vol.acceptedCalls || 0}</td>
//                     <td>{vol.rejectedCalls || 0}</td>
//                   </>
//                 )}
//                 <td>
//                   <button onClick={() => onView(vol)}>Info</button>
//                   {vol.status !== "approved" && (
//                     <button onClick={() => onApprove(vol._id)}>Approve</button>
//                   )}
//                   <Link to={`/update-volunteer/${vol._id}`}>Update</Link>
//                   <button onClick={() => onDelete(vol._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // CallTable Component
// const CallTable = ({ title, data, filterDate, setFilterDate, volunteers }) => (
//   <div className="table-section">
//     <h2>{title}</h2>
//     <input
//       type="date"
//       value={filterDate}
//       onChange={(e) => setFilterDate(e.target.value)}
//     />
//     <table>
//       <thead>
//         <tr>
//           <th>ID</th>
//           <th>Volunteer</th>
//           <th>Date</th>
//           <th>Time</th>
//           <th>Duration/Reason</th>
//           <th>Info</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.length === 0 ? (
//           <tr>
//             <td colSpan="6">No calls available</td>
//           </tr>
//         ) : (
//           data.map((call) => {
//             const vol = volunteers.find((v) => v.fullName === call.user);
//             return (
//               <tr key={call._id}>
//                 <td>{call._id}</td>
//                 <td>{call.user || 'Unknown'}</td>
//                 <td>{call.date || 'N/A'}</td>
//                 <td>{call.time || 'N/A'}</td>
//                 <td>{call.duration || call.reason || 'N/A'}</td>
//                 <td>
//                   {vol && (
//                     <button onClick={() => alert(JSON.stringify(vol, null, 2))}>Info</button>
//                   )}
//                 </td>
//               </tr>
//             );
//           })
//         )}
//       </tbody>
//     </table>
//   </div>
// );

// // UpdateRequestTable Component
// const UpdateRequestTable = ({ requests, volunteers, onApprove, onReject, onView }) => (
//   <div className="table-section">
//     <h2>Volunteer Update Requests</h2>
//     <table>
//       <thead>
//         <tr>
//           <th>Volunteer</th>
//           <th>Requested Updates</th>
//           <th>Status</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {requests.length === 0 ? (
//           <tr>
//             <td colSpan="4">No update requests</td>
//           </tr>
//         ) : (
//           requests.map((req) => {
//             const vol = volunteers.find((v) => v._id === req.volunteerId);
//             return (
//               <tr key={req._id}>
//                 <td>{vol?.fullName || 'Unknown Volunteer'}</td>
//                 <td>{JSON.stringify(req.updatedData)}</td>
//                 <td>{req.status}</td>
//                 <td>
//                   <button onClick={() => onView(vol)}>Info</button>
//                   <button onClick={() => onApprove(req._id)}>Approve</button>
//                   <button onClick={() => onReject(req._id)}>Reject</button>
//                 </td>
//               </tr>
//             );
//           })
//         )}
//       </tbody>
//     </table>
//   </div>
// );

// export default function AdminDashboard() {
//   const [volunteers, setVolunteers] = useState([]);
//   const [acceptedCalls, setAcceptedCalls] = useState([]);
//   const [rejectedCalls, setRejectedCalls] = useState([]);
//   const [updateRequests, setUpdateRequests] = useState([]);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [announcements, setAnnouncements] = useState([]);
//   const [shiftAssignments, setShiftAssignments] = useState([]);
//   const [newAnnouncement, setNewAnnouncement] = useState({ title: "", text: "" });
//   const [selectedVolunteer, setSelectedVolunteer] = useState(null);
//   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
//   const [selectedSlotVolunteers, setSelectedSlotVolunteers] = useState({});
//   const [acceptedCallFilter, setAcceptedCallFilter] = useState("");
//   const [rejectedCallFilter, setRejectedCallFilter] = useState("");
//   const [ageFilter, setAgeFilter] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const socketRef = useRef(null);

//   const [notifications, setNotifications] = useState({
//     volunteers: false,
//     acceptedCalls: false,
//     rejectedCalls: false,
//     updateRequests: false,
//     subscriptions: false,
//     users: false,
//     announcements: false,
//     shiftAssignments: false,
//   });

//   // Initialize Socket.IO with improved error handling
//   useEffect(() => {
//     console.log("Initializing Socket.IO connection...");
    
//     const socket = io("http://localhost:5000", {
//       transports: ["websocket", "polling"],
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       timeout: 10000,
//     });

//     socketRef.current = socket;

//     socket.on("connect", () => {
//       console.log("Socket connected:", socket.id);
      
//       // Join all rooms
//       socket.emit("joinVolunteerRoom");
//       socket.emit("joinCallRoom");
//       socket.emit("joinAnnouncementRoom");
//       socket.emit("joinUpdateRequestRoom");
//       socket.emit("joinSubscriptionRoom");
//       socket.emit("joinUserRoom");
//       socket.emit("joinShiftAssignmentRoom");
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("Socket disconnected:", reason);
//     });

//     socket.on("connect_error", (error) => {
//       console.error("Socket connection error:", error);
//     });

//     socket.on("newVolunteer", (volunteer) => {
//       console.log("Received newVolunteer:", volunteer);
//       setVolunteers((prev) => {
//         if (!prev.some((v) => v._id === volunteer._id)) {
//           return [...prev, volunteer];
//         }
//         return prev;
//       });
//       setNotifications((prev) => ({ ...prev, volunteers: true }));
//     });

//     socket.on("volunteerUpdated", (updatedVolunteer) => {
//       console.log("Received volunteerUpdated:", updatedVolunteer);
//       setVolunteers((prev) =>
//         prev.map((v) => (v._id === updatedVolunteer._id ? updatedVolunteer : v))
//       );
//       setNotifications((prev) => ({ ...prev, volunteers: true }));
//     });

//     socket.on("volunteerDeleted", (id) => {
//       console.log("Received volunteerDeleted:", id);
//       setVolunteers((prev) => prev.filter((v) => v._id !== id));
//       setNotifications((prev) => ({ ...prev, volunteers: true }));
//     });

//     socket.on("newCall", (call) => {
//       console.log("Received newCall:", call);
//       if (["accepted", "completed"].includes(call.status)) {
//         setAcceptedCalls((prev) => {
//           if (!prev.some((c) => c._id === call._id)) {
//             return [...prev, call];
//           }
//           return prev;
//         });
//         setNotifications((prev) => ({ ...prev, acceptedCalls: true }));
//       } else if (call.status === "rejected") {
//         setRejectedCalls((prev) => {
//           if (!prev.some((c) => c._id === call._id)) {
//             return [...prev, call];
//           }
//           return prev;
//         });
//         setNotifications((prev) => ({ ...prev, rejectedCalls: true }));
//       }
//     });

//     socket.on("newAnnouncement", (announcement) => {
//       console.log("Received newAnnouncement:", announcement);
//       setAnnouncements((prev) => {
//         if (!prev.some((a) => a._id === announcement._id)) {
//           return [announcement, ...prev];
//         }
//         return prev;
//       });
//       setNotifications((prev) => ({ ...prev, announcements: true }));
//     });

//     socket.on("newUpdateRequest", (updateRequest) => {
//       console.log("Received newUpdateRequest:", updateRequest);
//       setUpdateRequests((prev) => {
//         if (!prev.some((r) => r._id === updateRequest._id)) {
//           return [...prev, updateRequest];
//         }
//         return prev;
//       });
//       setNotifications((prev) => ({ ...prev, updateRequests: true }));
//     });

//     socket.on("updateRequestApproved", (reqId) => {
//       console.log("Update request approved:", reqId);
//       setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
//       setNotifications((prev) => ({ ...prev, updateRequests: true }));
//     });

//     socket.on("updateRequestRejected", (reqId) => {
//       console.log("Update request rejected:", reqId);
//       setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
//       setNotifications((prev) => ({ ...prev, updateRequests: true }));
//     });

//     socket.on("newSubscription", (subscription) => {
//       console.log("Received newSubscription:", subscription);
//       setSubscriptions((prev) => {
//         if (!prev.some((s) => s._id === subscription._id)) {
//           return [...prev, subscription];
//         }
//         return prev;
//       });
//       setNotifications((prev) => ({ ...prev, subscriptions: true }));
//     });

//     socket.on("newUser", (user) => {
//       console.log("Received newUser:", user);
//       setUsers((prev) => {
//         if (!prev.some((u) => u._id === user._id)) {
//           return [...prev, user];
//         }
//         return prev;
//       });
//       setNotifications((prev) => ({ ...prev, users: true }));
//     });

//     socket.on("newShiftAssignment", (assignment) => {
//       console.log("Received newShiftAssignment:", assignment);
//       setShiftAssignments((prev) => {
//         if (!prev.some((a) => a._id === assignment._id)) {
//           return [...prev, assignment];
//         }
//         return prev;
//       });
//       setNotifications((prev) => ({ ...prev, shiftAssignments: true }));
//     });

//     return () => {
//       console.log("Disconnecting socket...");
//       socket.disconnect();
//     };
//   }, []);

//   // Initial data fetch with improved error handling and individual endpoint handling
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);
      
//       try {
//         console.log("Starting to fetch admin dashboard data...");
        
//         // Define endpoints with fallback handling
//         const endpoints = [
//           { name: 'volunteers', url: 'http://localhost:5000/api/volunteers' },
//           { name: 'calls', url: 'http://localhost:5000/api/calls' },
//           { name: 'updateRequests', url: 'http://localhost:5000/api/volunteers/update/requests' },
//           { name: 'subscriptions', url: 'http://localhost:5000/api/subscriptions' },
//           { name: 'users', url: 'http://localhost:5000/api/users' },
//           { name: 'announcements', url: 'http://localhost:5000/api/announcements' },
//           { name: 'shifts', url: 'http://localhost:5000/api/shift-assignments' },
//         ];

//         // Fetch each endpoint individually with error handling
//         const results = await Promise.allSettled(
//           endpoints.map(async (endpoint) => {
//             try {
//               console.log(`Fetching ${endpoint.name}...`);
//               const response = await axios.get(endpoint.url, { timeout: 10000 });
//               console.log(`Successfully fetched ${endpoint.name}:`, response.data);
//               return { name: endpoint.name, data: response.data, success: true };
//             } catch (error) {
//               console.error(`Failed to fetch ${endpoint.name}:`, error.message);
//               return { name: endpoint.name, error: error.message, success: false };
//             }
//           })
//         );

//         // Process results and update state
//         results.forEach((result) => {
//           if (result.status === 'fulfilled' && result.value.success) {
//             const { name, data } = result.value;
            
//             switch (name) {
//               case 'volunteers':
//                 setVolunteers(data.data || data || []);
//                 break;
//               case 'calls':
//                 setAcceptedCalls(data.accepted || []);
//                 setRejectedCalls(data.rejected || []);
//                 break;
//               case 'updateRequests':
//                 setUpdateRequests(data.data || data || []);
//                 break;
//               case 'subscriptions':
//                 setSubscriptions(data.data || data || []);
//                 break;
//               case 'users':
//                 setUsers(data.data || data || []);
//                 break;
//               case 'announcements':
//                 setAnnouncements(data.data || data || []);
//                 break;
//               case 'shifts':
//                 setShiftAssignments(data.data || data || []);
//                 break;
//               default:
//                 break;
//             }
//           } else {
//             console.warn(`Failed to process ${result.value?.name || 'unknown endpoint'}`);
//           }
//         });

//         console.log("Data fetching completed");

//       } catch (error) {
//         console.error("Unexpected error fetching dashboard data:", error);
//         setError("Failed to load dashboard data. Please check your server connection.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Clear notification for a specific section
//   const clearNotification = (field) => {
//     setNotifications((prev) => ({ ...prev, [field]: false }));
//   };

//   // Create announcement with improved error handling
//   const handleCreateAnnouncement = async () => {
//     if (!newAnnouncement.title || !newAnnouncement.text) {
//       alert("Please fill in both title and text fields.");
//       return;
//     }
    
//     try {
//       console.log("Creating announcement:", newAnnouncement);
      
//       const response = await axios.post("http://localhost:5000/api/announcements", {
//         ...newAnnouncement,
//         date: new Date().toLocaleDateString(),
//         time: new Date().toLocaleTimeString(),
//       }, { timeout: 10000 });
      
//       console.log("Announcement created:", response.data);
//       setNewAnnouncement({ title: "", text: "" });
      
//       // Update local state if response contains data
//       if (response.data.data) {
//         setAnnouncements(prev => [response.data.data, ...prev]);
//       }
      
//       alert("Announcement created successfully!");
//     } catch (err) {
//       console.error("Error creating announcement:", err);
//       const errorMessage = err.response?.data?.message || err.message || "Unknown error";
//       alert(`Failed to create announcement: ${errorMessage}`);
//     }
//   };

//   // Fixed approval actions with proper headers and admin authentication
//   const handleApprove = async (id) => {
//     try {
//       console.log("Approving volunteer:", id);
      
//       const response = await axios.put(`http://localhost:5000/api/volunteers/${id}/approve`, {}, {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 10000,
//       });
      
//       console.log("Approve response:", response.data);
      
//       // Update local state immediately for better UX
//       setVolunteers((prev) =>
//         prev.map((v) => (v._id === id ? { ...v, status: "approved", isApproved: true } : v))
//       );
      
//       alert("Volunteer approved successfully!");
//     } catch (err) {
//       console.error("Error approving volunteer:", err);
//       const errorMessage = err.response?.data?.message || err.message || "Unknown error";
//       alert(`Failed to approve volunteer: ${errorMessage}`);
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       console.log("Rejecting volunteer:", id);
      
//       const response = await axios.put(`http://localhost:5000/api/volunteers/${id}/reject`, {}, {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 10000,
//       });
      
//       console.log("Reject response:", response.data);
      
//       // Update local state immediately
//       setVolunteers((prev) =>
//         prev.map((v) => (v._id === id ? { ...v, status: "rejected", isApproved: false } : v))
//       );
      
//       alert("Volunteer rejected successfully!");
//     } catch (err) {
//       console.error("Error rejecting volunteer:", err);
//       const errorMessage = err.response?.data?.message || err.message || "Unknown error";
//       alert(`Failed to reject volunteer: ${errorMessage}`);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this volunteer?")) {
//       return;
//     }
    
//     try {
//       console.log("Deleting volunteer:", id);
      
//       const response = await axios.delete(`http://localhost:5000/api/volunteers/${id}`, {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 10000,
//       });
      
//       console.log("Delete response:", response.data);
      
//       // Update local state immediately
//       setVolunteers((prev) => prev.filter((v) => v._id !== id));
      
//       // Emit socket event for real-time update
//       if (socketRef.current && socketRef.current.connected) {
//         socketRef.current.emit('volunteerDeleted', id);
//       }
      
//       alert("Volunteer deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting volunteer:", err);
//       const errorMessage = err.response?.data?.message || err.message || "Unknown error";
//       alert(`Failed to delete volunteer: ${errorMessage}`);
//     }
//   };

//   // Volunteer update request actions
//   const handleUpdateApprove = async (reqId) => {
//     try {
//       console.log("Approving update request:", reqId);
      
//       const response = await axios.put(`http://localhost:5000/api/volunteers/update/approve/${reqId}`, {}, {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 10000,
//       });
      
//       setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
//       console.log("Update approve response:", response.data);
//       alert("Update request approved successfully!");
//     } catch (err) {
//       console.error("Error approving update request:", err);
//       const errorMessage = err.response?.data?.message || err.message || "Unknown error";
//       alert(`Failed to approve update request: ${errorMessage}`);
//     }
//   };

//   const handleUpdateReject = async (reqId) => {
//     try {
//       console.log("Rejecting update request:", reqId);
      
//       const response = await axios.put(`http://localhost:5000/api/volunteers/update/reject/${reqId}`, {
//         adminResponse: "Rejected by admin"
//       }, {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 10000,
//       });
      
//       setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
//       console.log("Update reject response:", response.data);
//       alert("Update request rejected successfully!");
//     } catch (err) {
//       console.error("Error rejecting update request:", err);
//       const errorMessage = err.response?.data?.message || err.message || "Unknown error";
//       alert(`Failed to reject update request: ${errorMessage}`);
//     }
//   };

//   // Shift assignment with improved error handling
//   const assignShift = async (volunteerId, slot) => {
//     if (!volunteerId) {
//       alert("Please select a volunteer first.");
//       return;
//     }
    
//     try {
//       console.log("Assigning shift:", { volunteerId, slot });
      
//       const response = await axios.post("http://localhost:5000/api/shift-assignments", {
//         volunteerId,
//         slot,
//         date: new Date().toISOString(),
//         assignedBy: null,
//       }, {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 10000,
//       });
      
//       console.log("Shift assignment response:", response.data);
      
//       // Update local state
//       if (response.data.assignment) {
//         setShiftAssignments((prev) => {
//           if (!prev.some((a) => a._id === response.data.assignment._id)) {
//             return [...prev, response.data.assignment];
//           }
//           return prev;
//         });
//       }
      
//       setSelectedSlotVolunteers((prev) => ({ ...prev, [slot]: "" }));
//       alert("Shift assigned successfully!");
//     } catch (err) {
//       console.error("Error assigning shift:", err);
//       const errorMessage = err.response?.data?.message || err.message || "Unknown error";
//       alert(`Failed to assign shift: ${errorMessage}`);
//     }
//   };

//   // Filtering and stats with null safety
//   const helplineVolunteers = useMemo(
//     () => volunteers.filter((v) => v.volunteerType === "helpline" && v.status === "approved"),
//     [volunteers]
//   );
//   const nonHelplineVolunteers = useMemo(
//     () => volunteers.filter((v) => v.volunteerType === "non-helpline" && v.status === "approved"),
//     [volunteers]
//   );
//   const approvalRequests = useMemo(
//     () => volunteers.filter((v) => v.status === "pending"),
//     [volunteers]
//   );

//   const totalActiveHelpline = helplineVolunteers.length;
//   const totalActiveNonHelpline = nonHelplineVolunteers.length;
//   const totalAnsweredCalls = acceptedCalls.length;
//   const callsAfterMidnight = acceptedCalls.filter((call) => {
//     if (!call.time) return false;
//     try {
//       const hour = parseInt(call.time.split(":")[0]);
//       return hour >= 2 && hour <= 6;
//     } catch (error) {
//       console.warn("Invalid time format:", call.time);
//       return false;
//     }
//   }).length;
//   const totalRejectedCalls = rejectedCalls.length;
//   const deEscalatedPercentage = Math.round(
//     (acceptedCalls.filter((c) => c.deEscalated).length / (acceptedCalls.length || 1)) * 100
//   );

//   // Volunteer call stats with null safety
//   const volunteerCallStats = useMemo(() => {
//     const stats = {};
//     volunteers.forEach((v) => (stats[v._id] = { accepted: 0, rejected: 0 }));
//     acceptedCalls.forEach((c) => {
//       const vol = volunteers.find((v) => v.fullName === c.user);
//       if (vol && stats[vol._id]) stats[vol._id].accepted += 1;
//     });
//     rejectedCalls.forEach((c) => {
//       const vol = volunteers.find((v) => v.fullName === c.user);
//       if (vol && stats[vol._id]) stats[vol._id].rejected += 1;
//     });
//     return stats;
//   }, [volunteers, acceptedCalls, rejectedCalls]);

//   const enrichedHelplineVolunteers = helplineVolunteers.map((v) => ({
//     ...v,
//     acceptedCalls: volunteerCallStats[v._id]?.accepted || 0,
//     rejectedCalls: volunteerCallStats[v._id]?.rejected || 0,
//   }));

//   const filteredAcceptedCalls = acceptedCalls.filter(
//     (c) => !acceptedCallFilter || c.date === acceptedCallFilter
//   );
//   const filteredRejectedCalls = rejectedCalls.filter(
//     (c) => !rejectedCallFilter || c.date === rejectedCallFilter
//   );

//   const filteredUsers = useMemo(() => {
//     if (!ageFilter) return users;
//     const age = parseInt(ageFilter);
//     if (isNaN(age) || age < 8 || age > 120) return users;
//     return users.filter((u) => u.age === age);
//   }, [users, ageFilter]);

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="admin-dashboard">
//         <h1>Loading Admin Dashboard...</h1>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="admin-dashboard">
//         <h1>Error Loading Dashboard</h1>
//         <p>{error}</p>
//         <button onClick={() => window.location.reload()}>Retry</button>
//       </div>
//     );
//   }

//   // Render JSX - Your original design preserved
//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>

//       {/* Dashboard Cards - Your original cards preserved */}
//       <div className="cards-container">
//         <Card title="Active Helpline Volunteers" value={totalActiveHelpline} />
//         <Card title="Active Non-Helpline Volunteers" value={totalActiveNonHelpline} />
//         <Card title="Calls Answered (Helpline)" value={totalAnsweredCalls} />
//         <Card title="Calls Answered After Midnight" value={callsAfterMidnight} />
//         <Card title="Calls Rejected" value={totalRejectedCalls} />
//         <Card title="De-escalated Successfully (%)" value={`${deEscalatedPercentage}%`} />
//       </div>

//       {/* Approval Requests */}
//       <SectionHeader
//         title="Approval Requests"
//         notification={notifications.volunteers}
//         onClick={() => clearNotification("volunteers")}
//       />
//       <Table
//         title="Approval Requests"
//         data={approvalRequests}
//         onApprove={handleApprove}
//         onReject={handleReject}
//         onDelete={handleDelete}
//         onView={setSelectedVolunteer}
//       />

//       {/* Volunteers Tables */}
//       <SectionHeader
//         title="Helpline Volunteers"
//         notification={notifications.volunteers}
//         onClick={() => clearNotification("volunteers")}
//       />
//       <SearchableVolunteerTable
//         title="Helpline Volunteers"
//         volunteers={enrichedHelplineVolunteers}
//         showCallStats={true}
//         onApprove={handleApprove}
//         onReject={handleReject}
//         onDelete={handleDelete}
//         onView={setSelectedVolunteer}
//       />

//       <SectionHeader
//         title="Non-Helpline Volunteers"
//         notification={notifications.volunteers}
//         onClick={() => clearNotification("volunteers")}
//       />
//       <SearchableVolunteerTable
//         title="Non-Helpline Volunteers"
//         volunteers={nonHelplineVolunteers}
//         showCallStats={false}
//         onApprove={handleApprove}
//         onReject={handleReject}
//         onDelete={handleDelete}
//         onView={setSelectedVolunteer}
//       />

//       {/* Calls */}
//       <SectionHeader
//         title="Accepted Calls"
//         notification={notifications.acceptedCalls}
//         onClick={() => clearNotification("acceptedCalls")}
//       />
//       <CallTable
//         title="Accepted Calls"
//         data={filteredAcceptedCalls}
//         filterDate={acceptedCallFilter}
//         setFilterDate={setAcceptedCallFilter}
//         volunteers={volunteers}
//       />

//       <SectionHeader
//         title="Rejected Calls"
//         notification={notifications.rejectedCalls}
//         onClick={() => clearNotification("rejectedCalls")}
//       />
//       <CallTable
//         title="Rejected Calls"
//         data={filteredRejectedCalls}
//         filterDate={rejectedCallFilter}
//         setFilterDate={setRejectedCallFilter}
//         volunteers={volunteers}
//       />

//       {/* Update Requests */}
//       <SectionHeader
//         title="Volunteer Update Requests"
//         notification={notifications.updateRequests}
//         onClick={() => clearNotification("updateRequests")}
//       />
//       <UpdateRequestTable
//         requests={updateRequests}
//         volunteers={volunteers}
//         onApprove={handleUpdateApprove}
//         onReject={handleUpdateReject}
//         onView={setSelectedVolunteer}
//       />

//       {/* Newsletter Subscriptions */}
//       <SectionHeader
//         title="Newsletter Subscriptions"
//         notification={notifications.subscriptions}
//         onClick={() => clearNotification("subscriptions")}
//       />
//       <div className="table-section">
//         <h2>Newsletter Subscriptions</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Email</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {subscriptions.length === 0 ? (
//               <tr>
//                 <td colSpan="2">No subscriptions available</td>
//               </tr>
//             ) : (
//               subscriptions.map((sub, index) => (
//                 <tr key={sub._id || index}>
//                   <td>{sub.email}</td>
//                   <td>
//                     <span className={`status-badge ${sub.status || 'active'}`}>
//                       {sub.status || 'active'}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Users */}
//       <SectionHeader
//         title="Users"
//         notification={notifications.users}
//         onClick={() => clearNotification("users")}
//       />
//       <div className="table-section">
//         <h2>Users</h2>
//         <div className="search-filters">
//           <input
//             type="number"
//             placeholder="Enter age (8-120)"
//             value={ageFilter}
//             min="8"
//             max="120"
//             onChange={(e) => setAgeFilter(e.target.value)}
//           />
//         </div>
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Age</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.length === 0 ? (
//               <tr>
//                 <td colSpan="3">No users available</td>
//               </tr>
//             ) : (
//               filteredUsers.map((u, index) => (
//                 <tr key={u._id || index}>
//                   <td>{u.name || 'N/A'}</td>
//                   <td>{u.email || 'N/A'}</td>
//                   <td>{u.age || 'N/A'}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Shift Assignment Table */}
//       <SectionHeader
//         title="Shift Assignment (Helpline)"
//         notification={notifications.shiftAssignments}
//         onClick={() => clearNotification("shiftAssignments")}
//       />
//       <div className="table-section">
//         <h2>Shift Assignment (Helpline)</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Volunteer</th>
//               <th>Time Slot</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {fixedTimeSlots.map((slot) => {
//               const availableVols = helplineVolunteers.filter(
//                 (v) =>
//                   v.availability?.times?.includes(slot) &&
//                   !shiftAssignments.some((a) => a.slot === slot && a.volunteerId === v._id)
//               );
//               const selectedId = selectedSlotVolunteers[slot] || "";

//               return (
//                 <tr key={slot}>
//                   <td>
//                     <select
//                       value={selectedId}
//                       onChange={(e) =>
//                         setSelectedSlotVolunteers((prev) => ({
//                           ...prev,
//                           [slot]: e.target.value,
//                         }))
//                       }
//                     >
//                       <option value="">Select Volunteer</option>
//                       {availableVols.map((v) => (
//                         <option key={v._id} value={v._id}>
//                           {v.fullName}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td>{slot}</td>
//                   <td>
//                     <button onClick={() => assignShift(selectedId, slot)} disabled={!selectedId}>
//                       Assign
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         <h3>Current Assignments:</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Volunteer</th>
//               <th>Time Slot</th>
//               <th>Info</th>
//             </tr>
//           </thead>
//           <tbody>
//             {shiftAssignments.length === 0 ? (
//               <tr>
//                 <td colSpan="3">No shift assignments</td>
//               </tr>
//             ) : (
//               shiftAssignments.map((s, idx) => {
//                 const vol = volunteers.find((v) => v._id === s.volunteerId);
//                 return (
//                   <tr key={s._id || idx}>
//                     <td>{vol?.fullName || 'Unknown Volunteer'}</td>
//                     <td>{s.slot || 'N/A'}</td>
//                     <td>
//                       <button onClick={() => vol && setSelectedVolunteer(vol)}>Info</button>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Announcements */}
//       <SectionHeader
//         title="Announcements"
//         notification={notifications.announcements}
//         onClick={() => clearNotification("announcements")}
//       />
//       <div className="table-section">
//         <h2>Announcements</h2>
//         <div className="announcement-form">
//           <input
//             type="text"
//             placeholder="Title"
//             value={newAnnouncement.title}
//             onChange={(e) =>
//               setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))
//             }
//           />
//           <textarea
//             placeholder="Text"
//             value={newAnnouncement.text}
//             onChange={(e) =>
//               setNewAnnouncement((prev) => ({ ...prev, text: e.target.value }))
//             }
//           />
//           <button onClick={handleCreateAnnouncement}>Create</button>
//         </div>
//         <table>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {announcements.length === 0 ? (
//               <tr>
//                 <td colSpan="4">No announcements available</td>
//               </tr>
//             ) : (
//               announcements.map((a, index) => (
//                 <tr key={a._id || index}>
//                   <td>{a.title || 'No Title'}</td>
//                   <td>{a.date || (a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A')}</td>
//                   <td>{a.time || (a.createdAt ? new Date(a.createdAt).toLocaleTimeString() : 'N/A')}</td>
//                   <td>
//                     <button onClick={() => setSelectedAnnouncement(a)}>View</button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Your Original Volunteer Modal - Preserved exactly as you had it */}
//       {selectedVolunteer && (
//         <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h3>{selectedVolunteer.fullName}'s Info</h3>
//             <p>
//               <strong>Email:</strong> {selectedVolunteer.email}
//             </p>
//             <p>
//               <strong>Phone:</strong> {selectedVolunteer.phone}
//             </p>
//             <p>
//               <strong>Type:</strong> {selectedVolunteer.volunteerType}
//             </p>
//             {selectedVolunteer.address && (
//               <p>
//                 <strong>Address:</strong> {selectedVolunteer.address.street}, {selectedVolunteer.address.city},{" "}
//                 {selectedVolunteer.address.state}, {selectedVolunteer.address.postalCode}
//               </p>
//             )}
//             <p>
//               <strong>Availability Days:</strong>{" "}
//               {selectedVolunteer.availability?.days?.join(", ") || 'Not specified'}
//             </p>
//             <p>
//               <strong>Availability Times:</strong>{" "}
//               {selectedVolunteer.availability?.times?.join(", ") || 'Not specified'}
//             </p>
//             <p>
//               <strong>Interests:</strong> {selectedVolunteer.volunteerRoles?.join(", ") || 'Not specified'}
//             </p>
//             {selectedVolunteer.additionalInfo?.skillsExperience && (
//               <p>
//                 <strong>Skills:</strong> {selectedVolunteer.additionalInfo.skillsExperience}
//               </p>
//             )}
//             {selectedVolunteer.additionalInfo?.whyVolunteer && (
//               <p>
//                 <strong>Why Volunteer:</strong> {selectedVolunteer.additionalInfo.whyVolunteer}
//               </p>
//             )}
//             <p>
//               <strong>Status:</strong> {selectedVolunteer.status}
//             </p>
//             <button onClick={() => setSelectedVolunteer(null)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* Your Original Announcement Modal - Preserved exactly as you had it */}
//       {selectedAnnouncement && (
//         <div className="modal-overlay" onClick={() => setSelectedAnnouncement(null)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h3>{selectedAnnouncement.title}</h3>
//             <p>{selectedAnnouncement.text}</p>
//             <p>
//               {selectedAnnouncement.date || (selectedAnnouncement.createdAt ? new Date(selectedAnnouncement.createdAt).toLocaleDateString() : '')} {selectedAnnouncement.time || (selectedAnnouncement.createdAt ? new Date(selectedAnnouncement.createdAt).toLocaleTimeString() : '')}
//             </p>
//             <button onClick={() => setSelectedAnnouncement(null)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



















import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "./CSS/AdminDashboard.css";

const fixedTimeSlots = [
  "12:00 AM – 4:00 AM",
  "4:00 AM – 8:00 AM",
  "8:00 AM – 12:00 PM",
  "12:00 PM – 4:00 PM",
  "4:00 PM – 8:00 PM",
  "8:00 PM – 12:00 AM",
];

export default function AdminDashboard() {
  const [volunteers, setVolunteers] = useState([]);
  const [acceptedCalls, setAcceptedCalls] = useState([]);
  const [rejectedCalls, setRejectedCalls] = useState([]);
  const [updateRequests, setUpdateRequests] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [shiftAssignments, setShiftAssignments] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", text: "" });
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedSlotVolunteers, setSelectedSlotVolunteers] = useState({});
  const [acceptedCallFilter, setAcceptedCallFilter] = useState("");
  const [rejectedCallFilter, setRejectedCallFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [notifications, setNotifications] = useState({
    volunteers: false,
    acceptedCalls: false,
    rejectedCalls: false,
    updateRequests: false,
    subscriptions: false,
    users: false,
    announcements: false,
    shiftAssignments: false,
  });







  useEffect(() => {
    console.log("Initializing Socket.IO connection...");
    
    const socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      
      socket.emit("joinVolunteerRoom");
      socket.emit("joinCallRoom");
      socket.emit("joinAnnouncementRoom");
      socket.emit("joinUpdateRequestRoom");
      socket.emit("joinSubscriptionRoom");
      socket.emit("joinUserRoom");
      socket.emit("joinShiftAssignmentRoom");
      socket.emit("joinAdminRoom");

      socket.emit("joinRoom", "adminRoom");
      socket.emit("joinSubscriptionRoom");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });


    
    socket.on("newVolunteer", (volunteer) => {
      console.log("Received newVolunteer:", volunteer);
      setVolunteers((prev) => {
        if (!prev.some((v) => v._id === volunteer._id)) {
          return [...prev, volunteer];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, volunteers: true }));
    });

    socket.on("volunteerUpdated", (updatedVolunteer) => {
      console.log("Received volunteerUpdated:", updatedVolunteer);
      setVolunteers((prev) =>
        prev.map((v) => (v._id === updatedVolunteer._id ? updatedVolunteer : v))
      );
      setNotifications((prev) => ({ ...prev, volunteers: true }));
    });

    socket.on("volunteerDeleted", (id) => {
      console.log("Received volunteerDeleted:", id);
      setVolunteers((prev) => prev.filter((v) => v._id !== id));
      setNotifications((prev) => ({ ...prev, volunteers: true }));
    });

    socket.on("newCall", (call) => {
      console.log("Received newCall:", call);
      if (["accepted", "completed"].includes(call.status)) {
        setAcceptedCalls((prev) => {
          if (!prev.some((c) => c._id === call._id)) {
            return [...prev, call];
          }
          return prev;
        });
        setNotifications((prev) => ({ ...prev, acceptedCalls: true }));
      } else if (call.status === "rejected") {
        setRejectedCalls((prev) => {
          if (!prev.some((c) => c._id === call._id)) {
            return [...prev, call];
          }
          return prev;
        });
        setNotifications((prev) => ({ ...prev, rejectedCalls: true }));
      }
    });

    socket.on("newAnnouncement", (announcement) => {
      console.log("Received newAnnouncement:", announcement);
      setAnnouncements((prev) => {
        if (!prev.some((a) => a._id === announcement._id)) {
          return [announcement, ...prev];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, announcements: true }));
    });

    socket.on("newUpdateRequest", (updateRequest) => {
      console.log("Received newUpdateRequest:", updateRequest);
      setUpdateRequests((prev) => {
        if (!prev.some((r) => r._id === updateRequest._id)) {
          return [...prev, updateRequest];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, updateRequests: true }));
    });

    socket.on("updateRequestApproved", (reqId) => {
      console.log("Update request approved:", reqId);
      setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
      setNotifications((prev) => ({ ...prev, updateRequests: true }));
    });

    socket.on("updateRequestRejected", (reqId) => {
      console.log("Update request rejected:", reqId);
      setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
      setNotifications((prev) => ({ ...prev, updateRequests: true }));
    });



    
    socket.on("newSubscription", (subscription) => {
      console.log("Received newSubscription:", subscription);
      setSubscriptions((prev) => {
        if (!prev.some((s) => s._id === subscription._id)) {
          return [...prev, subscription];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, subscriptions: true }));
    });

    socket.on("subscriptionUpdated", (updatedSubscription) => {
      console.log("Received subscriptionUpdated:", updatedSubscription);
      setSubscriptions((prev) =>
        prev.map((s) => (s._id === updatedSubscription._id ? updatedSubscription : s))
      );
      setNotifications((prev) => ({ ...prev, subscriptions: true }));
    });

    socket.on("subscriptionDeleted", (id) => {
      console.log("Received subscriptionDeleted:", id);
      setSubscriptions((prev) => prev.filter((s) => s._id !== id));
      setNotifications((prev) => ({ ...prev, subscriptions: true }));
    });

    socket.on("newShiftAssignment", (assignment) => {
      console.log("Received newShiftAssignment:", assignment);
      setShiftAssignments((prev) => {
        if (!prev.some((a) => a._id === assignment._id)) {
          return [...prev, assignment];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, shiftAssignments: true }));
    });

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);





  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Starting to fetch admin dashboard data...");
        
        const endpoints = [
          { name: 'volunteers', url: 'http://localhost:5000/api/volunteers' },
          { name: 'calls', url: 'http://localhost:5000/api/calls' },
          { name: 'updateRequests', url: 'http://localhost:5000/api/volunteers/update/requests' },
          { name: 'subscriptions', url: 'http://localhost:5000/api/subscriptions' },
          { name: 'users', url: 'http://localhost:5000/api/users' },
          { name: 'announcements', url: 'http://localhost:5000/api/announcements' },
          { name: 'shifts', url: 'http://localhost:5000/api/shift-assignments' },
        ];

        const results = await Promise.allSettled(
          endpoints.map(async (endpoint) => {
            try {
              console.log(`Fetching ${endpoint.name}...`);
              const response = await axios.get(endpoint.url, { timeout: 10000 });
              console.log(`✅ Successfully fetched ${endpoint.name}:`, response.data);
              return { name: endpoint.name, data: response.data, success: true };
            } catch (error) {
              console.error(`❌ Failed to fetch ${endpoint.name}:`, error.message);
              return { name: endpoint.name, error: error.message, success: false };
            }
          })
        );


        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.success) {
            const { name, data } = result.value;
            
            switch (name) {
              case 'volunteers':
                const volunteerData = data.data || data || [];
                console.log(`📊 Processing ${volunteerData.length} volunteers`);
                setVolunteers(volunteerData);
                break;
                
              case 'calls':
                setAcceptedCalls(data.accepted || []);
                setRejectedCalls(data.rejected || []);
                console.log(`📞 Processed ${data.accepted?.length || 0} accepted calls, ${data.rejected?.length || 0} rejected calls`);
                break;
                
              case 'updateRequests':
                const requestData = data.data || data || [];
                console.log(`📝 Processing ${requestData.length} update requests`);
                setUpdateRequests(requestData);
                break;
                
              case 'subscriptions':
                setSubscriptions(data.data || data || []);
                break;
                
              case 'users':
                setUsers(data.data || data || []);
                break;
                
              case 'announcements':
                const announcementData = data.data || data || [];
                console.log(`📢 Processing ${announcementData.length} announcements`);
                setAnnouncements(announcementData);
                break;
                
              case 'shifts':
                const shiftData = data.data || data || [];
                console.log(`⏰ Processing ${shiftData.length} shift assignments`);
                setShiftAssignments(shiftData);
                break;
                
              default:
                break;
            }
          } else {
            console.warn(`⚠️ Failed to process ${result.value?.name || 'unknown endpoint'}`);
          }
        });

        console.log("✅ Data fetching completed successfully");

      } catch (error) {
        console.error("❌ Unexpected error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please check your server connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  
  const clearNotification = (field) => {
    setNotifications((prev) => ({ ...prev, [field]: false }));
  };


  
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.text.trim()) {
      alert("Please fill in both title and text fields.");
      return;
    }
    
    try {
      console.log("🔥 Creating announcement:", newAnnouncement);
      
      const response = await axios.post("http://localhost:5000/api/announcements", {
        title: newAnnouncement.title.trim(),
        text: newAnnouncement.text.trim(),
      }, { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 
      });
      
      console.log("Announcement created successfully:", response.data);

      
      setNewAnnouncement({ title: "", text: "" });

      
      if (response.data.success && response.data.data) {
        setAnnouncements(prev => [response.data.data, ...prev]);
      }
      
      alert("Announcement created successfully!");
      
    } catch (err) {
      console.error("❌ Error creating announcement:", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to create announcement: ${errorMessage}`);
    }
  };


  
  const handleApprove = async (id) => {
    try {
      console.log("✅ Approving volunteer:", id);
      
      const response = await axios.put(`http://localhost:5000/api/volunteers/${id}/approve`, {}, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      
      console.log("✅ Approve response:", response.data);
      
      setVolunteers((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status: "approved", isApproved: true } : v))
      );
      
      alert("Volunteer approved successfully!");
    } catch (err) {
      console.error("❌ Error approving volunteer:", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to approve volunteer: ${errorMessage}`);
    }
  };

  const handleReject = async (id) => {
    try {
      console.log("❌ Rejecting volunteer:", id);
      
      const response = await axios.put(`http://localhost:5000/api/volunteers/${id}/reject`, {}, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      
      console.log("❌ Reject response:", response.data);
      
      setVolunteers((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status: "rejected", isApproved: false } : v))
      );
      
      alert("Volunteer rejected successfully!");
    } catch (err) {
      console.error("❌ Error rejecting volunteer:", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to reject volunteer: ${errorMessage}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this volunteer?")) {
      return;
    }
    
    try {
      console.log("🗑️ Deleting volunteer:", id);
      
      const response = await axios.delete(`http://localhost:5000/api/volunteers/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      
      console.log("🗑️ Delete response:", response.data);
      
      setVolunteers((prev) => prev.filter((v) => v._id !== id));
      
      alert("Volunteer deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting volunteer:", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to delete volunteer: ${errorMessage}`);
    }
  };




  // Update Volunteer Request
  const handleUpdateApprove = async (reqId) => {
    try {
      console.log("✅ Approving update request:", reqId);
      
      const response = await axios.put(`http://localhost:5000/api/volunteers/update/approve/${reqId}`, {}, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      
      console.log("✅ Update approve response:", response.data);
      setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
      
      // Refresh volunteers data to show updated info
      try {
        const volResponse = await axios.get('http://localhost:5000/api/volunteers');
        if (volResponse.data.success) {
          setVolunteers(volResponse.data.data || []);
        }
      } catch (volErr) {
        console.warn('⚠️ Failed to refresh volunteers after approval:', volErr);
      }
      
      alert("Update request approved successfully!");
    } catch (err) {
      console.error("❌ Error approving update request:", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to approve update request: ${errorMessage}`);
    }
  };


  const handleUpdateReject = async (reqId) => {
    try {
      console.log("❌ Rejecting update request:", reqId);
      
      const response = await axios.put(`http://localhost:5000/api/volunteers/update/reject/${reqId}`, {
        adminResponse: "Rejected by admin"
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      
      console.log("❌ Update reject response:", response.data);
      setUpdateRequests((prev) => prev.filter((r) => r._id !== reqId));
      
      alert("Update request rejected successfully!");
    } catch (err) {
      console.error("❌ Error rejecting update request:", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to reject update request: ${errorMessage}`);
    }
  };





  // Shift assignment
  const assignShift = async (volunteerId, slot) => {
    if (!volunteerId) {
      alert("Please select a volunteer first.");
      return;
    }
    
    try {
      console.log("⏰ Assigning shift:", { volunteerId, slot });
      
      const response = await axios.post("http://localhost:5000/api/shift-assignments", {
        volunteerId,
        slot,
        date: new Date().toISOString(),
        assignedBy: null,
        notes: `Assigned via admin dashboard on ${new Date().toLocaleDateString()}`
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      
      console.log("✅ Shift assignment response:", response.data);
    
      if (response.data.success && (response.data.assignment || response.data.data)) {
        const assignmentData = response.data.assignment || response.data.data;
        setShiftAssignments((prev) => {
          if (!prev.some((a) => a._id === assignmentData._id)) {
            return [...prev, assignmentData];
          }
          return prev;
        });
      }
      
      // Reset selected volunteer for this slot
      setSelectedSlotVolunteers((prev) => ({ ...prev, [slot]: "" }));
      
      alert("Shift assigned successfully!");
      
    } catch (err) {
      console.error("❌ Error assigning shift:", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to assign shift: ${errorMessage}`);
    }
  };

 
  const helplineVolunteers = useMemo(
    () => volunteers.filter((v) => v.volunteerType === "helpline" && v.status === "approved"),
    [volunteers]
  );
  const nonHelplineVolunteers = useMemo(
    () => volunteers.filter((v) => v.volunteerType === "non-helpline" && v.status === "approved"),
    [volunteers]
  );
  const approvalRequests = useMemo(
    () => volunteers.filter((v) => v.status === "pending"),
    [volunteers]
  );

  const totalActiveHelpline = helplineVolunteers.length;
  const totalActiveNonHelpline = nonHelplineVolunteers.length;
  const totalAnsweredCalls = acceptedCalls.length;
  const callsAfterMidnight = acceptedCalls.filter((call) => {
    if (!call.time) return false;
    try {
      const hour = parseInt(call.time.split(":")[0]);
      return hour >= 2 && hour <= 6;
    } catch (error) {
      console.warn("Invalid time format:", call.time);
      return false;
    }
  }).length;
  const totalRejectedCalls = rejectedCalls.length;
  const deEscalatedPercentage = Math.round(
    (acceptedCalls.filter((c) => c.deEscalated).length / (acceptedCalls.length || 1)) * 100
  );



  
  const volunteerCallStats = useMemo(() => {
    const stats = {};
    volunteers.forEach((v) => (stats[v._id] = { accepted: 0, rejected: 0 }));
    acceptedCalls.forEach((c) => {
      const vol = volunteers.find((v) => v.fullName === c.user);
      if (vol && stats[vol._id]) stats[vol._id].accepted += 1;
    });
    rejectedCalls.forEach((c) => {
      const vol = volunteers.find((v) => v.fullName === c.user);
      if (vol && stats[vol._id]) stats[vol._id].rejected += 1;
    });
    return stats;
  }, [volunteers, acceptedCalls, rejectedCalls]);

  const enrichedHelplineVolunteers = helplineVolunteers.map((v) => ({
    ...v,
    acceptedCalls: volunteerCallStats[v._id]?.accepted || 0,
    rejectedCalls: volunteerCallStats[v._id]?.rejected || 0,
  }));

  const filteredAcceptedCalls = acceptedCalls.filter(
    (c) => !acceptedCallFilter || c.date === acceptedCallFilter
  );
  const filteredRejectedCalls = rejectedCalls.filter(
    (c) => !rejectedCallFilter || c.date === rejectedCallFilter
  );

  const filteredUsers = useMemo(() => {
    if (!ageFilter) return users;
    const age = parseInt(ageFilter);
    if (isNaN(age) || age < 8 || age > 120) return users;
    return users.filter((u) => u.age === age);
  }, [users, ageFilter]);


  
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <h1>Loading Admin Dashboard...</h1>
        <p>Please wait while we fetch the data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="admin-dashboard">
        <h1>Error Loading Dashboard</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Main render
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard - Real Time System</h1>

      {/* Dashboard Cards */}
      <div className="cards-container">
        <Card title="Active Helpline Volunteers" value={totalActiveHelpline} />
        <Card title="Active Non-Helpline Volunteers" value={totalActiveNonHelpline} />
        <Card title="Calls Answered (Helpline)" value={totalAnsweredCalls} />
        <Card title="Calls Answered After Midnight" value={callsAfterMidnight} />
        <Card title="Calls Rejected" value={totalRejectedCalls} />
        <Card title="De-escalated Successfully (%)" value={`${deEscalatedPercentage}%`} />
      </div>

      {/* Approval Requests */}
      <SectionHeader
        title="Approval Requests"
        notification={notifications.volunteers}
        onClick={() => clearNotification("volunteers")}
      />
      <Table
        title="Approval Requests"
        data={approvalRequests}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onView={setSelectedVolunteer}
      />

      {/* Volunteers Tables */}
      <SectionHeader
        title="Helpline Volunteers"
        notification={notifications.volunteers}
        onClick={() => clearNotification("volunteers")}
      />
      <SearchableVolunteerTable
        title="Helpline Volunteers"
        volunteers={enrichedHelplineVolunteers}
        showCallStats={true}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onView={setSelectedVolunteer}
      />

      <SectionHeader
        title="Non-Helpline Volunteers"
        notification={notifications.volunteers}
        onClick={() => clearNotification("volunteers")}
      />
      <SearchableVolunteerTable
        title="Non-Helpline Volunteers"
        volunteers={nonHelplineVolunteers}
        showCallStats={false}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onView={setSelectedVolunteer}
      />

      {/* Calls */}
      <SectionHeader
        title="Accepted Calls"
        notification={notifications.acceptedCalls}
        onClick={() => clearNotification("acceptedCalls")}
      />
      <CallTable
        title="Accepted Calls"
        data={filteredAcceptedCalls}
        filterDate={acceptedCallFilter}
        setFilterDate={setAcceptedCallFilter}
        volunteers={volunteers}
      />

      <SectionHeader
        title="Rejected Calls"
        notification={notifications.rejectedCalls}
        onClick={() => clearNotification("rejectedCalls")}
      />
      <CallTable
        title="Rejected Calls"
        data={filteredRejectedCalls}
        filterDate={rejectedCallFilter}
        setFilterDate={setRejectedCallFilter}
        volunteers={volunteers}
      />

      {/* FIXED Update Requests */}
      <SectionHeader
        title="Volunteer Update Requests"
        notification={notifications.updateRequests}
        onClick={() => clearNotification("updateRequests")}
      />
      <UpdateRequestTable
        requests={updateRequests}
        volunteers={volunteers}
        onApprove={handleUpdateApprove}
        onReject={handleUpdateReject}
        onView={setSelectedVolunteer}
      />

      {/* Newsletter Subscriptions */}
      <SectionHeader
        title="Newsletter Subscriptions"
        notification={notifications.subscriptions}
        onClick={() => clearNotification("subscriptions")}
      />
      <div className="table-section">
        <h2>Newsletter Subscriptions</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan="2">No subscriptions available</td>
              </tr>
            ) : (
              subscriptions.map((sub, index) => (
                <tr key={sub._id || index}>
                  <td>{sub.email}</td>
                  <td>
                    <span className={`status-badge ${sub.status || 'active'}`}>
                      {sub.status || 'active'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Users */}
      <SectionHeader
        title="Users"
        notification={notifications.users}
        onClick={() => clearNotification("users")}
      />
      <div className="table-section">
        <h2>Users</h2>
        <div className="search-filters">
          <input
            type="number"
            placeholder="Enter age (8-120)"
            value={ageFilter}
            min="8"
            max="120"
            onChange={(e) => setAgeFilter(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="3">No users available</td>
              </tr>
            ) : (
              filteredUsers.map((u, index) => (
                <tr key={u._id || index}>
                  <td>{u.name || 'N/A'}</td>
                  <td>{u.email || 'N/A'}</td>
                  <td>{u.age || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {/* Shift Assignment */}
      <SectionHeader
        title="Shift Assignment (Helpline) - Real Time"
        notification={notifications.shiftAssignments}
        onClick={() => clearNotification("shiftAssignments")}
      />
      <div className="table-section">
        <h2>Shift Assignment (Helpline)</h2>
        <table>
          <thead>
            <tr>
              <th>Volunteer</th>
              <th>Time Slot</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fixedTimeSlots.map((slot) => {
              const availableVols = helplineVolunteers.filter(
                (v) =>
                  v.availability?.times?.includes(slot) &&
                  !shiftAssignments.some((a) => (a.timeSlot || a.slot) === slot && a.volunteerId === v._id)
              );
              const selectedId = selectedSlotVolunteers[slot] || "";

              return (
                <tr key={slot}>
                  <td>
                    <select
                      value={selectedId}
                      onChange={(e) =>
                        setSelectedSlotVolunteers((prev) => ({
                          ...prev,
                          [slot]: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Volunteer</option>
                      {availableVols.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.fullName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{slot}</td>
                  <td>
                    <button 
                      onClick={() => assignShift(selectedId, slot)} 
                      disabled={!selectedId}
                      style={{
                        opacity: selectedId ? 1 : 0.6,
                        cursor: selectedId ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h3>Current Assignments (Real-Time):</h3>
        <table>
          <thead>
            <tr>
              <th>Volunteer</th>
              <th>Time Slot</th>
              <th>Date</th>
              <th>Status</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {shiftAssignments.length === 0 ? (
              <tr>
                <td colSpan="5">No shift assignments</td>
              </tr>
            ) : (
              shiftAssignments.map((s, idx) => {
                const vol = volunteers.find((v) => v._id === (s.volunteerId?._id || s.volunteerId));
                return (
                  <tr key={s._id || idx}>
                    <td>{vol?.fullName || s.volunteerId?.fullName || 'Unknown Volunteer'}</td>
                    <td>{s.timeSlot || s.slot || 'N/A'}</td>
                    <td>
                      {s.date 
                        ? new Date(s.date).toLocaleDateString()
                        : s.createdAt 
                        ? new Date(s.createdAt).toLocaleDateString()
                        : 'N/A'
                      }
                    </td>
                    <td>
                      <span className={`status-badge ${s.status || 'upcoming'}`}>
                        {s.status || 'upcoming'}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => vol && setSelectedVolunteer(vol)}
                        disabled={!vol}
                      >
                        Info
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FIXED Announcements with Real-Time Updates */}
      <SectionHeader
        title="Announcements - Real Time"
        notification={notifications.announcements}
        onClick={() => clearNotification("announcements")}
      />
      <div className="table-section">
        <h2>Announcements</h2>
        <div className="announcement-form">
          <input
            type="text"
            placeholder="Announcement Title"
            value={newAnnouncement.title}
            onChange={(e) =>
              setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))
            }
            maxLength="200"
          />
          <textarea
            placeholder="Announcement Text (max 1000 characters)"
            value={newAnnouncement.text}
            onChange={(e) =>
              setNewAnnouncement((prev) => ({ ...prev, text: e.target.value }))
            }
            maxLength="1000"
            rows="4"
          />
          <button 
            onClick={handleCreateAnnouncement}
            disabled={!newAnnouncement.title.trim() || !newAnnouncement.text.trim()}
            style={{
              opacity: (!newAnnouncement.title.trim() || !newAnnouncement.text.trim()) ? 0.6 : 1,
              cursor: (!newAnnouncement.title.trim() || !newAnnouncement.text.trim()) ? 'not-allowed' : 'pointer'
            }}
          >
            Create Announcement
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Preview</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="4">No announcements available</td>
              </tr>
            ) : (
              announcements.map((a, index) => (
                <tr key={a._id || index}>
                  <td>{a.title || 'No Title'}</td>
                  <td>
                    {(a.content || a.text) 
                      ? (a.content || a.text).substring(0, 100) + '...' 
                      : 'No content'
                    }
                  </td>
                  <td>
                    {a.createdAt 
                      ? new Date(a.createdAt).toLocaleDateString()
                      : a.date || 'N/A'
                    }
                  </td>
                  <td>
                    <button onClick={() => setSelectedAnnouncement(a)}>View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Volunteer Modal */}
      {selectedVolunteer && (
        <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedVolunteer.fullName}'s Info</h3>
            <p><strong>Email:</strong> {selectedVolunteer.email}</p>
            <p><strong>Phone:</strong> {selectedVolunteer.phone}</p>
            <p><strong>Type:</strong> {selectedVolunteer.volunteerType}</p>
            {selectedVolunteer.address && (
              <p>
                <strong>Address:</strong> {selectedVolunteer.address.street}, {selectedVolunteer.address.city},{" "}
                {selectedVolunteer.address.state}, {selectedVolunteer.address.postalCode}
              </p>
            )}
            <p>
              <strong>Availability Days:</strong>{" "}
              {selectedVolunteer.availability?.days?.join(", ") || 'Not specified'}
            </p>
            <p>
              <strong>Availability Times:</strong>{" "}
              {selectedVolunteer.availability?.times?.join(", ") || 'Not specified'}
            </p>
            <p>
              <strong>Interests:</strong> {selectedVolunteer.volunteerRoles?.join(", ") || 'Not specified'}
            </p>
            {selectedVolunteer.additionalInfo?.skillsExperience && (
              <p>
                <strong>Skills:</strong> {selectedVolunteer.additionalInfo.skillsExperience}
              </p>
            )}
            {selectedVolunteer.additionalInfo?.whyVolunteer && (
              <p>
                <strong>Why Volunteer:</strong> {selectedVolunteer.additionalInfo.whyVolunteer}
              </p>
            )}
            <p><strong>Status:</strong> {selectedVolunteer.status}</p>
            <button onClick={() => setSelectedVolunteer(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {selectedAnnouncement && (
        <div className="modal-overlay" onClick={() => setSelectedAnnouncement(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedAnnouncement.title}</h3>
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {selectedAnnouncement.content || selectedAnnouncement.text}
              </p>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
              <p>
                Created: {selectedAnnouncement.createdAt 
                  ? new Date(selectedAnnouncement.createdAt).toLocaleString()
                  : `${selectedAnnouncement.date} ${selectedAnnouncement.time}`
                }
              </p>
              {selectedAnnouncement.createdBy && (
                <p>By: {selectedAnnouncement.createdBy}</p>
              )}
            </div>
            <button onClick={() => setSelectedAnnouncement(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Component definitions
function SectionHeader({ title, notification, onClick }) {
  return (
    <div className="section-header" onClick={onClick} style={{ cursor: "pointer" }}>
      <h2>
        {title} {notification && <span className="notification-dot" />}
      </h2>
    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const Table = ({ title, data, onApprove, onReject, onView, onDelete }) => (
  <div className="table-section">
    <h2>{title}</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="5">No data available</td>
          </tr>
        ) : (
          data.map((vol) => (
            <tr key={vol._id}>
              <td>{vol.fullName}</td>
              <td>{vol.email}</td>
              <td>{vol.phone}</td>
              <td>
                <span className={`status-badge ${vol.status}`}>{vol.status}</span>
              </td>
              <td>
                <button onClick={() => onView(vol)}>Info</button>
                {vol.status !== "approved" && (
                  <button onClick={() => onApprove(vol._id)}>Approve</button>
                )}
                {vol.status !== "rejected" && (
                  <button onClick={() => onReject(vol._id)}>Reject</button>
                )}
                <button onClick={() => onDelete(vol._id)}>Delete</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const SearchableVolunteerTable = ({
  title,
  volunteers,
  onApprove,
  onReject,
  onDelete,
  onView,
  showCallStats,
}) => {
  const [searchName, setSearchName] = useState("");
  const [searchSlot, setSearchSlot] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchDays, setSearchDays] = useState([]);

  const categories = [
    "Event Support",
    "Fundraising",
    "Community Outreach",
    "Campus Ambassador",
    "Social Media & Digital Promotion",
    "Content Writing / Blogging",
    "Graphic Design / Creative Support",
    "Technical Support (e.g., IT, website)",
    "Translation / Language Support",
    "Photography / Videography",
    "Mentorship / Training",
    "Case Follow-up Coordinator",
    "Crisis Response Assistant",
    "Resource & Referral Assistant",
  ];

  const weekDays = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const handleDayChange = (day) => {
    setSearchDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const filteredVolunteers = useMemo(
    () =>
      volunteers.filter((v) => {
        const nameMatch = v.fullName.toLowerCase().includes(searchName.toLowerCase());
        const slotMatch =
          searchSlot === "" || (v.availability?.times && v.availability.times.some((slot) => slot === searchSlot));
        const categoryMatch =
          searchCategory === "" ||
          (v.volunteerRoles && v.volunteerRoles.some((interest) => interest === searchCategory));
        const dayMatch =
          searchDays.length === 0 || (v.availability?.days && searchDays.every((day) => v.availability.days.includes(day)));

        return nameMatch && slotMatch && categoryMatch && dayMatch;
      }),
    [volunteers, searchName, searchSlot, searchCategory, searchDays]
  );

  const uniqueNames = [...new Set(volunteers.map((v) => v.fullName))];

  return (
    <div className="table-section">
      <h2>{title}</h2>
      <div className="search-filters">
        <input
          list={`${title}-names`}
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <datalist id={`${title}-names`}>
          {uniqueNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>

        {title === "Helpline Volunteers" ? (
          <>
            <input
              list={`${title}-slots`}
              placeholder="Search by time slot"
              value={searchSlot}
              onChange={(e) => setSearchSlot(e.target.value)}
            />
            <datalist id={`${title}-slots`}>
              {fixedTimeSlots.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </>
        ) : (
          <>
            <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="day-filter">
          <span>Search by days: </span>
          {weekDays.map((day) => (
            <label key={day} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                checked={searchDays.includes(day)}
                onChange={() => handleDayChange(day)}
              />
              {day}
            </label>
          ))}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            {showCallStats && (
              <>
                <th>Accepted Calls</th>
                <th>Rejected Calls</th>
              </>
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVolunteers.length === 0 ? (
            <tr>
              <td colSpan={showCallStats ? "7" : "5"}>No volunteers found</td>
            </tr>
          ) : (
            filteredVolunteers.map((vol) => (
              <tr key={vol._id}>
                <td>{vol.fullName}</td>
                <td>{vol.email}</td>
                <td>{vol.phone}</td>
                <td>
                  <span className={`status-badge ${vol.status}`}>{vol.status}</span>
                </td>
                {showCallStats && (
                  <>
                    <td>{vol.acceptedCalls || 0}</td>
                    <td>{vol.rejectedCalls || 0}</td>
                  </>
                )}
                <td>
                  <button onClick={() => onView(vol)}>Info</button>
                  {vol.status !== "approved" && (
                    <button onClick={() => onApprove(vol._id)}>Approve</button>
                  )}
                  <Link to={`/update-volunteer/${vol._id}`}>Update</Link>
                  <button onClick={() => onDelete(vol._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const CallTable = ({ title, data, filterDate, setFilterDate, volunteers }) => (
  <div className="table-section">
    <h2>{title}</h2>
    <input
      type="date"
      value={filterDate}
      onChange={(e) => setFilterDate(e.target.value)}
    />
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Volunteer</th>
          <th>Date</th>
          <th>Time</th>
          <th>Duration/Reason</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="6">No calls available</td>
          </tr>
        ) : (
          data.map((call, index) => {
            const vol = volunteers.find((v) => v.fullName === call.user);
            return (
              <tr key={call._id || index}>
                <td>{call._id || 'N/A'}</td>
                <td>{call.user || 'Unknown'}</td>
                <td>{call.date || 'N/A'}</td>
                <td>{call.time || 'N/A'}</td>
                <td>{call.duration || call.reason || 'N/A'}</td>
                <td>
                  {vol && (
                    <button onClick={() => alert(JSON.stringify(vol, null, 2))}>Info</button>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

const UpdateRequestTable = ({ requests, volunteers, onApprove, onReject, onView }) => {
  console.log('UpdateRequestTable - Requests:', requests);
  console.log('UpdateRequestTable - Volunteers:', volunteers);
  
  return (
    <div className="table-section">
      <h2>Volunteer Update Requests - Real Time</h2>
      <table>
        <thead>
          <tr>
            <th>Volunteer</th>
            <th>Request Details</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="5">No update requests</td>
            </tr>
          ) : (
            requests.map((req, index) => {
              const vol = volunteers.find((v) => v._id === req.volunteerId || v._id === req.volunteerId?._id);
              console.log('Processing request:', req, 'Found volunteer:', vol);
              
              return (
                <tr key={req._id || index}>
                  <td>{vol?.fullName || req.volunteerId?.fullName || 'Unknown Volunteer'}</td>
                  <td>
                    <div style={{ maxWidth: '300px', overflow: 'hidden' }}>
                      {req.requestedFields ? (
                        <span>Fields: {req.requestedFields.join(', ')}</span>
                      ) : req.updatedData ? (
                        <span>Updated: {Object.keys(req.updatedData).join(', ')}</span>
                      ) : (
                        <span>Profile update request</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${req.status || 'pending'}`}>
                      {req.status || 'pending'}
                    </span>
                  </td>
                  <td>
                    {req.createdAt 
                      ? new Date(req.createdAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </td>
                  <td>
                    <button 
                      onClick={() => vol && onView(vol)}
                      disabled={!vol}
                    >
                      Info
                    </button>
                    <button 
                      onClick={() => onApprove(req._id)}
                      disabled={req.status === 'approved'}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => onReject(req._id)}
                      disabled={req.status === 'rejected'}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

