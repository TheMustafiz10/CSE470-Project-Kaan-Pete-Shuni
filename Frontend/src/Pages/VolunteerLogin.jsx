






// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./CSS/VolunteerLogin.css"; 

// const VolunteerLogin = () => {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const trimmedEmail = email.trim().toLowerCase();

//     if (!trimmedEmail) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(trimmedEmail)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log("🔍 Attempting login for:", trimmedEmail);

//       const response = await fetch("http://localhost:5000/api/volunteers/login", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//         },
//         credentials: 'include',
//         body: JSON.stringify({ 
//           email: trimmedEmail,
//         }),
//       });

//       const data = await response.json();
      
//       console.log("🔍 Login response status:", response.status);
//       console.log("🔍 Login response data:", data);
      
//       if (response.ok && data.success) {
//         console.log("Login success:", data);
//         setSuccess("Login successful! Redirecting to dashboard...");

//         // Store login data if token is provided
//         if (data.token) {
//           localStorage.setItem("volunteerToken", data.token);
//         }

//         // Store volunteer data from login response
//         if (data.data) {
//           const volunteerInfo = {
//             id: data.data.volunteerId || data.data._id,
//             fullName: data.data.fullName,
//             email: data.data.email,
//             phone: data.data.phone,
//             volunteerType: data.data.volunteerType,
//             volunteerRoles: data.data.volunteerRoles,
//             availability: data.data.availability,
//             address: data.data.address,
//             additionalInfo: data.data.additionalInfo,
//             registrationDate: data.data.registrationDate,
//             isApproved: data.data.isApproved || false,
//             isActive: data.data.isActive || true,
//             isAdmin: data.data.isAdmin || false,
//             status: data.data.status
//           };
          
//           localStorage.setItem("volunteerInfo", JSON.stringify(volunteerInfo));
//           console.log("✅ Volunteer info stored from login:", volunteerInfo);
//         }

//         // Fetch additional profile data using session
//         try {
//           const profileResponse = await fetch("http://localhost:5000/api/volunteers/profile", {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             credentials: 'include',
//           });

//           if (profileResponse.ok) {
//             const profileData = await profileResponse.json();
//             console.log("🔍 Profile response:", profileData);
            
//             const volunteer = profileData.volunteer || profileData.data;
            
//             if (volunteer) {
//               const updatedVolunteerInfo = {
//                 id: volunteer._id || volunteer.id,
//                 fullName: volunteer.fullName,
//                 email: volunteer.email,
//                 phone: volunteer.phone,
//                 volunteerType: volunteer.volunteerType,
//                 volunteerRoles: volunteer.volunteerRoles,
//                 availability: volunteer.availability,
//                 address: volunteer.address,
//                 additionalInfo: volunteer.additionalInfo,
//                 registrationDate: volunteer.registrationDate,
//                 isApproved: volunteer.isApproved || false,
//                 isActive: volunteer.isActive || true,
//                 isAdmin: volunteer.isAdmin || false,
//                 status: volunteer.status
//               };
              
//               localStorage.setItem("volunteerInfo", JSON.stringify(updatedVolunteerInfo));
//               console.log("✅ Updated volunteer info stored:", updatedVolunteerInfo);
//             }
//           } else {
//             console.warn("Failed to fetch profile, but continuing with login data");
//           }
//         } catch (profileError) {
//           console.warn("Profile fetch failed, but continuing with login data:", profileError);
//         }

//         // Delay redirect to show success message
//         setTimeout(() => {
//           navigate("/volunteer-dashboard");
//         }, 1500);

