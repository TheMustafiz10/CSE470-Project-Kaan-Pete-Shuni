import React, { useState, useMemo } from "react";
import './VolunteerTable.css'; // optional CSS for styling

export default function VolunteerTable({ volunteers, type }) {
  const [search, setSearch] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  // Filter volunteers by type and search
  const filteredVolunteers = useMemo(() => {
    return volunteers
      .filter(v => v.volunteerType === type)
      .filter(v =>
        v.fullName.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase())
      );
  }, [volunteers, search, type]);

  return (
    <div className="volunteer-table-container">
      <h2>{type === 'helpline' ? 'Helpline Volunteers' : 'Non-Helpline Volunteers'}</h2>
      <input
        type="text"
        placeholder="Search by Name or Email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-input"
      />
      <table className="volunteer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredVolunteers.map((volunteer, idx) => (
            <tr key={idx}>
              <td>{volunteer.fullName}</td>
              <td>{volunteer.email}</td>
              <td>{volunteer.phone}</td>
              <td>{volunteerTypeLabel(volunteer.volunteerType)}</td>
              <td>
                <button onClick={() => setSelectedVolunteer(volunteer)}>Info</button>
                <button style={{ marginLeft: '5px' }}>Edit</button>
                <button style={{ marginLeft: '5px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Volunteer Info */}
      {selectedVolunteer && (
        <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{selectedVolunteer.fullName}'s Info</h3>
            <p><strong>Email:</strong> {selectedVolunteer.email}</p>
            <p><strong>Phone:</strong> {selectedVolunteer.phone}</p>
            <p><strong>Volunteer Type:</strong> {volunteerTypeLabel(selectedVolunteer.volunteerType)}</p>
            <p><strong>Address:</strong> {selectedVolunteer.street}, {selectedVolunteer.city}, {selectedVolunteer.state}, {selectedVolunteer.postalCode}</p>
            <p><strong>Availability Days:</strong> {selectedVolunteer.availabilityDays?.join(", ")}</p>
            <p><strong>Availability Times:</strong> {selectedVolunteer.availabilityTimes?.join(", ")}</p>
            <p><strong>Volunteer Interests:</strong> {selectedVolunteer.volunteerInterests?.join(", ")}</p>
            <p><strong>Skills / Experience:</strong> {selectedVolunteer.skillsExperience}</p>
            <p><strong>Why Volunteer:</strong> {selectedVolunteer.whyVolunteer}</p>
            <button onClick={() => setSelectedVolunteer(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper
function volunteerTypeLabel(type) {
  return type === "helpline" ? "Helpline" : "Non-Helpline";
}
