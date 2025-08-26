import Listing from "../models/listing.model.js";
export const createListing = async (req, res, next) => {
    const { name, description, regularPrice, discountPrice, bathrooms, bedrooms, furnished, parking, type, offer, imageUrls, userRef } = req.body;
    try {
        const newListing = await Listing.create(req.body);
        return res.status(201).json({ success: true, listing: newListing });
    } catch (error) {
        next(error);
    }
};
