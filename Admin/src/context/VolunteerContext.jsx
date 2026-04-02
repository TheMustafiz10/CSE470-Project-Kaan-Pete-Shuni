// import React, { createContext, useState } from 'react';




// // Create Context
// export const VolunteerContext = createContext();

// export const VolunteerProvider = ({ children }) => {
//   const [volunteers, setVolunteers] = useState([
//     {
//       id: 1,
//       fullName: "Alice Rahman",
//       email: "alice@example.com",
//       phone: "0123456789",
//       volunteerType: "helpline",
//       street: "123 Street",
//       city: "Dhaka",
//       state: "Dhaka",
//       postalCode: "1200",
//       availabilityDays: ["Monday", "Wednesday"],
//       availabilityTimes: ["12:00 PM – 4:00 PM", "8:00 PM – 12:00 AM"],
//       volunteerInterests: ["Call/Chat Support Volunteer"],
//       skillsExperience: "Customer service experience",
//       whyVolunteer: "Want to help people",
//       status: "approved"
//     },
//     {
//       id: 2,
//       fullName: "Bob Karim",
//       email: "bob@example.com",
//       phone: "0987654321",
//       volunteerType: "non-helpline",
//       street: "456 Avenue",
//       city: "Chittagong",
//       state: "Chittagong",
//       postalCode: "4000",
//       availabilityDays: ["Tuesday", "Thursday"],
//       availabilityTimes: ["8:00 AM – 12:00 PM", "12:00 PM – 4:00 PM"],
//       volunteerInterests: ["Event Support", "Photography / Videography"],
//       skillsExperience: "Photography and event coordination",
//       whyVolunteer: "Love community service",
//       status: "approved"
//     },
//   ]);

//   const [acceptedCalls, setAcceptedCalls] = useState([
//     { id: 1, user: "Alice Rahman", date: "2025-08-18", time: "10:00 AM - 12:00 PM", duration: "2h", deEscalated: true },
//   ]);

//   const [updateRequests, setUpdateRequests] = useState([]);

//   const addUpdateRequest = (volunteerId, data) => {
//     setUpdateRequests(prev => [...prev, { id: volunteerId, data }]);
//   };

//   const approveUpdateRequest = request => {
//     setVolunteers(prev => prev.map(v => v.id === request.id ? { ...v, ...request.data } : v));
//     setUpdateRequests(prev => prev.filter(r => r.id !== request.id));
//   };

//   const rejectUpdateRequest = request => {
//     setUpdateRequests(prev => prev.filter(r => r.id !== request.id));
//   };

//   return (
//     <VolunteerContext.Provider value={{
//       volunteers,
//       setVolunteers,
//       acceptedCalls,
//       updateRequests,
//       addUpdateRequest,
//       approveUpdateRequest,
//       rejectUpdateRequest
//     }}>
//       {children}
//     </VolunteerContext.Provider>
//   );
// };






import { createContext, useState } from 'react';

// Create Context
export const VolunteerContext = createContext();

export const VolunteerProvider = ({ children }) => {
  // Initialize volunteers as empty array or with mock data if needed
  const [volunteers, setVolunteers] = useState([
    {
      id: 1,
      fullName: "Alice Rahman",
      email: "alice@example.com",
      phone: "0123456789",
      volunteerType: "helpline",
      street: "123 Street",
      city: "Dhaka",
      state: "Dhaka",
      postalCode: "1200",
      availabilityDays: ["Monday", "Wednesday"],
      availabilityTimes: ["12:00 PM – 4:00 PM", "8:00 PM – 12:00 AM"],
      volunteerInterests: ["Call/Chat Support Volunteer"],
      skillsExperience: "Customer service experience",
      whyVolunteer: "Want to help people",
      status: "approved"
    },
    {
      id: 2,
      fullName: "Bob Karim",
      email: "bob@example.com",
      phone: "0987654321",
      volunteerType: "non-helpline",
      street: "456 Avenue",
      city: "Chittagong",
      state: "Chittagong",
      postalCode: "4000",
      availabilityDays: ["Tuesday", "Thursday"],
      availabilityTimes: ["8:00 AM – 12:00 PM", "12:00 PM – 4:00 PM"],
      volunteerInterests: ["Event Support", "Photography / Videography"],
      skillsExperience: "Photography and event coordination",
      whyVolunteer: "Love community service",
      status: "approved"
    },
  ]);

  const [acceptedCalls, setAcceptedCalls] = useState([
    { id: 1, user: "Alice Rahman", date: "2025-08-18", time: "10:00 AM - 12:00 PM", duration: "2h", deEscalated: true },
  ]);

  const [updateRequests, setUpdateRequests] = useState([]); // always initialize as empty array

  // Add an update request
  const addUpdateRequest = (volunteerId, data) => {
    setUpdateRequests(prev => [...prev, { id: volunteerId, data }]);
  };

  // Approve an update request
  const approveUpdateRequest = (request) => {
    setVolunteers(prev => prev.map(v => v.id === request.id ? { ...v, ...request.data } : v));
    setUpdateRequests(prev => prev.filter(r => r.id !== request.id));
  };

  // Reject an update request
  const rejectUpdateRequest = (request) => {
    setUpdateRequests(prev => prev.filter(r => r.id !== request.id));
  };

  return (
    <VolunteerContext.Provider value={{
      volunteers,
      setVolunteers,
      acceptedCalls,
      updateRequests,
      addUpdateRequest,
      approveUpdateRequest,
      rejectUpdateRequest
    }}>
      {children}
    </VolunteerContext.Provider>
  );
};
