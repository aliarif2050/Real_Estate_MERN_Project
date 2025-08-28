import { set } from 'mongoose';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';   
import {Swiper , SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'

const Listing = () => {
    SwiperCore.use([Navigation])    
    const params = useParams();
    const [listing, setListing] = React.useState(null); 
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
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
            } catch (error) {
                setError(true);
                setLoading(false);
            }
           
        }
        fetchListing();
    },[params.listingId])
  return (
    <main>{loading && <p className='loading text-center my-7 text-gray-500 text-2xl'>Loading...</p>}
    {error && <p className='error text-center my-7 text-red-500 text-2xl'>Error loading listing.</p>}
    {listing && !loading && !error && (
        <>
        <Swiper navigation>
            {listing.imageUrls.map((url, index) => (
                <SwiperSlide key={index}>
                    <div className='h-[350px] ' 
                    style={{ background: `url(${url})` , backgroundSize: 'cover', backgroundPosition: 'center', noRepeat: 'no-repeat'}}>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        </>
    )}
    </main>
)
}

export default Listing