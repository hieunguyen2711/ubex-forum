import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../client";
import { useAuth } from "../contexts/authContext";
import Post from "../components/Post";
import { parseISO, format } from "date-fns";

const ReadPost = () => {

    const {id} = useParams();
    // const
    const {currentUser} = useAuth();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    
    const [displayName, setDisplayName] = useState("");
    
    
    const [post, setPost] = useState(null)
    useEffect(() => {
        const fetchPost = async () => {
            try {
                // setIsLoading(true);
                const {data, error} = await supabase
                    .from('ubex-db')
                    .select("*")
                    .eq("id", id)
                    .single()
                if (error) throw error;
                if (data) {
                    setPost(data);
                    console.log("The single post is here:", data)
                }

            } catch (error) {
                console.error("Error fetching one post:", error.message);
            } finally {
                setIsLoading(false)
            }
        };

        if (id) {
            fetchPost();
        }
    },[id])
    useEffect(() => {
        const fetchAllComments = async () => {
            try{
                const {data, error} = await supabase
                    .from("comments-db")
                    .select("*")
                    .eq("post_id",id)

                if (error) throw error
                if (data) {
                    setComments(data);
                    console.log("Here is the comments for post:", data);
                }
            } catch (error) {
                console.error("Error fetching comments:", error.message)
            }
        }
        fetchAllComments();
    },[id])

    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.email.split('@')[0] || "anonymous");
            console.log("Here is the username:", currentUser.displayName)
        }
    }, [currentUser]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert("You must sign in to continue");
            return;
        }
        if (!newComment.trim()) return;
        try {
            setIsAddingComment(true);
            const {data, error} = await supabase
                .from("comments-db")
                .insert([
                    {
                        post_id: id,
                        username: displayName,
                        comment: newComment
                    }
                ])
                .select();
            if (error) throw error;
            setComments([...comments, data[0]]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding new comment:", error.message);
        } finally {
            setIsAddingComment(false);
        }
    }


    return (
        <div>
            <div className="post-thread-container">
                {post && <Post post={post}/>}
            </div>
            <div className="post-comment-container">
                <h3>Comments:</h3>
                {comments && comments.length > 0 && (
                    <div>
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <p>
                                     {comment.username || 'Anonymous'} said: {`"${comment.comment}"`} on {format(parseISO(comment.created_at), "MMMM dd, yyyy ")}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                )}

                <form onSubmit={handleAddComment}>
                    <textarea 
                        placeholder="Enter your comment" 
                        rows="4" 
                        cols="30"
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                    >

                    </textarea>
                    <button type="submit" disabled={isAddingComment}>
                        {isAddingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>


            </div>

        </div>
    )
}

export default ReadPost;