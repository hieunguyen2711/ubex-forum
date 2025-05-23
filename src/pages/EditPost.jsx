import React, {useState, useEffect, useRef} from "react";
import { supabase } from "../client";
import { Link, useParams, useNavigate } from "react-router-dom";
import './EditPost.css';

const EditPost = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const US_STATES = [
            'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
            'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
            'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
            'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
            'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
            'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
            'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
            'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
            'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
            'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
        ];

    const {id} = useParams();

    // const { data, error } = await supabase.storage.createBucket('avatars')
    const [post, setPost] = useState({});
    const [countries, setCountries] = useState([]);
    // const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');

    const [prevImgFile, setPrevImgFile] = useState(null);
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    }

    const uploadImage = async () => {
        try {
            setUploading(true);
            if (!imageFile) {
                throw Error("You must select an image");
            }

            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
            const filePath = `public/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from('ubex-photos')
                .upload(filePath, imageFile, {
                    upsert: true,
                    cacheControl: '3600',
                    contentType: imageFile.type
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('ubex-photos')
                .getPublicUrl(filePath);

            return publicUrl;

        } catch (error) {
            console.error('Error uploading image:', error.message);
            throw error;
        } finally {
            setUploading(false);
        }
    }

    const handleDeleteImage = async (e) => {
        e.preventDefault(); // Prevent form submission
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeleteExistingImage = async (e) => {
        e.preventDefault();
        try {
            if (prevImgFile) {
                const { error: storageError } = await supabase.storage
                    .from('ubex-photos')
                    .remove([prevImgFile]);

                if (storageError) {
                    console.error("Error deleting picture in storage:", storageError.message);
                    throw storageError;
                }
            }
            
            // Clear the image URL from the post
            setNewImageUrl('');
            setPrevImgFile(null);
            
        } catch (error) {
            console.error("Error deleting existing image:", error.message);
            alert("Failed to delete image. Please try again.");
        }
    };

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch countries');
                }
                const data = await response.json();
                const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
                setCountries(sortedCountries);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchCountries();
    },[])

    useEffect(() => {
        const fetchSinglePost = async () => {
            try {
                const {data, error} = await supabase
                    .from('ubex-db')
                    .select("*")
                    .eq('id', id)
                    .single();
    
                if (error) throw error;
    
                if (data) {
                    console.log("here is your post data:", data);
                    setPost(data);
                    setSelectedCity(data.city);
                    setSelectedState(data.state);
                    setSelectedCountry(data.country);
                    setNewImageUrl(data.url);
                }

                if (data.url) {
                    const urlParts = data.url.split('ubex-photos/');
                    if (urlParts.length > 1) {
                        const filePath = urlParts[1];
                        setPrevImgFile(filePath)
                    }
                }
            } catch (error) {
                console.error("error fetching single post:", error.message);
            }
        };
    
        // Move this outside the function definition
        if (id) {
            fetchSinglePost();
        }
    }, [id]); // Add id as dependency

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = newImageUrl;
            if (imageFile) {
                imageUrl = await uploadImage();
                console.log("Here is the image link:", imageUrl);
            }
    
            const response = await supabase
                .from("ubex-db")
                .update({
                    country: selectedCountry,
                    state: selectedState,
                    city: selectedCity,
                    title: post.title || '',
                    price: post.priceThoughts,
                    waittime: post.waitTimeThoughts,
                    url: imageUrl,
                    upvotes: 0,
                    content: post.content || ''
                })
                .eq('id', id)
                .select();
    
            // Get status from response
            const status = response.status;
            const { data, error } = response;
    
            if (response.error) {
                throw response.error;
            }
    
            console.log('Insert successful:', data);
            console.log('Status code:', status);
    
            // Show success message with status code
            alert(`Post Created Successfully! Status: ${status}`);
    
            // Navigate after successful insert
            navigate('/home');
    
        } catch (error) {
            console.error("Error creating new post:", error.message);
            alert(error.message);
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        switch(name) {
            case 'country': 
                setSelectedCountry(value);
                setSelectedState('');
                setSelectedCity('');
                setPost({...post, country: value, state: '', city: ''});
                break;
            case 'states':
                setSelectedState(value);
                setSelectedCity('');
                setPost({...post, state: value, city: ''});
                break;
            case 'city':
                setSelectedCity(value);
                setPost({...post, city: value});
                break;
            default:
                break;
        }
    }

    const handleDeletePost = async (e) => {
        e.preventDefault();
        try {
            if (prevImgFile) {
                const {error: storageError} = await supabase.storage
                    .from('ubex-photos')
                    .remove([prevImgFile]);
            

            if (storageError) {
                console.error("Error deleting picture in storage:", storageError.message)
            }
        }
            const {commentError} = await supabase
                .from("comments-db")
                .delete()
                .eq('post_id', id)
            if (commentError) throw commentError
            
            const {error} = await supabase
                .from('ubex-db')
                .delete()
                .eq('id', id);
            if (error) { throw error};
            
            navigate('/home');
        } catch (error) {
            console.log("Error deleting post:", error.message);
        }
        

    }

    return (
        <div className="container">
            {/* <SideNav/> */}
            <h2>Edit your post</h2>
            <div className="new-post-container">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input 
                            type="text" 
                            id="title"
                            placeholder="Enter your post title" 
                            value={post.title || ''} 
                            onChange={(e) => setPost({...post, title: e.target.value})} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <select 
                            id="country"
                            name="country"
                            onChange={handleChange}
                            value={selectedCountry}
                            required
                        >
                            <option value="">Select a Country</option>
                            {countries && countries.map((country) => (
                                <option key={country.cca2} value={country.name.common}>
                                    {country.name.common}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="states">State</label>
                        <select 
                            id="states"
                            name="states"
                            value={selectedState}
                            onChange={handleChange}
                            disabled={selectedCountry !== "United States"}
                            required
                        >
                            <option value="">Select State</option>
                            {US_STATES && US_STATES.map((state) => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input 
                            type="text" 
                            id="city"
                            name="city"
                            value={selectedCity}
                            placeholder="Enter a city"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <h3>Share your thoughts on Uber's price range in your location:</h3>
                    <div className="form-group">
                        <textarea 
                            name="price" 
                            id="price-thoughts" 
                            placeholder="Enter here" 
                            value={post.price} 
                            onChange={(e) => setPost({...post, priceThoughts: e.target.value})} 
                            required
                        ></textarea>
                    </div>

                    <h3>Share your wait time for Uber in your location</h3>
                    <div className="form-group">
                        <textarea 
                            name="time" 
                            id="waittime-thoughts" 
                            placeholder="Enter here" 
                            value={post.waittime} 
                            onChange={(e) => setPost({...post, waitTimeThoughts: e.target.value})} 
                            required
                        ></textarea>
                    </div>

                    <h3>Any other comments?</h3>
                    <div className="form-group">
                        <textarea 
                            name="des" 
                            id="comments" 
                            placeholder="Enter here" 
                            value={post.content} 
                            onChange={(e) => setPost({...post, content: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Upload Image</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />
                        {imageFile && (
                            <>
                                <button onClick={handleDeleteImage}>Remove Image</button>
                                <div className="image-preview">
                                    <img
                                        src={URL.createObjectURL(imageFile)}
                                        alt="New Image preview"
                                    />
                                </div>
                            </>
                        )}
                        
                        {!imageFile && newImageUrl && (
                            <>
                                <button onClick={handleDeleteExistingImage}>Delete Existing Image</button>
                                <div className="image-preview">
                                    <img 
                                        src={newImageUrl}
                                        alt="Post picture"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={uploading}
                    >
                        {uploading ? 'Saving...' : 'Save your changes'}
                    </button>
                </form>
                <button onClick={handleDeletePost}>Delete Post</button>
                <Link to='/home'>Cancel</Link>
            </div>

        </div>
    )
}

export default EditPost;