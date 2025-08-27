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
export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }
    if(req.user.id !== listing.userRef) {
        return res.status(403).json({ success: false, message: "You can only delete your own listings" });
    }
    try {
        const deletedListing = await Listing.findByIdAndDelete(req.params.id);
        if (!deletedListing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }
        return res.status(200).json({ success: true, listing: deletedListing });
    } catch (error) {
        next(error);
    }
};
export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }
    if(req.user.id !== listing.userRef) {
        return res.status(403).json({ success: false, message: "You can only update your own listings" });
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id, req.body, { new: true }); 
           

        if (!updatedListing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        return res.status(200).json({ success: true, listing: updatedListing });
    } catch (error) {
        next(error);
    }
};
 export const getListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }
    return res.status(200).json({ success: true, listing });
};