//       } else {
//         if (response.status === 400) {
//           setError(data.message || "Invalid email.");
//         } else if (response.status === 401) {
//           setError(data.message || "Invalid email address.");
//         } else if (response.status === 403) {
//           setError(data.message || "Account not approved or inactive.");
//         } else if (response.status === 500) {
//           setError("Server error. Please try again later.");
//         } else {
//           setError(data.message || "Login failed. Please try again.");
//         }
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       if (err.name === 'TypeError' && err.message.includes('fetch')) {
//         setError("Cannot connect to server. Please check if the server is running.");
//       } else {
//         setError("An error occurred. Please check your connection and try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h2>Volunteer Login</h2>
//         {error && <p className="error-msg">{error}</p>}
//         {success && <p className="success-msg">{success}</p>}

//         <form onSubmit={handleLogin}>
//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               disabled={loading}
//               autoComplete="email"
//             />
//           </div>

//           <button type="submit" className="login-btn" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="signup-text">
//           Don't have an account?{" "}
//           <button
//             type="button"
//             className="signup-btn"
//             onClick={() => navigate("/apply-now")}
//             disabled={loading}
//           >
//             Register Here
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default VolunteerLogin;













import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/VolunteerLogin.css"; 

const VolunteerLogin = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      console.log("🔍 Attempting login for:", trimmedEmail);

      const response = await fetch("http://localhost:5000/api/volunteers/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: trimmedEmail,
        }),
      });

      const data = await response.json();
      
      console.log("🔍 Login response status:", response.status);
      console.log("🔍 Login response data:", data);
      
      if (response.ok && data.success) {
        console.log("Login success:", data);
        setSuccess("Login successful! Redirecting to dashboard...");

        // Mark as logged in
        localStorage.setItem("isLoggedIn", "true");

        let volunteerData = null;

        // Get volunteer data from login response
        if (data.data) {
          volunteerData = {
            _id: data.data._id || data.data.volunteerId || data.data.id, // Use _id for dashboard compatibility
            fullName: data.data.fullName,
            email: data.data.email,
            phone: data.data.phone,
            volunteerType: data.data.volunteerType,
            volunteerRoles: data.data.volunteerRoles,
            availability: data.data.availability,
            address: data.data.address,
            additionalInfo: data.data.additionalInfo,
            registrationDate: data.data.registrationDate,
            isApproved: data.data.isApproved || false,
            isActive: data.data.isActive || true,
            isAdmin: data.data.isAdmin || false,
            status: data.data.status,
            lastLogin: new Date().toISOString()
          };
          
          console.log("✅ Initial volunteer data:", volunteerData);
        }

        // Try to fetch additional profile data
        try {
          const profileResponse = await fetch("http://localhost:5000/api/volunteers/profile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log("🔍 Profile response:", profileData);
            
            const volunteer = profileData.volunteer || profileData.data;
            
            if (volunteer) {
              // Update volunteer data with profile info
              volunteerData = {
                _id: volunteer._id || volunteer.id, // Ensure _id is used
                fullName: volunteer.fullName,
                email: volunteer.email,
                phone: volunteer.phone,
                volunteerType: volunteer.volunteerType,
                volunteerRoles: volunteer.volunteerRoles,
                availability: volunteer.availability,
                address: volunteer.address,
                additionalInfo: volunteer.additionalInfo,
                registrationDate: volunteer.registrationDate,
                isApproved: volunteer.isApproved || false,
                isActive: volunteer.isActive || true,
                isAdmin: volunteer.isAdmin || false,
                status: volunteer.status,
                lastLogin: volunteer.lastLogin || new Date().toISOString()
              };
              
              console.log("✅ Updated volunteer data from profile:", volunteerData);
            }
          } else {
            console.warn("Failed to fetch profile, using login data");
          }
        } catch (profileError) {
          console.warn("Profile fetch failed, using login data:", profileError);
        }

        // Store volunteer data using the correct key that dashboards expect
        if (volunteerData) {
          localStorage.setItem("volunteer", JSON.stringify(volunteerData));
          console.log("✅ Volunteer data stored with key 'volunteer':", volunteerData);
          console.log("🔍 Volunteer type detected:", volunteerData.volunteerType);

          // ROLE-BASED REDIRECTION
          setTimeout(() => {
            if (volunteerData.volunteerType === 'non-helpline') {
              console.log("🔄 Redirecting to non-helpline dashboard");
              navigate("/non-helpline-dashboard");
            } else {
              console.log("🔄 Redirecting to helpline dashboard");
              navigate("/volunteer-dashboard");
            }
          }, 1500);
        } else {
          // Fallback if no volunteer data
          console.error("❌ No volunteer data available");
          setError("Login successful but profile data unavailable. Please try again.");
          setLoading(false);
          return;
        }

      } else {
        if (response.status === 400) {
          setError(data.message || "Invalid email.");
        } else if (response.status === 401) {
          setError(data.message || "Invalid email address.");
        } else if (response.status === 403) {
          setError(data.message || "Account not approved or inactive.");
        } else if (response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(data.message || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("Cannot connect to server. Please check if the server is running.");
      } else {
        setError("An error occurred. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Volunteer Login</h2>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate("/apply-now")}
            disabled={loading}
          >
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
};

export default VolunteerLogin;