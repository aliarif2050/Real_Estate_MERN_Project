import React, { useState, useRef, } from "react";
import { useSelector, useDispatch } from "react-redux";
import { persistStore } from 'redux-persist';
import { store } from '../redux/store';
import { useNavigate, Link } from 'react-router-dom';

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

const Profile = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [editForm, setEditForm] = useState(false);
  const [formState, setFormState] = useState({
    username: user?.username || "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userListings, setUserListings] = useState([]);

  if (!user) {
  navigate("/sign-in");
  return null;
}
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const cloudRes = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,

      });
      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) throw new Error("Cloudinary upload failed");

      // Update user profile in backend
      const updateRes = await fetch(`${VITE_API_URL}/user/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: cloudData.secure_url }),
        credentials: "include"
      });
      const updateData = await updateRes.json();
      if (updateData.success) {
        // Update Redux state if you have a reducer for this
        dispatch({ type: "user/update", payload: { user: updateData.user } });
      } else {
        throw new Error(updateData.message || "Failed to update user profile");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditForm(true);
    setFormState({ username: user?.username || "", password: "" });
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    setLoading(true);
    setError("");
    try {
      const updateRes = await fetch(`${VITE_API_URL}/user/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formState.username, password: formState.password }),
        credentials: "include"
      });
      const updateData = await updateRes.json();
      if (updateData.success) {
        dispatch({ type: "user/update", payload: { user: updateData.user } });
        setEditForm(false);
        setFormState({ username: updateData.user.username, password: "" }); // Sync formState with updated username
      } else {
        throw new Error(updateData.message || "Failed to update user profile");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch(`${VITE_API_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error("Signout error:", err);
    }
    persistStore(store).purge(); // Clear persisted Redux state
    dispatch({ type: "user/update", payload: { user: null } });
    navigate('/sign-in');
  };
  const handleDeleteClick = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${VITE_API_URL}/user/${user._id}`, {
        method: 'DELETE',
        credentials: 'include', // Ensure cookies (token) are sent
      });
      const data = await res.json();
      if (data.success) {
        dispatch({ type: "user/update", payload: { user: null } });
        navigate('/sign-in');
      } else {
        throw new Error(data.message || "Failed to delete user");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleShowListings = async () => {
    try {
      setError("");
      const res = await fetch(`${VITE_API_URL}/user/listing/${user._id}`, {
        credentials: 'include' // <-- Added to send cookies/token
      });
      const data = await res.json();
      if (data.success) {
        setError("");
        console.log(data.listings);
        setUserListings(data.listings);
        // Handle successful response
      } else {
        setError("Failed to fetch user listings");
      }
    } catch (error) {
      setError(error.message);
    }
  }
 const handleDeleteListing = async (listingId) => {
  try {
    const res = await fetch(`${VITE_API_URL}/listing/${listingId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) {
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } else {
      setError(data.message || "Failed to delete listing");
    }
  } catch (error) {
    setError(error.message);
  }
 }
 
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col">
        <input
          onChange={handleFileChange}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="w-24 h-24 object-cover rounded-full cursor-pointer self-center"
          src={user?.photo}
          alt={`Profile of ${user?.username}`}
        />
        {loading && <p className="text-center text-gray-500">Uploading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!editForm ? (
          <>
            <label className='text-slate-600' htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={user?.username}
              className="border p-3 rounded-lg my-2"
              disabled
            />
            <label className='text-slate-600' htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={user?.email}
              className="border p-3 rounded-lg my-2"
              disabled
            />
            <button type="button" className="bg-blue-600 text-white p-2 cursor-pointer rounded-lg mt-1.5" onClick={handleEditClick}>
              Edit Username/Password
            </button>
          </>
        ) : (
          <div className="flex flex-col mt-2">
            <label className='text-slate-600' htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formState.username}
              onChange={handleInputChange}
              className="border p-3 rounded-lg my-2"
              placeholder="New username"
              required
            />
            <label className='text-slate-600' htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formState.password}
              onChange={handleInputChange}
              className="border p-3 rounded-lg my-2"
              placeholder="New password"
              required
            />
            <label className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
              Show Password
            </label>
            <button type="button" className="bg-green-600 text-white p-2 rounded-lg" disabled={loading} onClick={handleSaveClick}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            {error && <p className="text-center text-red-500 mt-2">{error}</p>}
            {!error && <p className="text-center text-green-500 mt-2">Profile updated successfully!</p>}

          </div>
        )}
        <Link to={'/create-listing'} className="bg-green-700 text-white p-2 mt-1 rounded-lg uppercase text-center hover:opacity-95">Create Listing</Link>
        <button type="button" onClick={handleShowListings} className="text-white p-2 cursor-pointer rounded-lg bg-green-700 mt-1 w-full">Show Listings</button>
        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
        {userListings && userListings.length > 0 && (
          <div className="">
            <h1 className="text-center text-2xl text-gray-800 mt-2">Your Listings</h1>
            <p>Total Listings: {userListings.length}</p>
            {userListings.map(listing => (
              <div key={listing._id} className="border gap-4 p-3 rounded-lg my-2 flex justify-between items-center">
                <Link to={`/listing/${listing._id}`} className="text-blue-600 hover:underline">
                  <img src={listing.imageUrls[0]} alt={listing.name} className="w-16 h-16 object-contain " />
                </Link>
                <Link to={`/listing/${listing._id}`} className="text-slate-800 flex-1 truncate semi-bold hover:underline">
                  <p >{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                <button type="button" className="text-red-600 hover:underline cursor-pointer" onClick={() => handleDeleteListing(listing._id)}>Delete</button>
                <Link to={`/update-listing/${listing._id}`} className="text-green-600 hover:underline cursor-pointer">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between mt-4 text-red-600 cursor-pointer">
          <span onClick={handleDeleteClick}>Delete Account</span>
          <span className="text-blue-700 cursor-pointer" onClick={handleSignOut}>Sign out</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
