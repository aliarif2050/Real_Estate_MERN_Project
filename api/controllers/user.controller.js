import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
    res.json({ message: 'User route' })
}

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { photo, password, username } = req.body;
        const updateFields = {};
        if (photo) updateFields.photo = photo;
        if (username) updateFields.username = username;
        if (password) {
            // Only update password if provided and not empty
            if (password.trim().length === 0) {
                return res.status(400).json({ success: false, message: 'Password cannot be empty' });
            }
            const hashedPassword = bcryptjs.hashSync(password, 10);
            updateFields.password = hashedPassword;
        }
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields to update' });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
        if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const deleteUser = async (req, res) => {
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ success: false, message: 'You are not allowed to delete this account' });
  }
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.clearCookie('token');
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserListings = async (req, res , next) => {
  if(req.user.id == req.params.id) {
  try {
    const userId = req.params.id;
    const listings = await Listing.find({ userRef: userId });
    res.status(200).json({ success: true, listings });
  } catch (error) {
    next(error)
  }}
  else {
    res.status(403).json({ success: false, message: 'You are not allowed to view these listings' });
  }
};