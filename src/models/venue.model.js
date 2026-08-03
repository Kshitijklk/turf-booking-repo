const mongoose = require("mongoose");

const venueTimingSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            required: true
        },
        open_time: {
            type: String,
            required: true
        },
        close_time: {
            type: String,
            required: true
        },
        is_open: {
            type: Boolean,
            default: true
        }
    },
    {
        _id: false
    }
);

const venueSchema = new mongoose.Schema(
    {
        box_owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BoxOwner",
            required: true,
            index: true
        },

        venue_name: {
            type: String,
            required: true,
            trim: true
        },

        about_venue: {
            type: String,
            trim: true
        },

        venue_timing: {
            type: [venueTimingSchema],
            default: []
        },

        venue_sports: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Sport"
            }
        ],

        location: {
            type: String,
            trim: true
        },

        area: {
            type: String,
            trim: true
        },

        city: {
            type: String,
            trim: true
        },

        state: {
            type: String,
            trim: true
        },

        latitude: {
            type: Number
        },

        longitude: {
            type: Number
        },

        images: {
            type: [String],
            default: [],
            validate: {
                validator: function (images) {
                    return images.length <= 5;
                },
                message: "A venue can have a maximum of 5 images."
            }
        },

        is_featured: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: ["active", "disabled", "deleted"],
            default: "active"
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

module.exports = mongoose.model("Venue", venueSchema);