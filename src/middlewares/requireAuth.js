const { verifyAccessToken } = require("../utils/token");

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Missing or invalid Authorization header");
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);

        console.log("JWT Payload:", payload);

        req.user = {
            id: payload.sub,
            role: payload.role,
        };

        next();
    } catch (error) {
        console.log("JWT Error:", error.message);

        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}

module.exports = requireAuth;