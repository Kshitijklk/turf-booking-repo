const mongoose = require('mongoose');

const timingSchema = new mongoose.Schema({
    day: { type: String, enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
    start_time: { type: String },
    end_time: { type: String },
    is_open: { type: Boolean, default: true }
}, { _id: false });

const venueSchema = new mongoose.Schema({
    venue_name: { type: String, required: true },
    about: { type: String },
    venue_timing: [timingSchema],           // embedded array of sub-documents
    venue_sports: [String],
    city: { type: String },
    is_featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Venue', venueSchema);