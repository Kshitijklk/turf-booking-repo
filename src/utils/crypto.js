const crypto = require("crypto");

function normalizePhone(phone) {
    let normalized = phone.replace(/\D/g, "");

    if (normalized.startsWith("91") && normalized.length === 12) {
        normalized = normalized.slice(2);
    }

    return normalized;
}

const KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

function encrypt(phone) {
    const plaintext = normalizePhone(phone);
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        "aes-256-gcm",
        KEY,
        iv
    );

    const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([
        iv,
        tag,
        encrypted
    ]).toString("base64");
}

function decrypt(ciphertext) {
    const data = Buffer.from(ciphertext, "base64");

    const iv = data.subarray(0, 12);
    const tag = data.subarray(12, 28);
    const encrypted = data.subarray(28);

    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        KEY,
        iv
    );

    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}

function hashPhone(phone) {
    const normalized = normalizePhone(phone);

    return crypto
        .createHmac("sha256", process.env.HASH_KEY)
        .update(normalized)
        .digest("hex");
}

function hashOtp(otp) {
    return crypto
        .createHash("sha256")
        .update(String(otp))
        .digest("hex");
}

module.exports = {
    encrypt,
    decrypt,
    hashPhone,
    hashOtp,
    normalizePhone
};