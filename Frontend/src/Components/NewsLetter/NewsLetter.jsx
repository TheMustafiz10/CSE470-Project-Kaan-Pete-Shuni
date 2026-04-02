


import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NewsLetter.css";

const NewsLetter = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messageType, setMessageType] = useState(""); 

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (message) {
            setMessage("");
            setMessageType("");
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setMessage("Please enter your email address.");
            setMessageType("error");
            return;
        }

        if (!validateEmail(email.trim())) {
            setMessage("Please enter a valid email address.");
            setMessageType("error");
            return;
        }

        setIsLoading(true);
        setMessage("");
        setMessageType("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/newsletter/subscribe", 
                { email: email.trim() },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 
                }
            );

            setMessage(response.data.message || "Successfully subscribed to our newsletter!");
            setMessageType("success");
            setEmail("");
            
            console.log("Newsletter subscription successful:", response.data);
            
        } catch (error) {
            console.error("Newsletter subscription error:", error);
            
            let errorMessage = "Failed to subscribe. Please try again!";
            
            if (error.response) {
                if (error.response.status === 409) {
                    errorMessage = error.response.data.message || "You're already subscribed to our newsletter!";
                } else if (error.response.status === 400) {
                    errorMessage = error.response.data.message || "Please check your email address.";
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                errorMessage = "Network error. Please check your connection and try again.";
            }
            
            setMessage(errorMessage);
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="newsletter">
            <h1>"Stay Connected with Kindness, Care, and Guidance"</h1>
            <p>Subscribe to our newsletter and stay updated with our latest news and events</p>
            
            <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="input-container">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={`newsletter-input ${messageType === 'error' ? 'error' : ''}`}
                        autoComplete="email"
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !email.trim()}
                        className="subscribe-button"
                    >
                        {isLoading ? "Subscribing..." : "Subscribe"}
                    </button>
                </div>
            </form>
            
            {message && (
                <div className={`message ${messageType}`}>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default NewsLetter;