const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    country_code: { type: String },
    phone_number: { type: String },          // just a String for now — see the note below
    location: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport' }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);