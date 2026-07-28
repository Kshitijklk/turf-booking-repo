const bcrypt = require("bcrypt");
const BoxOwner = require("../models/boxOwner.model");
const {
    encrypt,
    encryptEmail,
    decrypt,
    hashPhone,
    hashEmail,
    normalizePhone,
    normalizeEmail
} = require("../utils/crypto");
async function registerOwner(req, res) {
    try {
        const {
            full_name,
            email_address,
            country_code,
            phone_number,
            password
        } = req.body;
        if (
            !full_name ||
            !email_address ||
            !country_code ||
            !phone_number ||
            !password
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_address)) {
            return res.status(400).json({
                message: "Invalid email address"
            });
        }
        const normalizedEmail =
            normalizeEmail(email_address);

        const normalizedPhone =
            normalizePhone(phone_number);

        const email_encrypted =
            encryptEmail(normalizedEmail);

        const phone_encrypted =
            encrypt(normalizedPhone);

        const email_hash =
            hashEmail(normalizedEmail);

        const phone_hash =
            hashPhone(normalizedPhone);

        const password_hash =
            await bcrypt.hash(password, 10);
        const owner =
            await BoxOwner.create({
                full_name,
                email_encrypted,
                email_hash,
                country_code,
                phone_encrypted,
                phone_hash,
                password_hash
            });
        return res.status(201).json({
            message: "Owner registered successfully",
            data: toOwnerResponse(owner)
        });
        }
    catch (error) {
        if (error.code === 11000) {
            console.log("Duplicate Error:", error);

            return res.status(409).json({
                message: "Email or phone already exists",
                keyPattern: error.keyPattern,
                keyValue: error.keyValue
            });
        }
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

    }

function toOwnerResponse(owner) {
    return {
        id: owner._id,
        full_name: owner.full_name,
        email_address: decrypt(owner.email_encrypted),
        country_code: owner.country_code,
        phone_number: decrypt(owner.phone_encrypted),
        status: owner.status,
        createdAt: owner.createdAt,
        updatedAt: owner.updatedAt
    };
    }

module.exports = {
    registerOwner
    };