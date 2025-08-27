import React from 'react'

const CreateListing = () => {
  const [files, setFiles] = React.useState([]);
  const [error, setError] = React.useState("");
  const [imageUrls, setImageUrls] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [listingLoading, setListingLoading] = React.useState(false);
  const [offer, setOffer] = React.useState(false);
  const [type, setType] = React.useState(""); // "sale" or "rent"

  const CloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
  const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;

  // --- Upload to Cloudinary ---
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

  // --- Handle upload button ---
  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");

    if (files.length > 6) {
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
      setImageUrls(urls);
      console.log("Uploaded image URLs:", urls);
    } catch (err) {
      setError("Image upload error");
      console.error("Image upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Handle final form submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setListingLoading(true);

    const form = e.target;
    const regularPrice = Number(form.regularPrice.value);
    const discountPrice = offer ? Number(form.discountPrice.value) : null;

    // Validation
    if (offer && discountPrice >= regularPrice) {
      setError("Discount must be less than regular price");
      setListingLoading(false);
      return;
    }

    const listingData = {
      name: form.name.value,
      description: form.description.value,
      address: form.address.value,
      type, // "sale" or "rent"
      parking: form.parking.checked,
      furnished: form.furnished.checked,
      offer,
      bedrooms: Number(form.bedrooms.value),
      bathrooms: Number(form.bathrooms.value),
      regularPrice,
      discountPrice,
      imageUrls,
      // Ideally userRef should come from logged-in user, not input
      userRef: form.userRef.value
    };

    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        console.log("Listing created:", data.listing);
      } else {
        console.error("Create listing error:", data.message);
      }
    } catch (err) {
      console.error("Create listing error:", err);
    } finally {
      setListingLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
      <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
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
              <input className="p-3 border border-gray-300 rounded-lg" type="number" id="bedrooms" min="1" max="10" required />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input className="p-3 border border-gray-300 rounded-lg" type="number" id="bathrooms" min="1" max="10" required />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input className="p-3 border border-gray-300 rounded-lg" type="number" id="regularPrice" min="1" required />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-sm">(Rs/Month)</span>
              </div>
            </div>
            {offer && (
              <div className="flex items-center gap-2">
                <input className="p-3 border border-gray-300 rounded-lg" type="number" id="discountPrice" min="1" required />
                <div className="flex flex-col items-center">
                  <p>Discount Price</p>
                  <span className="text-sm">(Rs/Month)</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input className="p-3 border border-gray-300 rounded-lg" type="text" id="userRef" required />
              <div className="flex flex-col items-center">
                <p>User Reference</p>
              </div>
            </div>
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
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          <button className="bg-blue-600 text-white p-3 rounded-lg mt-4" disabled={listingLoading || loading}>
            {listingLoading ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
