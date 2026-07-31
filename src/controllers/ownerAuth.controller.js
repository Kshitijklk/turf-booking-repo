const bcrypt = require("bcrypt");
const BoxOwner = require("../models/boxOwner.model");
const { signAccessToken } = require("../utils/token");
const RefreshToken = require("../models/refreshToken.model");
const {
    encrypt,
    encryptEmail,
    decrypt,
    hashPhone,
    hashEmail,
    generateRefreshToken,
    hashRefreshToken,
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
            return res.status(409).json({
                message: "Unable to register with the provided credentials."
            });
        
        }
        
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

    }

async function loginOwner(req, res) {
    try {
        const {
            email_address,
            password
        } = req.body;

        if (!email_address || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const email_hash = hashEmail(
            normalizeEmail(email_address)
        );

        const owner = await BoxOwner.findOne({
            email_hash
        }).select("+password_hash +email_hash +phone_hash +phone_encrypted");

        const DUMMY_HASH =
            "$2b$10$Q8dQh3R0m8sN9kqKQz4mP.Oe8XjT0F2Fy8s4p1N8L0yY8oJt5H3nC";

        const passwordHash = owner
            ? owner.password_hash
            : DUMMY_HASH;

        const isMatch = await bcrypt.compare(
            password,
            passwordHash
        );

        if (!owner || !isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        if (
            owner.status === "disabled" ||
            owner.status === "deleted"
        ) {
            return res.status(403).json({
                message: "Account is disabled"
            });
        }
        const accessToken = signAccessToken({
            id: owner._id,
            role: "owner"
        });

        const refreshToken = generateRefreshToken();

        await RefreshToken.create({
            user_id: owner._id,
            role: "owner",
            token_hash: hashRefreshToken(refreshToken),
            expires_at: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            )
        });

        return res.status(200).json({
            message: "Login successful",
            access_token: accessToken,
            refresh_token: refreshToken,
            data: toOwnerResponse(owner)
        });
    

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
    }

async function getOwnerProfile(req, res) {
    return res.status(200).json({
        message: "Owner authenticated",
        user: req.user
    });
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
    registerOwner,
    loginOwner,
    getOwnerProfile
    };