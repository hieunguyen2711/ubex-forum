import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useEffect } from "react";



const Home = () => {
    console.log('Home component rendered')
    return (
      <div className="hero-section"> 
        <h1>UBEX Forum</h1>
        <h2>Welcome to Uber Experience Forum</h2>
        <h3>This is the place where you can share your Uber experience in different countries, states or cities.</h3>
        <h4>What are you waiting for? <span><Link to="/signup">Sign up</Link></span> or <span><Link to="/login">Log in</Link></span> to write a review right now</h4>
        
      </div>
    )
  }

export default Home;