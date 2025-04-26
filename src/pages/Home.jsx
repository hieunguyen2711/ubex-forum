import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import './Home.css';

const Home = () => {
    return (
        <div className="hero-section">
            <div className="hero-content">
                <h1>UBEX Forum</h1>
                <h2>Welcome to Uber Experience Forum</h2>
                <h3>
                    This is the place where you can share your Uber experience in different countries, 
                    states or cities. Join our community to discover insights, share stories, and connect 
                    with fellow travelers from around the world.
                </h3>
                <div className="cta-container">
                    <Link to="/signup">Sign up</Link>
                    <Link to="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;