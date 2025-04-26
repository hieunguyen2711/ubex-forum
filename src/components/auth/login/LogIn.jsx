import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth'
import { useAuth } from '../../../contexts/authContext'
import { useNavigate } from 'react-router-dom'

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
                // setIsSigningIn(false)
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
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold mb-4">Log In</h1>
                <form onSubmit={onSubmit} className="flex flex-col w-80">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2 p-2 border border-gray-300 rounded" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-2 p-2 border border-gray-300 rounded" required />
                    <button type="submit" className={`bg-blue-500 text-white p-2 rounded ${isSigningIn ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSigningIn}>Log In</button>
                </form>
                <button onClick={onGoogleSignIn} className={`bg-red-500 text-white p-2 rounded mt-4 ${isSigningIn ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSigningIn}>Log In with Google</button>
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                <p className="mt-4">Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link></p>
            </div>
            {/* <form action=""> */}

            {/* </form> */}
        </div>
    )
}

export default LogIn;