const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
    sport_name: { type: String, required: true },
    sport_icon: { type: String },
    status: { type: String, enum: ['active', 'disable'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Sport', sportSchema);
