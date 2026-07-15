const crypto = require("crypto");
const Customer = require("../models/customer.model");
const Otp = require("../models/otp.model");

const {
    encrypt,
    normalizePhone,
    hashPhone,
    hashOtp
} = require("../utils/crypto");

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
        
        await Otp.findOneAndUpdate(
            { phone_number_hash: phoneHash },
            {
                otp_hash: otpHash,
                attempts: 0,
                expires_at: new Date(Date.now() + 5 * 60 * 1000)
            },
            {
                upsert: true,
                new: true
            }
        );
        console.log("OTP:", otp);
        return res.status(200).json({
            message: "OTP sent successfully."
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
        const { country_code, phone_number, otp } = req.body;

        if (!country_code || !phone_number || !otp) {
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
                full_name: "New Customer",
                country_code: country_code,
                phone_number: encrypt(normalizedPhone),
                phone_number_hash: phoneHash
            });
        }
        return res.status(200).json({
            message: "OTP verified successfully",
            customer
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
    verifyOtp
};