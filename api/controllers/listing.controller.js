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
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }
        if (req.user.id !== listing.userRef.toString()) {
            return res.status(403).json({ success: false, message: "You can only delete your own listings" });
        }
        const deletedListing = await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, listing: deletedListing });
    } catch (error) {
        next(error);
    }
};
export const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }
        if (req.user.id !== listing.userRef.toString()) {
            return res.status(403).json({ success: false, message: "You can only update your own listings" });
        }
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        );
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

export const getAllListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
        if(offer === 'false' || offer === undefined) {
            offer = {$in: [false , true]};
        }
        let furnished = req.query.furnished;
        if(furnished === 'false' || furnished === undefined) {
            furnished = {$in: [false , true]};
        }
        let parking = req.query.parking;
        if(parking === 'false' || parking === undefined) {
            parking = {$in: [false , true]};
        }
        let type = req.query.type;
        if(type ===undefined|| type === 'all') {
            type = {$in: ['sale','rent']};
        }
        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort( {[sort]: order})
            .limit(limit)
            .skip(startIndex);
        return res.status(200).json( listings );
    } catch (error) {
        next(error);
    }
};