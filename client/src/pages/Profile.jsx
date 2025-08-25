import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dxq9uz7je/image/upload";
const UPLOAD_PRESET = "unsigned_preset"; // Replace with your actual unsigned preset name

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [editForm, setEditForm] = useState(false);
  const [formState, setFormState] = useState({
    username: user?.username || "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      const updateRes = await fetch(`/api/user/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: cloudData.secure_url }),
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
      const updateRes = await fetch(`/api/user/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formState.username, password: formState.password }),
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
            <input
              id="username"
              name="username"
              type="text"
              value={user?.username}
              className="border p-3 rounded-lg my-2"
              disabled
            />
            <input
              id="email"
              type="email"
              value={user?.email}
              className="border p-3 rounded-lg my-2"
              disabled
            />
            <button type="button" className="bg-blue-600 text-white p-2 rounded-lg mt-2" onClick={handleEditClick}>
              Edit Username/Password
            </button>
          </>
        ) : (
          <div className="flex flex-col mt-2">
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
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
