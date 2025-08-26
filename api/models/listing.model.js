import mongoose from "mongoose";
const listingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    furnished: { type: Boolean, default: false, required: true },
    parking: { type: Boolean, default: false, required: true },
    type:{type: String, required: true},
    offer:{type: Boolean, default: false, required: true},
    imageUrls: { type: Array, required: true },
    userRef: { type:String, required: true },
}, { timestamps: true });
const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
