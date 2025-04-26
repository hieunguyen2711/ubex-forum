import React from "react";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from "../../../firebase/auth";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import './Register.css';

const Register = () => {   
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        if (!isSigningUp) {
            setIsSigningUp(true);
            e.preventDefault();
            try {
                await doCreateUserWithEmailAndPassword(email, password);
            } catch (error) {
                setErrorMessage(error.message);
                setIsSigningUp(false);
            }
        }
    }

    const onGoogleSignUp = (e) => {
        e.preventDefault();
        if (!isSigningUp) {
            setIsSigningUp(true);
            doSignInWithGoogle().catch(err => {
                setErrorMessage(err.message);
                setIsSigningUp(false);
            });
        }
    }

    return (
        <div>
            {userLoggedIn && <Navigate to="/home" />}
            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <h1>Create Account</h1>
                        <p>Join our community and start sharing your experiences</p>
                    </div>
                    <form onSubmit={onSubmit} className="register-form">
                        <div className="form-group">
                            <FaUser className="form-icon" />
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <FaEnvelope className="form-icon" />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <FaLock className="form-icon" />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="register-btn" 
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                    <div className="divider">
                        <span>or</span>
                    </div>
                    <button 
                        onClick={onGoogleSignUp} 
                        className="google-btn" 
                        disabled={isSigningUp}
                    >
                        <FaGoogle />
                        {isSigningUp ? 'Signing up...' : 'Continue with Google'}
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <p className="login-link">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;