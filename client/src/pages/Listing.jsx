import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { useSelector } from 'react-redux';
import { FaBed, FaMapMarkerAlt, FaBath, FaParking, FaChair , FaShare} from 'react-icons/fa';
import Contact from '../components/Contact';

const Listing = () => {
    SwiperCore.use([Navigation])
    const [contact, setContact] = React.useState(false);
    const params = useParams();
    const [listing, setListing] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const user = useSelector((state) => state.user.user);
    const [copied, setCopied] = React.useState(false);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success) {
                    setLoading(false);
                    setError(false);
                    setListing(data.listing);
                } else {
                    setError(true);
                    setLoading(false);
                }
            } catch {
                setError(true);
                setLoading(false);
            }

        }
        fetchListing();
    }, [params.listingId])
    return (
        <main>{loading && <p className='loading text-center my-7 text-gray-500 text-2xl'>Loading...</p>}
            {error && <p className='error text-center my-7 text-red-500 text-2xl'>Error loading listing.</p>}
            {listing && !loading && !error && (
                <>
                    <Swiper navigation>
                        {listing.imageUrls?.length > 0 ? (
                            listing.imageUrls.map((url, index) => (
                                <SwiperSlide key={index}>
                                    <div
                                        className="h-[350px] bg-cover bg-center bg-no-repeat"
                                        style={{ backgroundImage: `url(${url})` }}
                                    />
                                </SwiperSlide>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No images available</p>
                        )}
                    </Swiper>
                    <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-11 h-11 flex justify-center items-center bg-slate-100 cursor-pointer">
                        <FaShare
                            className="text-slate-500"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    window.location.href
                                );
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                    {copied && (
                        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                            Link copied!
                        </p>
                    )}

                    <div className='items-center p-3 max-w-4xl mx-auto'>
                        <div className='flex'>
                            {listing.type === 'rent' ? (
                                <h2 className='text-2xl font-bold mb-1'>{listing.name} - {!listing.offer ? `Rs${listing.regularPrice}/Month` : `Rs${listing.discountPrice}/Month`}</h2>
                            ) : (
                                <h2 className='text-2xl font-bold mb-1'>{listing.name} - {!listing.offer ? `Rs${listing.regularPrice}` : `Rs${listing.discountPrice} (Discounted)`}</h2>
                            )}
                        </div>
                        <p className='flex items-center mt-3 mb-2 gap-2 text-slate-600'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>
                        <div className='flex gap-1'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-2 rounded-md'>{listing.type === 'rent' ? 'For Rent' : 'For Sale'}</p>
                            {listing.offer && <p className='bg-green-700 w-full max-w-[200px] text-white text-center p-2 rounded-md'>Discount : Rs {+listing.regularPrice - +listing.discountPrice} </p>}
                        </div>
                        <div className='flex mt-2 gap-1'>
                            <p className='font-semibold'>Description - </p>
                            <p className='text-gray-800'>{listing.description}</p>
                        </div>
                        <ul className='flex flex-wrap text-green-900 font-semibold text-sm gap-4 sm:gap-6 items-center mt-3'>
                            <li className='flex items-center gap-1 whitespace-nowrap'><FaBed className='text-lg' /> {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `1 Bed`}</li>
                            <li className='flex items-center gap-1 whitespace-nowrap'><FaBath className='text-lg' /> {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `1 Bath`}</li>
                            <li className='flex items-center gap-1 whitespace-nowrap'><FaParking className='text-lg' /> {listing.parking === true ? ` Parking Available` : `No Parking`}</li>
                            <li className='flex items-center gap-1 whitespace-nowrap'><FaChair className='text-lg' /> {listing.furnished ? `Furnished` : `Unfurnished`} </li>
                        </ul>
                    </div>
                    <div className='text-center my-7 '>
                        {user && listing.userRef !== user._id && !contact && (
                            <button onClick={()=>setContact(true)} className='bg-blue-500 text-white p-2 w-1/2 rounded-md uppercase hover:opacity-80'>
                                Contact Agent
                            </button>
                        )}
                    </div>
                    {contact && <Contact listing={listing} />}
                </>
            )}
        </main>
    )
}

export default Listing