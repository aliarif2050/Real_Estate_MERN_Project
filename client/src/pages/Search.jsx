import { useEffect, useState } from 'react'
import { FaSleigh } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';


const Search = () => {
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    console.log(listings)
    const location = useLocation();
    const [showMore, setShowMore] = useState(false)

    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "createdAt",
        order: "desc"
    });
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')

        if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc'
            });
        }
        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            try {
                const searchQuery = urlParams.toString();
                const response = await fetch(`/api/listing/get?${searchQuery}`);
                const data = await response.json();
                if (data.length > 8) {
                    setShowMore(true);
                }
                else {
                    setShowMore(false);
                }
                setListings(data.listings || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching listings:", error);
                setLoading(false);
            }

        };
        fetchListings();
    }, [location.search]);
    const handleChange = (e) => {
        if (e.target.id === "all" || e.target.id === "sale" || e.target.id === "rent") {
            setSidebardata((prev) => ({
                ...prev,
                type: e.target.id,
            }));
        }

        if (e.target.id === "searchTerm") {
            setSidebardata((prev) => ({
                ...prev,
                searchTerm: e.target.value,
            }));
        }

        if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
            setSidebardata((prev) => ({
                ...prev,
                [e.target.id]: e.target.checked ? true : false
            }));
        }

        if (e.target.id === "sort_order") {
            const [sort, order] = e.target.value.split("_");

            setSidebardata((prev) => ({
                ...prev,
                sort: sort || 'createdAt',
                order: order || 'desc',
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set("searchTerm", sidebardata.searchTerm);
        urlParams.set("type", sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`);

        console.log(urlParams.toString());
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };
    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-1 md:border-r-1 md:min-h-screen sm:max-w-sm'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div className='flex items-center gap-2 '>
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <input type="text" id='searchTerm'
                            placeholder='Search' value={sidebardata.searchTerm} onChange={handleChange}
                            className='border rounded-lg p-3 w-full' />
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <label className='font-semibold'>Type:</label>

                        <div className='flex gap-3'>
                            <input type="checkbox"
                                id="all" className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === "all"}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type="checkbox"
                                id="sale" className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === "sale"}
                            />
                            <span>For Sale</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type="checkbox" onChange={handleChange}
                                checked={sidebardata.type === "rent"}
                                id="rent" className='w-5' />
                            <span>For Rent</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type="checkbox" onChange={handleChange}
                                checked={sidebardata.offer}

                                id="offer" className='w-5' />
                            <span>On Offer</span>
                        </div>

                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <label className='font-semibold'>Amenities:</label>
                        <div className='flex gap-3'>
                            <input type="checkbox" onChange={handleChange}
                                checked={sidebardata.parking}
                                id="parking" className='w-5' />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type="checkbox" onChange={handleChange}
                                checked={sidebardata.furnished}
                                id="furnished" className='w-5' />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <label className='font-semibold'>Sort By:</label>
                        <select onChange={handleChange} defaultValue={'createdAt_desc'}
                            id="sort_order" className='border rounded-lg p-3'>
                            <option value="regularPrice_desc">Price: High to Low</option>
                            <option value="regularPrice_asc">Price: Low to High</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-80'>Search</button>
                </form>
            </div>
            <div className='p-7 flex-1'>
                <h1 className='text-slate-700 text-2xl font-semibold border-b'>Search Results:</h1>
                <div className='p-7 flex flex-wrap gap-6'>
                    {!loading && listings.length === 0 &&
                        <p className='text-red-500 text-xl'>No Listings found.</p>}
                    {loading && <p className='text-blue-500 text-lg items-center'>Loading...</p>}
                    {!loading && listings.length > 0 && listings.map(listing => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))}
                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className='text-green-700 hover:underline p-7 text-center w-full'
                        >
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Search