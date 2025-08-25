import User from "../models/user.model.js";
import cloudinary from "../utils/Cloudinary.js";

// Upload new profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    console.log("uploadProfilePhoto called");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    const { userId } = req.body; // frontend should send userId
    const file = req.file; // multer will handle this
    
    if (!file) {
      console.log("No file uploaded");
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload file to cloudinary
    const result = await cloudinary.uploader.upload(file.path, { folder: "profile_photos" });
    console.log("Cloudinary result:", result);

    // Update user photo in DB
    const updatedUser = await User.findByIdAndUpdate(userId, { photo: result.secure_url }, { new: true });
    console.log("Updated user:", updatedUser);

    res.status(200).json({ success: true, message: "Profile photo updated successfully", user: updatedUser });
  } catch (error) {
    console.log("Error in uploadProfilePhoto:", error);
    res.status(500).json({ success: false, message: "Upload failed", error });
  }
};
