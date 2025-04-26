import React, { useEffect, useState } from "react";
import { supabase } from "../client";
import { useAuth } from "../contexts/authContext";
import { Link, useLocation } from "react-router-dom";
import { parseISO, format } from 'date-fns';
import ReadPost from "../pages/ReadPost";
// import './Post.css';

const Post = ({ post }) => {
    const location = useLocation();
    const { currentUser } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [upvotes, setUpvotes] = useState(post.upvotes || 0);
    const [isUpdating, setIsUpdating] = useState(false);
    const date  = parseISO(post.created_at);

    const handleUpvote = async () => {
        if (isUpdating) return;

        try {
            setIsUpdating(true);
            setUpvotes(prev => prev + 1);
            const {error} = await supabase
                .from('ubex-db')
                .update({upvotes: upvotes + 1})
                .eq('id', post.id);

            if (error) {
                setUpvotes(prev => prev - 1);
                throw error;
            }
        } catch (error) {
            console.error("Error update upvotes:", error.message);
        } finally {
            setIsUpdating(false);
            console.log("upvote update successfully");
        }
    }

    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || currentUser.email.split('@')[0]);
        }
    }, [currentUser]);



    return (
        <div className="post-container">
            <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <div className="post-location">
                    <span className="post-country">{post.country}</span>
                    {post.state && <span className="post-state">, {post.state}</span>}
                    <span className="post-city">, {post.city}</span>
                </div>
            </div>
            
            <div className="post-content">
                <div className="post-details">
                    <div className="post-price">
                        <h3>Price Range:</h3>
                        <p>{post.price}</p>
                    </div>
                    <div className="post-wait-time">
                        <h3>Wait Time:</h3>
                        <p>{post.waittime}</p>
                    </div>
                    {post.content && (
                        <div className="post-additional">
                            <h3>Additional Comments:</h3>
                            <p>{post.content}</p>
                        </div>
                    )}
                </div>
                
                {post.url && (
                    <div className="post-image">
                        <img src={post.url} alt="Post content" width="350px" onClick={() => window.open(post.url)} style={{cursor: 'pointer'}}/>
                    </div>
                )}
            </div>

            <div className="post-footer">
                <div className="post-meta">
                    <span className="post-username">Posted on {format(date, "MMMM dd, yyyy 'at' HH:mm:ss")} by {post.author ? post.author.split('@')[0] : 'Anonymous'}</span>
                    <button className="post-upvote-btn" onClick={handleUpvote} disabled={isUpdating}>
                        <span className="arrow">↑</span>
                        <span className="count">{upvotes}</span>
                    </button>
                    {currentUser && currentUser.email === post.author && location.pathname !== `/view/${post.id}` && (<Link to={`/edit/${post.id}`}>Edit your post here</Link>)}
                    
                    
                    {location.pathname !== `/view/${post.id}` && (<Link to={`/view/${post.id}`}>View Comments</Link>)}
                </div>
            </div>
        </div>
    );
};

export default Post;