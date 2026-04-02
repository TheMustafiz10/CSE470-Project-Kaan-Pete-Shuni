














import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import "./CSS/VolunteerDashboard.css";

const VolunteerDashboard = () => {
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [acceptedCalls, setAcceptedCalls] = useState([]);
  const [rejectedCalls, setRejectedCalls] = useState([]);
  

  
  const [assignedShifts, setAssignedShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [viewedAnnouncements, setViewedAnnouncements] = useState(new Set());


  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateRequestData, setUpdateRequestData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    whyVolunteer: '',
    skillsExperience: '',
    otherNonHelpline: '',
    agreePolicy: false,
    consentContact: false,
    confirmInfo: false,
    cyberLawConsent: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
    '12:00 AM – 4:00 AM': false,
    '4:00 AM – 8:00 AM': false,
    '8:00 AM – 12:00 PM': false,
    '12:00 PM – 4:00 PM': false,
    '4:00 PM – 8:00 PM': false,
    '8:00 PM – 12:00 AM': false,
    'Flexible / Available 24 Hours': false
  });

  
  const [callStats, setCallStats] = useState({
    totalAccepted: 0,
    totalRejected: 0,
    midnightCalls: 0,
    acceptedPercentage: 0,
    rejectedPercentage: 0
  });


  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification('Volunteer Portal', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };
  



  
  const [searchAccepted, setSearchAccepted] = useState('');
  const [searchRejected, setSearchRejected] = useState('');
  const [searchAnnouncements, setSearchAnnouncements] = useState('');
  const [activeTab, setActiveTab] = useState('accepted');
  

  
  const [uploadingProof, setUploadingProof] = useState({});
  

  
  const socketRef = useRef(null);
  const navigate = useNavigate();

  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '12:00 AM – 4:00 AM',
    '4:00 AM – 8:00 AM',
    '8:00 AM – 12:00 PM',
    '12:00 PM – 4:00 PM',
    '4:00 PM – 8:00 PM',
    '8:00 PM – 12:00 AM',
    'Flexible / Available 24 Hours'
  ];

  useEffect(() => {
    const volunteerData = JSON.parse(localStorage.getItem('volunteer') || '{}');
    if (!volunteerData._id) {
      navigate('/volunteer-login');
      return;
    }


    
    if (volunteerData.volunteerType === 'non-helpline') {
      navigate('/non-helpline-dashboard');
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
      console.log('Connected to server');
      socket.emit('joinVolunteerRoom', volunteerId);
      socket.emit('joinAnnouncementRoom');
      socket.emit('joinRoom', `volunteer_${volunteerId}`);
      socket.emit('joinRoom', 'volunteerRoom'); 
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });


    
    socket.on('volunteerUpdated', (updatedVolunteer) => {
      if (updatedVolunteer._id === volunteerId) {
        setVolunteer(updatedVolunteer);
        localStorage.setItem('volunteer', JSON.stringify(updatedVolunteer));
      }
    });


    socket.on('newCall', (call) => {
      if (call.volunteerId === volunteerId) {
        if (['accepted', 'completed'].includes(call.status)) {
          setAcceptedCalls((prev) => {
            if (!prev.some((c) => c._id === call._id)) {
              return [call, ...prev];
            }
            return prev;
          });
        } else if (call.status === 'rejected') {
          setRejectedCalls((prev) => {
            if (!prev.some((c) => c._id === call._id)) {
              return [call, ...prev];
            }
            return prev;
          });
        }
        calculateStats(acceptedCalls, rejectedCalls);
      }
    });









    socket.on('newAnnouncement', (announcement) => {
      console.log('New announcement received:', announcement);
      setAnnouncements((prev) => {
        // Check if announcement already exists
        if (!prev.some(a => a._id === announcement._id)) {
          return [announcement, ...prev];
        }
        return prev;
      });
      setHasNewAnnouncement(true);
      showNotification(`New announcement: ${announcement.title}`);
    });







    socket.on('shiftAssigned', (shift) => {
      if (shift.volunteerId === volunteerId) {
        setAssignedShifts((prev) => [shift, ...prev]);

        
        if (Notification.permission === 'granted') {
          new Notification('New Shift Assigned', {
            body: `You have been assigned a shift: ${shift.timeSlot}`,
            icon: '/favicon.ico'
          });
        }
      }
    });

    socket.on('shiftUpdated', (shift) => {
      if (shift.volunteerId === volunteerId) {
        setAssignedShifts((prev) => 
          prev.map(s => s._id === shift._id ? shift : s)
        );
      }
    });



    socket.on('updateRequestResponse', (response) => {
      if (response.volunteerId === volunteerId) {
        if (response.status === 'approved') {
          alert('Your profile update request has been approved!');
          fetchVolunteerData(volunteerId); 
        } else if (response.status === 'rejected') {
          alert(`Your profile update request has been rejected. Reason: ${response.reason || 'No reason provided'}`);
        }
      }
    });

  };


  
  const fetchVolunteerData = async (volunteerId) => {
    try {
      const [profileRes, callsRes, shiftsRes, announcementsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}`),
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/calls`),
        axios.get(`http://localhost:5000/api/volunteers/${volunteerId}/shifts`),
        axios.get('http://localhost:5000/api/announcements')
      ]);

      // Update profile data
      if (profileRes.data.success) {
        const updatedVolunteer = profileRes.data.data;
        setVolunteer(updatedVolunteer);
        localStorage.setItem('volunteer', JSON.stringify(updatedVolunteer));
        
        // Update form data with current volunteer data
        setUpdateRequestData({
          fullName: updatedVolunteer.fullName || '',
          email: updatedVolunteer.email || '',
          phone: updatedVolunteer.phone || '',
          dob: updatedVolunteer.dob || '',
          street: updatedVolunteer.address?.street || '',
          city: updatedVolunteer.address?.city || '',
          state: updatedVolunteer.address?.state || '',
          postalCode: updatedVolunteer.address?.postalCode || '',
          whyVolunteer: updatedVolunteer.additionalInfo?.whyVolunteer || '',
          skillsExperience: updatedVolunteer.additionalInfo?.skillsExperience || '',
          otherNonHelpline: updatedVolunteer.additionalInfo?.otherNonHelpline || '',
          agreePolicy: updatedVolunteer.consent?.agreePolicy || false,
          consentContact: updatedVolunteer.consent?.consentContact || false,
          confirmInfo: updatedVolunteer.consent?.confirmInfo || false,
          cyberLawConsent: updatedVolunteer.consent?.cyberLawConsent || false,
          Monday: updatedVolunteer.availability?.days?.includes('Monday') || false,
          Tuesday: updatedVolunteer.availability?.days?.includes('Tuesday') || false,
          Wednesday: updatedVolunteer.availability?.days?.includes('Wednesday') || false,
          Thursday: updatedVolunteer.availability?.days?.includes('Thursday') || false,
          Friday: updatedVolunteer.availability?.days?.includes('Friday') || false,
          Saturday: updatedVolunteer.availability?.days?.includes('Saturday') || false,
          Sunday: updatedVolunteer.availability?.days?.includes('Sunday') || false,
          '12:00 AM – 4:00 AM': updatedVolunteer.availability?.times?.includes('12:00 AM – 4:00 AM') || false,
          '4:00 AM – 8:00 AM': updatedVolunteer.availability?.times?.includes('4:00 AM – 8:00 AM') || false,
          '8:00 AM – 12:00 PM': updatedVolunteer.availability?.times?.includes('8:00 AM – 12:00 PM') || false,
          '12:00 PM – 4:00 PM': updatedVolunteer.availability?.times?.includes('12:00 PM – 4:00 PM') || false,
          '4:00 PM – 8:00 PM': updatedVolunteer.availability?.times?.includes('4:00 PM – 8:00 PM') || false,
          '8:00 PM – 12:00 AM': updatedVolunteer.availability?.times?.includes('8:00 PM – 12:00 AM') || false,
          'Flexible / Available 24 Hours': updatedVolunteer.availability?.times?.includes('Flexible / Available 24 Hours') || false
        });
      }

   
      
      if (callsRes.data.success) {
        setAcceptedCalls(callsRes.data.acceptedCalls || []);
        setRejectedCalls(callsRes.data.rejectedCalls || []);
        calculateStats(callsRes.data.acceptedCalls || [], callsRes.data.rejectedCalls || []);
      }

      // Update shifts data
      if (shiftsRes.data.success) {
        setAssignedShifts(shiftsRes.data.data || []);
      }

      // Update announcements - sort by date, newest first
      if (announcementsRes.data.success) {
        const sortedAnnouncements = (announcementsRes.data.data || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAnnouncements(sortedAnnouncements);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const calculateStats = (accepted, rejected) => {
    const totalCalls = accepted.length + rejected.length;
    const midnightCalls = accepted.filter(call => {
      const hour = new Date(call.startTime || call.createdAt).getHours();
      return hour >= 0 && hour < 8;
    }).length;

    setCallStats({
      totalAccepted: accepted.length,
      totalRejected: rejected.length,
      midnightCalls,
      acceptedPercentage: totalCalls > 0 ? ((accepted.length / totalCalls) * 100).toFixed(1) : 0,
      rejectedPercentage: totalCalls > 0 ? ((rejected.length / totalCalls) * 100).toFixed(1) : 0
    });
  };







const handleUpdateRequest = async () => {
  try {
    console.log('Submitting update request for volunteer:', volunteer._id);
    
    const requestData = {
      fullName: updateRequestData.fullName,
      email: updateRequestData.email,
      phone: updateRequestData.phone,
      dob: updateRequestData.dob,
      address: {
        street: updateRequestData.street,
        city: updateRequestData.city,
        state: updateRequestData.state,
        postalCode: updateRequestData.postalCode
      },
      additionalInfo: {
        whyVolunteer: updateRequestData.whyVolunteer,
        skillsExperience: updateRequestData.skillsExperience,
        otherNonHelpline: updateRequestData.otherNonHelpline
      },
      consent: {
        agreePolicy: updateRequestData.agreePolicy,
        consentContact: updateRequestData.consentContact,
        confirmInfo: updateRequestData.confirmInfo,
        cyberLawConsent: updateRequestData.cyberLawConsent
      },
      availability: {
        days: daysOfWeek.filter(day => updateRequestData[day]),
        times: timeSlots.filter(time => updateRequestData[time])
      }
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
      setIsUpdateModalOpen(false);
    }
  } catch (error) {
      console.error('Error submitting update request:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to submit update request: ${errorMessage}`);
    }
};




  // File upload for proof
  const handleProofUpload = async (callId, file, callType) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('proof', file);
    formData.append('callId', callId);
    formData.append('callType', callType);

    setUploadingProof(prev => ({ ...prev, [callId]: true }));

    try {
      const response = await axios.post(`http://localhost:5000/api/volunteers/${volunteer._id}/upload-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Proof uploaded successfully!');
        fetchVolunteerData(volunteer._id);
      }
    } catch (error) {
      console.error('Error uploading proof:', error);
      alert('Failed to upload proof. Please try again.');
    } finally {
      setUploadingProof(prev => ({ ...prev, [callId]: false }));
    }
  };

  const handleInputChange = (field, value) => {
    setUpdateRequestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('volunteer');
    localStorage.removeItem('volunteerToken');
    localStorage.removeItem('isLoggedIn');
    navigate('/volunteer-login');
  };

  const requestNotificationPermission = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          alert('Notifications enabled! You will now receive alerts for new announcements and shifts.');
        }
      });
    } else if (Notification.permission === 'granted') {
      alert('Notifications are already enabled!');
    } else {
      alert('Notifications are blocked. Please enable them in your browser settings.');
    }
  };

  const handleViewAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setViewedAnnouncements(prev => new Set(prev).add(announcement._id));
  };

  const handleCloseAnnouncementModal = () => {
    setSelectedAnnouncement(null);
    setHasNewAnnouncement(false);
  };

  const handleOpenAnnouncements = () => {
    setIsAnnouncementModalOpen(true);
    setHasNewAnnouncement(false);
  };

  const handleViewShift = (shift) => {
    setSelectedShift(shift);
    setIsShiftModalOpen(true);
  };

  
  const filteredAccepted = acceptedCalls.filter(call => {
    if (!searchAccepted) return true;
    const searchLower = searchAccepted.toLowerCase();
    return call.date?.toLowerCase().includes(searchLower) || 
           call.userName?.toLowerCase().includes(searchLower) ||
           call.user?.toLowerCase().includes(searchLower);
  });

  const filteredRejected = rejectedCalls.filter(call => {
    if (!searchRejected) return true;
    const searchLower = searchRejected.toLowerCase();
    return call.date?.toLowerCase().includes(searchLower) || 
           call.userName?.toLowerCase().includes(searchLower) ||
           call.user?.toLowerCase().includes(searchLower) ||
           call.rejectionReason?.toLowerCase().includes(searchLower);
  });

  const filteredAnnouncements = announcements.filter(announcement => {
    if (!searchAnnouncements) return true;
    const searchLower = searchAnnouncements.toLowerCase();
    return announcement.title?.toLowerCase().includes(searchLower) || 
           announcement.content?.toLowerCase().includes(searchLower);
  });

  if (loading) return <div className="dashboard-loading">Loading Dashboard...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;
  if (!volunteer) return <div className="dashboard-error">No profile data found</div>;

  return (
    <div className="volunteer-dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Welcome, {volunteer.fullName}!</h1>
            <p className="volunteer-type">Helpline Volunteer</p>
          </div>
          <div className="header-actions">
            <button 
              className={`notification-btn ${hasNewAnnouncement ? 'has-notification' : ''}`}
              onClick={handleOpenAnnouncements}
            >
              <span className="btn-icon">📢</span>
              Announcements 
              {hasNewAnnouncement && <span className="notification-dot"></span>}
            </button>
            <button onClick={() => setIsUpdateModalOpen(true)} className="update-btn">
              <span className="btn-icon">✏️</span>
              Request Profile Update
            </button>
            <button onClick={requestNotificationPermission} className="enable-notifications-btn">
              <span className="btn-icon">🔔</span>
              Enable Notifications
            </button>
            <button onClick={handleLogout} className="logout-btn">
              <span className="btn-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>







      <div className="dashboard-content">
        {/* Profile Section */}
        <div className="dashboard-card profile-card">
          <div className="card-header">
            <h2>Profile Information</h2>
            {/* <span className="live-badge">Live Updates</span> */}
          </div>
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{volunteer.fullName}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{volunteer.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Phone:</span>
              <span className="value">{volunteer.phone}</span>
            </div>
            <div className="info-row">
              <span className="label">Type:</span>
              <span className="value">Helpline Volunteer</span>
            </div>
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`status-badge ${volunteer.status}`}>
                {volunteer.status}
              </span>
            </div>
            {/* {volunteer.lastLogin && (
              <div className="info-row">
                <span className="label">Last Login:</span>
                <span className="value">
                  {new Date(volunteer.lastLogin).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                  })}
                </span>
              </div>
            )} */}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card accepted">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Calls Accepted</h3>
              <div className="stat-number">{callStats.totalAccepted}</div>
              <div className="stat-percentage">{callStats.acceptedPercentage}%</div>
            </div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3>Calls Rejected</h3>
              <div className="stat-number">{callStats.totalRejected}</div>
              <div className="stat-percentage">{callStats.rejectedPercentage}%</div>
            </div>
          </div>
          <div className="stat-card midnight">
            <div className="stat-icon">🌙</div>
            <div className="stat-content">
              <h3>Midnight Calls</h3>
              <div className="stat-number">{callStats.midnightCalls}</div>
              <div className="stat-label">(12AM - 8AM)</div>
            </div>
          </div>
          <div className="stat-card total">
            <div className="stat-icon">📞</div>
            <div className="stat-content">
              <h3>Total Calls</h3>
              <div className="stat-number">{callStats.totalAccepted + callStats.totalRejected}</div>
              <div className="stat-label">All Time</div>
            </div>
          </div>
        </div>

        {/* Assigned Shifts Section */}
        <div className="dashboard-card shifts-card">
          <div className="card-header">
            <h2>Assigned Shifts</h2>
            {/* <span className="live-badge">Live Updates</span> */}
          </div>
          <div className="table-container">
            {assignedShifts.length === 0 ? (
              <div className="empty-state">
                <p>No shifts assigned yet</p>
              </div>
            ) : (
              <table className="shifts-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedShifts.map(shift => (
                    <tr key={shift._id}>
                      <td>{new Date(shift.date).toLocaleDateString()}</td>
                      <td>{shift.timeSlot}</td>
                      <td>
                        <span className={`shift-status ${shift.status}`}>
                          {shift.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleViewShift(shift)}
                          className="btn btn-primary btn-sm"
                        >
                          View Info
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Call History Tables */}
        <div className="dashboard-card calls-card">
          <div className="card-header">
            <h2>Call History</h2>
            {/* <span className="live-badge">Live Updates</span> */}
          </div>
          
          <div className="tabs-container">
            <div className="tabs">
              <div 
                className={`tab ${activeTab === 'accepted' ? 'active' : ''}`}
                onClick={() => setActiveTab('accepted')}
              >
                Accepted Calls ({acceptedCalls.length})
              </div>
              <div 
                className={`tab ${activeTab === 'rejected' ? 'active' : ''}`}
                onClick={() => setActiveTab('rejected')}
              >
                Rejected Calls ({rejectedCalls.length})
              </div>
            </div>
            
            <div className="tab-content">
              {activeTab === 'accepted' && (
                <div className="table-section active">
                  <div className="table-filters">
                    <input
                      type="text"
                      value={searchAccepted}
                      onChange={(e) => setSearchAccepted(e.target.value)}
                      placeholder="Search accepted calls..."
                      className="search-input"
                    />
                  </div>
                  <div className="table-container">
                    <table className="calls-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Phone</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Duration</th>
                          <th>De-escalated</th>
                          <th>Proof</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAccepted.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="no-data">
                              No accepted calls found
                            </td>
                          </tr>
                        ) : (
                          filteredAccepted.map(call => (
                            <tr key={call._id || Math.random()}>
                              <td>{call.userName || call.user || 'Unknown'}</td>
                              <td>{call.userPhone || 'N/A'}</td>
                              <td>{call.date || new Date(call.createdAt).toLocaleDateString()}</td>
                              <td>{call.time || new Date(call.createdAt).toLocaleTimeString()}</td>
                              <td>{call.duration || 'N/A'}</td>
                              <td>
                                <span className={`deescalation-status ${call.deEscalated ? 'success' : 'neutral'}`}>
                                  {call.deEscalated ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td>
                                <div className="file-upload-container">
                                  {call.proofImage ? (
                                    <div className="file-preview">
                                      <img src={call.proofImage} alt="Proof" style={{maxWidth: '50px', maxHeight: '50px'}} />
                                      <p>Proof uploaded</p>
                                    </div>
                                  ) : (
                                    <>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleProofUpload(call._id, e.target.files[0], 'accepted')}
                                        className="file-upload-input"
                                        id={`proof-${call._id}`}
                                        disabled={uploadingProof[call._id]}
                                      />
                                      <label 
                                        htmlFor={`proof-${call._id}`} 
                                        className="file-upload-btn"
                                      >
                                        {uploadingProof[call._id] ? 'Uploading...' : '📎 Upload Proof'}
                                      </label>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeTab === 'rejected' && (
                <div className="table-section active">
                  <div className="table-filters">
                    <input
                      type="text"
                      value={searchRejected}
                      onChange={(e) => setSearchRejected(e.target.value)}
                      placeholder="Search rejected calls..."
                      className="search-input"
                    />
                  </div>
                  <div className="table-container">
                    <table className="calls-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Phone</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Rejection Reason</th>
                          <th>Proof</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRejected.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="no-data">
                              No rejected calls found
                            </td>
                          </tr>
                        ) : (
                          filteredRejected.map(call => (
                            <tr key={call._id || Math.random()}>
                              <td>{call.userName || call.user || 'Unknown'}</td>
                              <td>{call.userPhone || 'N/A'}</td>
                              <td>{call.date || new Date(call.createdAt).toLocaleDateString()}</td>
                              <td>{call.time || new Date(call.createdAt).toLocaleTimeString()}</td>
                              <td>{call.rejectionReason || call.reason || 'No reason provided'}</td>
                              <td>
                                <div className="file-upload-container">
                                  {call.proofImage ? (
                                    <div className="file-preview">
                                      <img src={call.proofImage} alt="Proof" style={{maxWidth: '50px', maxHeight: '50px'}} />
                                      <p>Proof uploaded</p>
                                    </div>
                                  ) : (
                                    <>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleProofUpload(call._id, e.target.files[0], 'rejected')}
                                        className="file-upload-input"
                                        id={`proof-rejected-${call._id}`}
                                        disabled={uploadingProof[call._id]}
                                      />
                                      <label 
                                        htmlFor={`proof-rejected-${call._id}`} 
                                        className="file-upload-btn"
                                      >
                                        {uploadingProof[call._id] ? 'Uploading...' : '📎 Upload Proof'}
                                      </label>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Update Request Modal */}
      {isUpdateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>Request Profile Update</h2>
              <button 
                onClick={() => setIsUpdateModalOpen(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
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
                </div>
                <div className="form-row">
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
                </div>
              </div>

              <div className="form-section">
                <h3>Address</h3>
                <div className="form-group">
                  <label>Street:</label>
                  <input
                    type="text"
                    value={updateRequestData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    placeholder={volunteer?.address?.street}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City:</label>
                    <input
                      type="text"
                      value={updateRequestData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder={volunteer?.address?.city}
                    />
                  </div>
                  <div className="form-group">
                    <label>State:</label>
                    <input
                      type="text"
                      value={updateRequestData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder={volunteer?.address?.state}
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code:</label>
                    <input
                      type="text"
                      value={updateRequestData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder={volunteer?.address?.postalCode}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Additional Information</h3>
                <div className="form-group">
                  <label>Why do you want to volunteer?</label>
                  <textarea
                    value={updateRequestData.whyVolunteer}
                    onChange={(e) => handleInputChange('whyVolunteer', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Skills and Experience:</label>
                  <textarea
                    value={updateRequestData.skillsExperience}
                    onChange={(e) => handleInputChange('skillsExperience', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Other Non-Helpline Experience:</label>
                  <textarea
                    value={updateRequestData.otherNonHelpline}
                    onChange={(e) => handleInputChange('otherNonHelpline', e.target.value)}
                    rows="2"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Availability - Days</h3>
                <div className="checkbox-group">
                  {daysOfWeek.map(day => (
                    <label key={day} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={updateRequestData[day]}
                        onChange={(e) => handleInputChange(day, e.target.checked)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Availability - Time Slots</h3>
                <div className="checkbox-group">
                  {timeSlots.map(time => (
                    <label key={time} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={updateRequestData[time]}
                        onChange={(e) => handleInputChange(time, e.target.checked)}
                      />
                      {time}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Consent & Agreements</h3>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={updateRequestData.agreePolicy}
                      onChange={(e) => handleInputChange('agreePolicy', e.target.checked)}
                    />
                    I agree to the policy and guidelines
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={updateRequestData.consentContact}
                      onChange={(e) => handleInputChange('consentContact', e.target.checked)}
                    />
                    I consent to be contacted by the organization
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={updateRequestData.confirmInfo}
                      onChange={(e) => handleInputChange('confirmInfo', e.target.checked)}
                    />
                    I confirm that all information provided is accurate
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={updateRequestData.cyberLawConsent}
                      onChange={(e) => handleInputChange('cyberLawConsent', e.target.checked)}
                    />
                    I understand and agree to cyber law compliance
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setIsUpdateModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleUpdateRequest} className="btn btn-primary">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shift Details Modal */}
      {isShiftModalOpen && selectedShift && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Shift Information</h2>
              <button 
                onClick={() => setIsShiftModalOpen(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-info">
                <div className="info-row">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(selectedShift.date).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Time Slot:</span>
                  <span className="value">{selectedShift.timeSlot}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className={`shift-status ${selectedShift.status}`}>
                    {selectedShift.status}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Assigned By:</span>
                  <span className="value">{selectedShift.assignedBy || 'Admin'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Created:</span>
                  <span className="value">{new Date(selectedShift.createdAt).toLocaleString()}</span>
                </div>
                {selectedShift.notes && (
                  <div className="info-row">
                    <span className="label">Notes:</span>
                    <span className="value">{selectedShift.notes}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setIsShiftModalOpen(false)} className="btn btn-primary">
                Close
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
              <h2>Announcements</h2>
              {/* <span className="live-badge">Live Updates</span> */}
              <button 
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="table-filters">
                <input
                  type="text"
                  value={searchAnnouncements}
                  onChange={(e) => setSearchAnnouncements(e.target.value)}
                  placeholder="Search announcements..."
                  className="search-input"
                />
              </div>
              
              {filteredAnnouncements.length === 0 ? (
                <div className="empty-state">
                  <p>No announcements available</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="announcements-table">
                    <thead>
                      <tr>
                        <th>Title & Preview</th>
                        <th>Date & Time</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAnnouncements.map(announcement => (
                        <tr 
                          key={announcement._id} 
                          className={viewedAnnouncements.has(announcement._id) ? 'viewed' : 'new'}
                        >
                          <td>
                            <div className="announcement-title">
                              {announcement.title}
                              {!viewedAnnouncements.has(announcement._id) && (
                                <span className="new-badge">New</span>
                              )}
                            </div>
                            <div className="announcement-preview">
                              {announcement.content.substring(0, 150)}
                              {announcement.content.length > 150 ? '...' : ''}
                            </div>
                          </td>
                          <td>
                            <div className="announcement-datetime">
                              {new Date(announcement.createdAt).toLocaleDateString()}
                              <div className="time-text">
                                {new Date(announcement.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </td>
                          <td>
                            <button 
                              onClick={() => handleViewAnnouncement(announcement)}
                              className="btn btn-primary btn-sm"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Individual Announcement Modal */}
      {selectedAnnouncement && (
        <div className="modal-overlay" onClick={handleCloseAnnouncementModal}>
          <div className="modal-content announcement-detail" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedAnnouncement.title}</h2>
              <button 
                onClick={handleCloseAnnouncementModal}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="announcement-meta">
                <span className="announcement-date">
                  Published: {new Date(selectedAnnouncement.createdAt).toLocaleString()}
                </span>
                {selectedAnnouncement.updatedAt !== selectedAnnouncement.createdAt && (
                  <span className="announcement-updated">
                    Updated: {new Date(selectedAnnouncement.updatedAt).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="announcement-full-content">
                <p>{selectedAnnouncement.content}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseAnnouncementModal} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;