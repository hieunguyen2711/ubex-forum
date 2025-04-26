import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth'
import { useAuth } from '../../../contexts/authContext'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa'
import './LogIn.css'

const LogIn = () => {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if(!isSigningIn) {
            setIsSigningIn(true)
            try {
                await doSignInWithEmailAndPassword(email, password)
            } catch (error) {
                setErrorMessage(
                    error.code === 'auth/wrong-password' 
                        ? 'Incorrect password. Please try again.' 
                        : error.code === 'auth/user-not-found'
                            ? 'No account found with this email.'
                            : 'Failed to log in. Please try again.'
                    
                )
                setEmail('');
                setPassword('');
                
            } finally {
                setIsSigningIn(false)
            }
        }
    }

    const onGoogleSignIn = (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false)
            })
        }
    }

    return (
        <div>
            {userLoggedIn && <Navigate to="/home" />}
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Log In</h1>
                    </div>
                    <form onSubmit={onSubmit} className="login-form">
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
                            className="login-btn" 
                            disabled={isSigningIn}
                        >
                            {isSigningIn ? 'Signing in...' : 'Log In'}
                        </button>
                    </form>
                    <button 
                        onClick={onGoogleSignIn} 
                        className="google-btn" 
                        disabled={isSigningIn}
                    >
                        <FaGoogle />
                        {isSigningIn ? 'Signing in...' : 'Continue with Google'}
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <p className="signup-link">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LogIn