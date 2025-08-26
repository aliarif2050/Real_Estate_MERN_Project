import React from 'react'

const CreateListing = () => {
    const [file, setFiles] = React.useState([]);
    const [error, setError] = React.useState("");
    const [imageUrls, setImageUrls] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [listingLoading, setListingLoading] = React.useState(false);
    console.log(file);
    const handleUpload = async (e) => {
        e.preventDefault();
        setError("");
        if (file.length > 6) {
            setError("Max 6 images can be uploaded");
            return;
        }
        if (file.length === 0) {
            setError("Please select at least one image");
            return;
        }
        // Check file size for each image
        for (let i = 0; i < file.length; i++) {
            if (file[i].size > 2 * 1024 * 1024) { // 2MB in bytes
                setError("Image should be less than 2mb");
                return;
            }
        }
        setLoading(true);
        try {
            const uploadPromises = [];
            for (let i = 0; i < file.length; i++) {
                uploadPromises.push(storeImage(file[i]));
            }
            const urls = await Promise.all(uploadPromises);
            setImageUrls(urls); // Array of uploaded image URLs
            // You can now use imageUrls when submitting the listing
            console.log('Uploaded image URLs:', urls);
        } catch (err) {
            // Handle error
            setError("Image upload error");
            console.error('Image upload error:', err);
        } finally {
            setLoading(false);
        }
    }
    const CloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
    const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", upload_preset);

            fetch(CloudinaryUrl, {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    resolve(data.secure_url);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setListingLoading(true);
        // Collect form data
        const form = e.target;
        const listingData = {
            name: form.name.value,
            description: form.description.value,
            address: form.address.value,
            sale: form.sale.checked,
            rent: form.rent.checked,
            parking: form.parking.checked,
            furnished: form.furnished.checked,
            offer: form.offer.checked,
            bedrooms: form.bedrooms.value,
            bathrooms: form.bathrooms.value,
            regularPrice: form.regularPrice.value,
            discountPrice: form.discountPrice.value,
                imageUrls: imageUrls, // Pass Cloudinary URLs
            userRef: form.userRef.value,
            type: form.sale.checked ? "sale" : form.rent.checked ? "rent" : ""
        };
        console.log(imageUrls);
        try {
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(listingData),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                // Optionally redirect or show success
                console.log('Listing created:', data.listing);
            } else {
                // Handle error
                console.error('Create listing error:', data.message);
            }
        } catch (err) {
            console.error('Create listing error:', err);
        } finally {
            setListingLoading(false);
        }
    };
    return (
        <main className='p-3 ma-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form className='flex flex-col sm:flex-row gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 flex-1 '>
                    <input type="text" placeholder='Name' className='border border-slate-500 p-3
                rounded-lg' id='name' maxLength='62' minLength='10' required />
                    <input type="text" placeholder='Description' className='border border-slate-500 p-3
                rounded-lg' id='description' required />
                    <input type="text" placeholder='Address' className='border border-slate-500 p-3
                rounded-lg' id='address' required />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-1.5'>
                            <input type="checkbox" id='sale' className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-1.5'>
                            <input type="checkbox" id='rent' className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-1.5'>
                            <input type="checkbox" id='parking' className='w-5' />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-1.5'>
                            <input type="checkbox" id='furnished' className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-1.5'>
                            <input type="checkbox" id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg'
                                type="number" id='bedrooms' min='1' max='10' required />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg'
                                type="number" id='bathrooms' min='1' max='10' required />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg'
                                type="number" id='regularPrice' min='1' max='10' required />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-sm'>(Rs/Month)</span>
                            </div>

                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg'
                                type="number" id='discountPrice' min='1' max='10' required />
                            <div className='flex flex-col items-center'>
                                <p>Discount Price</p>
                                <span className='text-sm'>(Rs/Month)</span>
                            </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg'
                                type="text" id='userRef' required />
                            <div className='flex flex-col items-center'>
                                <p>User Reference</p>
                            </div>

                        </div>

                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <p className='font-semibold'>Images:
                        <span className='text-sm text-gray-500 ml-2'>The First image will be cover(Max 6)</span>
                    </p>
                    <div className='flex gap-4 '>
                        <input onChange={(e) => setFiles(e.target.files)} className="p-3 border border-gray-300 rounded-lg w-full" type="file" id="images" accept="image/*" multiple disabled={loading || listingLoading} />
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        <button onClick={handleUpload} className='p-3 text-green-700 border border-green-700 
                                        rounded-lg uppercase hover:shadow-lg disabled:opacity-80' disabled={loading || listingLoading}>
                            {loading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    {imageUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {imageUrls.map((url, idx) => (
                                <div key={idx} className="relative inline-block">
                                    <img src={url} alt={`Listing ${idx + 1}`} className="w-32 h-32 object-cover rounded" />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                                        onClick={() => {
                                            setImageUrls(prev => prev.filter((_, i) => i !== idx));
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button className='bg-blue-600 text-white p-3 rounded-lg mt-4' disabled={listingLoading || loading}>
                        {listingLoading ? 'Creating...' : 'Create Listing'}
                    </button>
                </div>

            </form>
        </main>
    )
}

export default CreateListing