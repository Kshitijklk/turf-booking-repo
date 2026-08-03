const { verifyAccessToken } = require("../utils/token");

function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    // No token = continue as public user
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);

        req.user = {
            id: payload.sub,
            role: payload.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}

module.exports = optionalAuth;