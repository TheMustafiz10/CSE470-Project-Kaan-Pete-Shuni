
// import React, { useState } from "react";
// import "./Navbar.css";
// import logo from "../Assets/KPR-Logo.jpg";
// import { FaHandHoldingHeart } from "react-icons/fa";
// import { FaPhone } from "react-icons/fa6";
// import { MdEmail } from "react-icons/md";
// import { NavLink } from "react-router-dom";

// const Navbar = () => {
//   const [menu, setMenu] = useState("Home");

//   return (
//     <>
//       <div className="navbar">
//         <div className="nav-logo">
//           <img src={logo} alt="KPR-Logo" />
//         </div>

//         <ul className="nav-menu">
//           <li>
//             <FaPhone style={{ marginRight: "8px" }} />
//             +880-1234567890
//           </li>
//           <li>
//             <MdEmail style={{ marginRight: "8px" }} />
//             info@friendlyhelp.org
//           </li>
//         </ul>

//         <NavLink to="/donation">
//           <button className="donation-button">
//             <FaHandHoldingHeart style={{ marginRight: "5px" }} />
//             Donate
//           </button>
//         </NavLink>
//       </div>

//       <div className="secondary-navbar">
//         <ul className="secondary-menu">
//           {/* Home */}
//           <li className={menu === "Home" ? "active" : ""}>
//             <NavLink
//               to="/"
//               className="nav-link"
//               onClick={() => setMenu("Home")}
//             >
//               Home
//             </NavLink>
//           </li>

//           {/* About Us */}
//           <li className={`dropdown ${menu === "About Us" ? "active" : ""}`}>
//             About Us
//             <ul className="dropdown-menu">
//               <li onClick={() => setMenu("Who We Are")}>Who We Are</li>
//               <li onClick={() => setMenu("Mission & Vision")}>Mission & Vision</li>
//               <li onClick={() => setMenu("Reports")}>Reports</li>
//             </ul>
//           </li>

//           {/* Services */}
//           <li className={`dropdown ${menu === "Services" ? "active" : ""}`}>
//             Services
//             <ul className="dropdown-menu">
//               <li onClick={() => setMenu("Helpline Service")}>Helpline Service</li>
//               <li onClick={() => setMenu("Trainings and Workshops")}>Trainings and Workshops</li>
//               <li onClick={() => setMenu("Corporate Wellness Programme")}>Corporate Wellness Programme</li>
//             </ul>
//           </li>

//           {/* Contact */}
//           <li className={`dropdown ${menu === "Contact" ? "active" : ""}`}>
//             Contact
//             <ul className="dropdown-menu">
//               <li onClick={() => setMenu("Telephone")}>Telephone</li>
//               <li onClick={() => setMenu("Mobile")}>Mobile</li>
//               <li onClick={() => setMenu("Email")}>Email</li>
//             </ul>
//           </li>

//           {/* Volunteering */}
//           <li className={`dropdown ${menu === "Volunteering" ? "active" : ""}`}>
//             Volunteering
//             <ul className="dropdown-menu">
//               <li onClick={() => setMenu("Helpline Volunteer")}>Helpline Volunteer</li>
//               <li onClick={() => setMenu("Non-Helpline Volunteer")}>Non-Helpline Volunteer</li>
//               <li onClick={() => setMenu("Spread the Word")}>Spread the Word</li>
//             </ul>
//           </li>

//           {/* Publications */}
//           <li className={`dropdown ${menu === "Publications" ? "active" : ""}`}>
//             Publications
//             <ul className="dropdown-menu">
//               <li onClick={() => setMenu("Blog")}>Blog</li>
//               <li onClick={() => setMenu("Research")}>Research</li>
//             </ul>
//           </li>

//           {/* More */}
//           <li className={`dropdown ${menu === "More" ? "active" : ""}`}>
//             More
//             <ul className="dropdown-menu">
//               <li onClick={() => setMenu("Resources")}>Resources</li>
//               <li onClick={() => setMenu("FAQ")}>FAQ</li>
//             </ul>
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// };

// export default Navbar;








