import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { auth } from "../firebase/firebase";
import './SideNav.css';

const SideNav = () => {
    const [userInfo, setUserInfo] = useState(null);
    const location = useLocation();
    const { userLoggedIn } = useAuth();


    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged((userInfo) => {
            if (userInfo) {
                setUserInfo({
                    email: userInfo.email,
                    displayName: userInfo.displayName || user.email.split('@')[0], // Fallback to email username if no display name
                    // photoURL: user.photoURL
                });
            } else {
                setUserInfo(null);
            }
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);
    // console.log('The user is: ', userInfo);


    return (
        <div className="side-nav">
            <div className="side-nav__header">
                <img src="./ubex -logo.png" alt="Ubex Logo" className="side-nav__logo" width="75px"/>
                {/* <h3 className="side-nav__title">Forum</h3> */}
            </div>
            

            {location.pathname !== '/home' && (<Link to="/home" className="back-to-forum-link">← Back to forum page</Link>)}
            <Link to="/createPost" className="new-post-link" >+ Create new post </Link>

            {userLoggedIn && userInfo && (
                <div className="side-nav__user">
                    <img 
                        src="./user.jpg" 
                        alt="User Avatar" 
                        className="side-nav__user-avatar" 
                        width="30px"
                    />
                    <div className="side-nav__user-info">
                        <h4 className="side-nav__user-name">{userInfo.displayName}</h4>
                        <p className="side-nav__user-email">{userInfo.email}</p>
                    </div>
                </div>
            )}

            <Link to="/" 
                className="side-nav__logout-btn" 
                onClick={doSignOut}
            >
                Log Out
            </Link>
        </div>
    )
}

export default SideNav;