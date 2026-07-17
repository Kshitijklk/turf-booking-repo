const mongoose = require("mongoose");
const crypto = require("crypto");
const Customer = require("../models/customer.model");
const Otp = require("../models/otp.model");

const {
    encrypt,
    decrypt,
    normalizePhone,
    hashPhone,
    hashOtp
} = require("../utils/crypto");

function toCustomerResponse(customer) {
    return {
        id: customer._id,
        full_name: customer.full_name,
        country_code: customer.country_code,
        phone_number: decrypt(customer.phone_number),
        created_at: customer.created_at
    };
}

async function sendOtp(req, res) {
    try {
        const { country_code, phone_number } = req.body;
        if (!country_code || !phone_number) {
            return res.status(400).json({
                message: "Country code and phone number are required."
            });
        }

        const normalizedPhone = normalizePhone(phone_number);
        const phoneHash = hashPhone(normalizedPhone);
        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = hashOtp(otp);
        const result = await Otp.findOneAndUpdate(
            { phone_number_hash: phoneHash },
            {
                phone_number_hash: phoneHash,
                otp_hash: otpHash,
                attempts: 0,
                expires_at: new Date(Date.now() + 5 * 60 * 1000)
            },
            {
                upsert: true,
                new: true
            }
        );

        console.log("Saved OTP document:", result);
        console.log("Collection:", result.collection.name);
        console.log("Connection DB:", Otp.db.name);
        return res.status(200).json({
            message: "OTP sent successfully.",
            otp
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function verifyOtp(req, res) {
    try {
        const {
            full_name,
            country_code,
            phone_number,
            otp
        } = req.body;
        if (!full_name || !country_code || !phone_number || !otp) {
            return res.status(400).json({
                message: "Country code, phone number and OTP are required."
            });
        }

        const normalizedPhone = normalizePhone(phone_number);
        const phoneHash = hashPhone(normalizedPhone);
        const otpDoc = await Otp.findOne({
            phone_number_hash: phoneHash
        });
        if (!otpDoc) {
            return res.status(400).json({
                message: "Invalid or expired code"
            });
        }
        if (otpDoc.expires_at <= new Date()) {
            await Otp.deleteOne({
                _id: otpDoc._id
            });
            return res.status(400).json({
                message: "Invalid or expired code"
            });
        }
        if (otpDoc.attempts >= 5) {
            await Otp.deleteOne({
                _id: otpDoc._id
            });
            return res.status(400).json({
                message: "Invalid or expired code"
            });
        }
        const otpHash = hashOtp(otp);
        if (otpHash !== otpDoc.otp_hash) {
            otpDoc.attempts++;
            await otpDoc.save();
            return res.status(400).json({
                message: "Invalid or expired code"
            });
        }
        await Otp.deleteOne({
            _id: otpDoc._id
        });
        let customer = await Customer.findOne({
            phone_number_hash: phoneHash
        });
        if (!customer) {
            customer = await Customer.create({
                full_name,
                country_code,
                phone_number: encrypt(normalizedPhone),
                phone_number_hash: phoneHash
            });
        }
        return res.status(200).json({
            message: "OTP verified successfully",
            customer: toCustomerResponse(customer)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getCustomerById(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid customer id."
            });
        }
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({
                message: "Customer not found."
            });
        }
        return res.status(200).json({
            customer: toCustomerResponse(customer)
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getCustomers(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Math.min(
            Number(req.query.limit) || 20,
            100
        );
        const skip = (page - 1) * limit;
        const customers = await Customer.find()
            .lean()
            .skip(skip)
            .limit(limit);
        const total = await Customer.countDocuments();

        return res.status(200).json({
            data: customers.map(toCustomerResponse),
            page,
            limit,
            total
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
}

async function updateCustomer(req, res) {

    try {

        const { id } = req.params;
        const { full_name } = req.body;

        const customer = await Customer.findByIdAndUpdate(
            id,
            { full_name },
            {
                new: true,
                runValidators: true
            }
        );

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            customer: toCustomerResponse(customer)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}
async function getCustomerSummary(req, res) {

    try {
        const { id } = req.params;

        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            ...toCustomerResponse(customer),
            bookings: []
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}
module.exports = {
    sendOtp,
    verifyOtp,
    getCustomerById,
    getCustomers,
    updateCustomer,
    getCustomerSummary
};