import React, { useState } from "react";
import "./Navbar.css";
import logo from "../Assets/KPR-Logo.jpg";
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [menu, setMenu] = useState("Home");

  const handleMenuClick = (name) => setMenu(name);

  return (
    <>
      {/* Top Navbar */}
      <div className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="KPR-Logo" />
        </div>

        <ul className="nav-menu">
          <li>
            <FaPhone style={{ marginRight: "8px" }} />
            +880-1234567890
          </li>
          <li>
            <MdEmail style={{ marginRight: "8px" }} />
            info@friendlyhelp.org
          </li>
        </ul>

        <NavLink to="/donation">
          <button className="donation-button">
            <FaHandHoldingHeart style={{ marginRight: "5px" }} />
            Donate
          </button>
        </NavLink>
      </div>

      {/* Secondary Navbar */}
      <div className="secondary-navbar">
        <ul className="secondary-menu">
          {/* Home */}
          <li className={menu === "Home" ? "active" : ""}>
            <NavLink
              to="/"
              className="nav-link"
              onClick={() => handleMenuClick("Home")}
            >
              Home
            </NavLink>
          </li>

          {/* About Us */}
          <li className={`dropdown ${menu === "About Us" ? "active" : ""}`}>
            About Us
            <ul className="dropdown-menu">
              <li>
                <NavLink
                  to="/who-we-are"
                  className="nav-link"
                  onClick={() => handleMenuClick("Who We Are")}
                >
                  Who We Are
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/mission-and-vision"
                  className="nav-link"
                  onClick={() => handleMenuClick("Mission & Vision")}
                >
                  Mission & Vision
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/reports"
                  className="nav-link"
                  onClick={() => handleMenuClick("Reports")}
                >
                  Reports
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Services */}
          <li className={`dropdown ${menu === "Services" ? "active" : ""}`}>
            Services
            <ul className="dropdown-menu">
              <li>
                <NavLink
                  to="/helpline-service"
                  className="nav-link"
                  onClick={() => handleMenuClick("Helpline Service")}
                >
                  Helpline Service
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/trainings-and-workshops"
                  className="nav-link"
                  onClick={() => handleMenuClick("Trainings and Workshops")}
                >
                  Trainings and Workshops
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/corporate-wellness"
                  className="nav-link"
                  onClick={() => handleMenuClick("Corporate Wellness Programme")}
                >
                  Corporate Wellness Programme
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Contact */}
          <li className={`dropdown ${menu === "Contact" ? "active" : ""}`}>
            Contact
            <ul className="dropdown-menu">
              <li>
                <NavLink
                  to="/contact-telephone"
                  className="nav-link"
                  onClick={() => handleMenuClick("Telephone")}
                >
                  Telephone
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact-mobile"
                  className="nav-link"
                  onClick={() => handleMenuClick("Mobile")}
                >
                  Mobile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/call-us"
                  className="nav-link"
                  onClick={() => handleMenuClick("Email")}
                >
                  Email / Call Us
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Volunteering */}
          <li className={`dropdown ${menu === "Volunteering" ? "active" : ""}`}>
            Volunteering
            <ul className="dropdown-menu">
              <li>
                <NavLink
                  to="/helpline-volunteer"
                  className="nav-link"
                  onClick={() => handleMenuClick("Helpline Volunteer")}
                >
                  Helpline Volunteer
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/non-helpline-volunteer"
                  className="nav-link"
                  onClick={() => handleMenuClick("Non-Helpline Volunteer")}
                >
                  Non-Helpline Volunteer
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/spread-the-word"
                  className="nav-link"
                  onClick={() => handleMenuClick("Spread the Word")}
                >
                  Spread the Word
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Publications */}
          <li className={`dropdown ${menu === "Publications" ? "active" : ""}`}>
            Publications
            <ul className="dropdown-menu">
              <li>
                <NavLink
                  to="/blog"
                  className="nav-link"
                  onClick={() => handleMenuClick("Blog")}
                >
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/research"
                  className="nav-link"
                  onClick={() => handleMenuClick("Research")}
                >
                  Research
                </NavLink>
              </li>
            </ul>
          </li>

          {/* More */}
          <li className={`dropdown ${menu === "More" ? "active" : ""}`}>
            More
            <ul className="dropdown-menu">
              <li>
                <NavLink
                  to="/resources"
                  className="nav-link"
                  onClick={() => handleMenuClick("Resources")}
                >
                  Resources
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/faq"
                  className="nav-link"
                  onClick={() => handleMenuClick("FAQ")}
                >
                  FAQ
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;

