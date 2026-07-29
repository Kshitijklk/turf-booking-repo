const jwt = require("jsonwebtoken");

function signAccessToken({ id, role }) {
    return jwt.sign(
        {
            sub: id.toString(),
            role,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m",
        }
    );
}

function verifyAccessToken(token) {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    );
}

module.exports = {
    signAccessToken,
    verifyAccessToken,
};