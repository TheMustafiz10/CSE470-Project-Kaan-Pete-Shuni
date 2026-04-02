



import React, { useState } from "react";
import "./Homebody.css";
import helpingHand from "../Assets/helping-hand.jpg";
import depression from "../Assets/depression.jpg";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaClock, FaComments, FaHeart, FaUsers } from "react-icons/fa";

const Homebody = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { id: 1, image: depression },
    { id: 2, image: helpingHand },
  ];

  const features = [
    { icon: <FaClock />, title: "24/7 Support", description: "Round-the-clock assistance whenever you need it most" },
    { icon: <FaComments />, title: "Trained Listeners", description: "Our volunteers are trained to provide compassionate support" },
    { icon: <FaHeart />, title: "Completely Free", description: "All our services are provided at no cost to you" },
    { icon: <FaUsers />, title: "Community", description: "Join a supportive community that understands what you're going through" },
  ];

  const testimonials = [
    { name: "Sarah Rahman", text: "FriendlyHelp saved me during my darkest moments. I'm forever grateful." },
    { name: "Shikder Shaheb", text: "Volunteering here has given my life new purpose and meaning." },
    { name: "Shahriar Rana", text: "I didn't know where to turn until I found this amazing service." },
  ];

  const goPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="homebody">
      <section className="hero-slider">
        <div className="slider-container">
          <img
            src={slides[currentIndex].image}
            alt={`Slide ${currentIndex}`}
            className="slide-image"
          />

          {slides[currentIndex].image === depression && (
            <div className="overlay-text-left">
              <p>Are you Lonely?</p>
              <p>Distressed?</p>
              <p>Suicidal?</p>
              <h3>You are not alone. FriendlyHelp wants to hear from you!</h3>
              <Link to="/call-us" className="call-button">Call Us</Link>
            </div>
          )}

          {slides[currentIndex].image === helpingHand && (
            <div className="overlay-text right">
              <p>Ready to make a</p>
              <p>Difference</p>
              <h3>Join our Volunteer Team</h3>
              <Link to="/apply-now" className="apply-button">Apply Now</Link>
            </div>
          )}

          <MdOutlineKeyboardArrowLeft
            className="arrow left-arrow"
            onClick={goPrev}
          />
          <MdOutlineKeyboardArrowRight
            className="arrow right-arrow"
            onClick={goNext}
          />
          
          <div className="slider-indicators">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>


      <section className="features-section">
        <div className="container">
          <h2>How We Can Help</h2>
          <p className="section-subtitle">We provide compassionate support for those struggling with mental health challenges</p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="stats-section">
        <div className="container">
          <div className="stat">
            <h3>20+</h3>
            <p>Calls Handled Daily</p>
          </div>
          <div className="stat">
            <h3>30+</h3>
            <p>Trained Volunteers</p>
          </div>
          <div className="stat">
            <h3>24/7</h3>
            <p>Availability</p>
          </div>
          <div className="stat">
            <h3>95%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </div>
      </section>

     
     
      <section className="testimonials-section">
        <div className="container">
          <h2>What People Are Saying</h2>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.text}"</p>
                  <div className="testimonial-author">- {testimonial.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="cta-section">
        <div className="container">
          <h2>Need Someone to Talk To?</h2>
          <p>We're here to listen, without judgment, anytime you need</p>
          <div className="cta-buttons">
            <Link to="/call-us" className="cta-button primary">Call Now</Link>
            <Link to="/apply-now" className="cta-button secondary">Become a Volunteer</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homebody;