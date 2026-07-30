const { verifyAccessToken } = require("../utils/token");

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);

        req.user = {
            id: payload.sub,
            role: payload.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}

module.exports = requireAuth;