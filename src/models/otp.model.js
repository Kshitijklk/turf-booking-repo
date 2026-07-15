const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    phone_number_hash: {
        type: String,
        required: true,
        index: true
    },

    otp_hash: {
        type: String,
        required: true
    },

    attempts: {
        type: Number,
        default: 0
    },

    expires_at: {
        type: Date,
        required: true
    }

}, {
    timestamps: true
});

otpSchema.index(
    { expires_at: 1 },
    { expireAfterSeconds: 0 }
);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;