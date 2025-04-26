import React from "react";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from "../../../firebase/auth";
import { Link } from "react-router-dom";

const Register = () => {   
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningUp, setIsSigningUp] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        if (!isSigningUp) {
            setIsSigningUp(true)
            e.preventDefault()
            try {
                await doCreateUserWithEmailAndPassword(email, password)
            } catch (error) {
                setErrorMessage(error.message)
                setIsSigningUp(false)
            }
        }
    }

    const onGoogleSignUp = (e) => {
        e.preventDefault();
        if (!isSigningUp) {
            setIsSigningUp(true)
            doSignInWithGoogle().catch(err => {
                setErrorMessage(err.message)
                setIsSigningUp(false)
            })
        }
    }
    console.log('Register component rendered')
    return (
        <div>
            {userLoggedIn && <Navigate to="/home" />}
            <h1>Register</h1>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <form className="register-form" onSubmit={onSubmit}>
                <input type="text" placeholder="Username" required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" disabled={isSigningUp}>Register</button>
            </form>
            <button onClick={onGoogleSignUp} disabled={isSigningUp}>Continue with Google</button>
            <p>Already have an account? <span> 
                <Link to="/login">Log in </Link>
                </span></p>
        </div>
    )
}

export default Register;