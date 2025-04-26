import React, {useEffect, useState} from "react";
import { supabase } from '../client';
import { useAuth } from "../contexts/authContext";

const CreatePost = () => {
    const { currentUser } = useAuth();
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

    // const { data, error } = await supabase.storage.createBucket('avatars')
    const [post, setPost] = useState({
        country: '',
        state: '',
        city: '',
        title: '',
        priceThoughts: '',
        waitTimeThoughts: '',
        content: '',
        imageUrl: '',
        upvotes: 0,
        author: "",
    })
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

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadImage();
                console.log("Here is the image link:", imageUrl);
            }
    
            const response = await supabase
                .from("ubex-db")
                .insert({
                    country: selectedCountry,
                    state: selectedState,
                    city: selectedCity,
                    title: post.title || '',
                    price: post.priceThoughts,
                    waittime: post.waitTimeThoughts,
                    url: imageUrl,
                    upvotes: 0,
                    content: post.content || '',
                    author: currentUser.email || "Anonymous"
                })
                .select();
    
            // Get status from response
            const status = response.status;
            const { data, error } = response;
    
            if (error) {
                throw error;
            }
    
            console.log('Insert successful:', data);
            console.log('Status code:', status);
            
            // Reset form after successful insert
            setPost({
                country: '',
                state: '',
                city: '',
                priceThoughts: '',
                waitTimeThoughts: '',
                imageUrl: ''
            });
            setImageFile(null);
            setSelectedCountry('');
            setSelectedState('');
            setSelectedCity('');
    
            // Show success message with status code
            alert(`Post Created Successfully! Status: ${status}`);
    
            // Navigate after successful insert
            window.location = '/home';
    
        } catch (error) {
            console.error("Error creating new post:", error.message);
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
                console.log(value);
                break;
            case 'states':
                setSelectedState(value);
                setSelectedCity('');
                console.log(value);
                break;
            case 'city':
                setSelectedCity(value);
                console.log(value);

        }

        
    }

    return (
        <div className="container">
            {/* <SideNav/> */}
            <h2>Create your post and share your experience now!</h2>
            <div className="new-post-container">
                <form onSubmit={onSubmit}>
                    <label >Title</label>
                    <input type="text" placeholder="Enter your post title" onChange={(e) => setPost({...post, title: e.target.value})} />
                <div className="form-group">
                        <label htmlFor="country">Country:</label>
                        <select 
                            id="Country"
                            name="country"
                            // value={post.village}
                            onChange={handleChange}
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
                        <label htmlFor="states">State:</label>
                        <select 
                            id="states"
                            name="states"
                            // value={post.village}
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
                        <label >City:</label>
                        <input 
                            type="text" 
                            name="city"
                            value={selectedCity}
                            placeholder="Enter a city"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <h3>Share your thoughts on Uber's price range in your location:</h3>
                    <textarea name="price" id="price-thoughts" rows="2" cols="40" placeholder="Enter here" onChange={(e) => setPost({...post, priceThoughts: e.target.value})} required></textarea><br />
                    <h3>Share your wait time for Uber in your location</h3>
                    <textarea name="time" id="waittime-thoughts" rows="2" cols="40" placeholder="Enter here" onChange={(e) => setPost({...post, waitTimeThoughts: e.target.value})} required></textarea><br />
                    <h3>Any other comments?</h3>
                    <textarea name="des" id="comments" rows="8" cols="40" placeholder="Enter here" onChange={(e) => setPost({...post, content: e.target.value})}></textarea><br />
                    <div className="form-group">
                        <label htmlFor="image">Upload Image:</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control"
                        />
                        {imageFile && (
                            <div className="preview">
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Preview"
                                    style={{ maxWidth: '200px' }}
                                />
                            </div>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        disabled={uploading}
                    >
                        {uploading ? 'Creating Post...' : 'Create Post'}
                    </button>
                
                </form>
                {/* <button>Cancel</button> */}
            </div>

        </div>
    )
}


export default CreatePost;