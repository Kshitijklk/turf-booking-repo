const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    full_name: { type: String, required: true, trim: true },
    country_code: { type: String, required: true },
    phone_number: {
        type: String,
        required: true
    },

    phone_number_hash: {
        type: String,
        required: true,
        unique: true
    },
    otp: { type: Number },
    otp_expiry: { type: Date },
    razorpay_customer_id: { type: String },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;