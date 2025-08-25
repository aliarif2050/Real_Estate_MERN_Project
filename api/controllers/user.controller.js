import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

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