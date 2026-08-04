const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema(
    {
        venue_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Venue",
            required: true,
            index: true
        },

        box_name: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["active", "disabled"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

const Box = mongoose.model("Box", boxSchema);

module.exports = Box;