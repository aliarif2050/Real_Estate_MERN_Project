import React, { useEffect } from 'react';
import { useSelector ,} from 'react-redux';
import {useNavigate, useParams } from 'react-router-dom';

const UpdateListing = () => {
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const [files, setFiles] = React.useState([]);
    const [error, setError] = React.useState("");
    const [imageUrls, setImageUrls] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [listingLoading, setListingLoading] = React.useState(false);
    const [offer, setOffer] = React.useState(false);
    const [type, setType] = React.useState(""); // "sale" or "rent"
    const user = useSelector((state) => state.user.user);
    const [success, setSuccess] = React.useState(false);
    const navigate = useNavigate();
    const params = useParams();

    const CloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
    const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`${VITE_API_URL}/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success) {
                const listing = data.listing;
                setType(listing.type);
                setOffer(listing.offer);
                setImageUrls(listing.imageUrls);

                // Use setTimeout to ensure DOM is ready before setting form values
                setTimeout(() => {
                    const form = document.getElementById('update-listing-form');
                    if (form) {
                        form.name.value = listing.name;
                        form.description.value = listing.description;
                        form.address.value = listing.address;
                        form.bedrooms.value = listing.bedrooms;
                        form.bathrooms.value = listing.bathrooms;
                        form.parking.checked = listing.parking;
                        form.furnished.checked = listing.furnished;
                        form.regularPrice.value = listing.regularPrice;
                        // Only set discountPrice if the input exists (offer is true)
                        if (form.discountPrice) {
                            form.discountPrice.value = listing.discountPrice;
                        }
                    }
                }, 0);
            }
        };
        fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.listingId]);

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
                    if (data.secure_url) resolve(data.secure_url);
                    else reject(new Error("Cloudinary upload failed"));
                })
                .catch(err => reject(err));
        });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setError("");

        // Combine previous and new files, but max 6 images
        const totalImages = imageUrls.length + files.length;
        if (totalImages > 6) {
            setError("Max 6 images can be uploaded");
            return;
        }
        if (files.length === 0) {
            setError("Please select at least one image");
            return;
        }
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 2 * 1024 * 1024) {
                setError("Image should be less than 2mb");
                return;
            }
        }

        setLoading(true);
        try {
            const uploadPromises = files.map(file => storeImage(file));
            const urls = await Promise.all(uploadPromises);
            setImageUrls(prev => [...prev, ...urls]); // Keep previous images and add new ones
            console.log("Uploaded image URLs:", urls);
        } catch (err) {
            setError("Image upload error");
            console.error("Image upload error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setListingLoading(true);

        const form = e.target;
        const regularPrice = Number(form.regularPrice.value);
        const discountPrice = offer ? Number(form.discountPrice.value) : 0;
        if (imageUrls.length === 0) {
            setError("Please upload at least one image");
            setListingLoading(false);
            return;
        }
        if (offer && discountPrice >= regularPrice) {
            setError("Discount must be less than regular price");
            setListingLoading(false);
            return;
        }

        const listingData = {
            name: form.name.value,
            description: form.description.value,
            address: form.address.value,
            type,
            parking: form.parking.checked,
            furnished: form.furnished.checked,
            offer,
            bedrooms: Number(form.bedrooms.value),
            bathrooms: Number(form.bathrooms.value),
            regularPrice,
            discountPrice,
            imageUrls,
            userRef: user._id
        };
        try {
            const res = await fetch(`${VITE_API_URL}/listing/update/${params.listingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(listingData),
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 2800);
                setTimeout(() => {
                    navigate(`/listing/${data.listing._id}`);
                }, 3000);
            } else {
                setSuccess(false);
                setError(data.message || "Update listing error");
            }
        } catch (err) {
            setError(err.message || "Update listing error");
        } finally {
            setListingLoading(false);
        }
    };

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Update Listing</h1>
            <form id="update-listing-form" className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
                {/* Left Side */}
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" placeholder="Name" className="border border-slate-500 p-3 rounded-lg" id="name" maxLength="62" minLength="10" required />
                    <input type="text" placeholder="Description" className="border border-slate-500 p-3 rounded-lg" id="description" required />
                    <input type="text" placeholder="Address" className="border border-slate-500 p-3 rounded-lg" id="address" required />

                    {/* Radios & Checkboxes */}
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-1.5">
                            <input type="radio" name="type" id="sale" value="sale" checked={type === "sale"} onChange={() => setType("sale")} />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-1.5">
                            <input type="radio" name="type" id="rent" value="rent" checked={type === "rent"} onChange={() => setType("rent")} />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-1.5">
                            <input type="checkbox" id="parking" className="w-5" />
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-1.5">
                            <input type="checkbox" id="furnished" className="w-5" />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-1.5">
                            <input type="checkbox" id="offer" className="w-5" checked={offer} onChange={(e) => setOffer(e.target.checked)} />
                            <span>Offer</span>
                        </div>
                    </div>

                    {/* Numbers */}
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input className="p-3 border border-gray-300 rounded-lg" type="number" id="bedrooms" min="1" max="10" defaultValue='0' required />
                            <span>Beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input className="p-3 border border-gray-300 rounded-lg" type="number" id="bathrooms" min="1" max="10" defaultValue='0' required />
                            <span>Baths</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input className="p-3 border border-gray-300 rounded-lg" type="number" id="regularPrice" min="1" defaultValue='0' required />
                            <div className="flex flex-col items-center">
                                <span>Regular Price</span>
                                <span className="text-sm">(Rs/Month)</span>
                            </div>
                        </div>
                        {offer && (
                            <div className="flex items-center gap-2">
                                <input className="p-3 border border-gray-300 rounded-lg" type="number" id="discountPrice" min="0" defaultValue='0' required />
                                <div className="flex flex-col items-center">
                                    <span>Discount Price</span>
                                    <span className="text-sm">(Rs/Month)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col flex-1">
                    <p className="font-semibold">
                        Images:
                        <span className="text-sm text-gray-500 ml-2">The First image will be cover (Max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input
                            onChange={(e) => setFiles(Array.from(e.target.files))}
                            className="p-3 border border-gray-300 rounded-lg w-full"
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                            disabled={loading || listingLoading}
                        />
                        <button
                            onClick={handleUpload}
                            type="button"
                            className="p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80"
                            disabled={loading || listingLoading}
                        >
                            {loading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {imageUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {imageUrls.map((url, idx) => (
                                <div key={idx} className="relative inline-block">
                                    <img src={url} alt={`Listing ${idx + 1}`} className="w-32 h-32 object-cover rounded" />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                                        onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== idx))}
                                        disabled={loading || listingLoading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button className="bg-blue-600 text-white cursor-pointer p-3 rounded-lg mt-4" disabled={listingLoading || loading}>
                        {listingLoading ? "Updating..." : "Update Listing"}
                    </button>
                    {success && <p className='text-sm text-green-500 mt-2'>Listing updated successfully! <br /> <span className='text-gray-800 text-center text-2xl animate-pulse'>Redirecting to Listing</span></p>}
                </div>
            </form>
        </main>
    );
};

export default UpdateListing;
