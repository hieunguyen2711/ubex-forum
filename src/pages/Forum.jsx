import React, { useState, useEffect} from "react";

import SideNav from "../components/SideNav";
import './Forum.css';
import Post from "../components/Post";
import { supabase } from "../client";


const Forum = () => {

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

    const [countries, setCountries] = useState([]);
    // const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [posts, setPosts] = useState([]);
    const [sortOption, setSortOption] = useState('1');
    const [searchInput, setSearchInput] = useState("");

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
        const fetchAllPosts = async () => {
            try {
                let query = supabase
                    .from('ubex-db')
                    .select("*")
                switch(sortOption) {
                    case '1': // Recent
                        query = query.order('created_at', { ascending: false });
                        break;
                    case '2': // Oldest
                        query = query.order('created_at', { ascending: true });
                        break;
                    case '3': // Most upvotes
                        query = query.order('upvotes', { ascending: true });
                        break;
                    case '4': // Most downvotes
                        query = query.order('upvotes', { ascending: false });
                        break;
                    default:
                        query = query.order('created_at', { ascending: false });
                }



                
                const { data, error } = await query;
                    
                if (error) { throw error;}
                setPosts(data)
                console.log("here is your data:", data);
           } catch (error) {
                console.error('Error fetching posts:', error.message);
                setError(error.message);
           }
        };
        fetchAllPosts();
    },[sortOption])

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            handleSearch(searchInput);
        }, 500); // Delay search by 500ms to avoid too many requests
    
        return () => clearTimeout(delaySearch);
    },[searchInput])

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedCity === "" || selectedCountry === "" ) {
                alert("Missing field");
                return;
            }
            if (selectedCountry === "United States" && !selectedState) {
                alert("Missing fields");
                return;
            }
            let query = supabase
                .from('ubex-db')
                .select("*")
                .ilike('country', `%${selectedCountry}%`)
            if (selectedCountry === "United States" || selectedState) {
                query = query.ilike('state', `%${selectedState}%`);
            }

            if (selectedCity.trim()) {
                query = query.ilike('city', `%${selectedCity}%`);
            }

            const {data, error} = await query;
                
            if (error) throw error;

            if (data) {
                setPosts(data);
                console.log("Filter successful: ", data)
            } else {
                setPosts([])
            }
                
        } catch (error) {
            console.error("Error filter post: ", error.message);
            alert("Error filtering your post. Try again!")
        }
    }

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

    const handleSearch = async (searchTerm) => {
        try {
            let query = supabase
                .from('ubex-db')
                .select('*');
    
            if (searchTerm) {
                query = query.ilike('title', `%${searchTerm}%`);
            }
    
            const { data, error } = await query;
    
            if (error) throw error;
    
            setPosts(data);
            console.log("Search results:", data);
        } catch (error) {
            console.error("Error searching posts:", error.message);
            setError(error.message);
        }
    };
    
    return (
        <div className="forum-container">
            {/* <SideNav /> */}
            <div className="forum-main">
                <h1>Forum</h1>
                <input
                    placeholder="Search for post title here"
                    type="text"
                    id="title-search"
                    value={searchInput}
                    onChange={(e => setSearchInput(e.target.value))}
                
                />
                <label htmlFor="name">Sort</label>
                <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="1">Recent</option>
                    <option value="2">Oldest</option>
                    <option value="3">Low to High</option>
                    <option value="4">Hight to Low</option>
                </select>
                <form onSubmit={onSubmit} className="forum-form">
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
                        <label htmlFor="city">City:</label>
                        <input 
                            type="text" 
                            name="city"
                            id="city"
                            placeholder="Enter a city"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Filter</button>
                </form>
                {posts && posts.map((post) => (
                    <Post key={post.id} post={post}/>
                )) }
            </div>
        </div>
    )
};

export default Forum;