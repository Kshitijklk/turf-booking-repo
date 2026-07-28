const mongoose = require("mongoose");
const boxOwnerSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
            trim: true
        },
        email_encrypted: {
            type: String,
            required: true
        },
        email_hash: {
            type: String,
            required: true,
            unique: true,
            index: true,
            select: false
        },
        country_code: {
            type: String,
            required: true
        },
        phone_encrypted: {
            type: String,
            required: true
        },
        phone_hash: {
            type: String,
            required: true,
            unique: true,
            index: true,
            select: false
        },
        password_hash: {
            type: String,
            required: true,
            select: false
        },
        status: {
            type: String,
            enum: [
                "active",
                "disabled",
                "deleted",
                "invited"
          ],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("BoxOwner", boxOwnerSchema);