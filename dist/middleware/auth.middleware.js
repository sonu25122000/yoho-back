"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwtService_1 = require("../service/jwtService");
const jwtSecret_1 = require("../service/jwtSecret");
// middleware to verify token for superuser
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access token not provided" });
    }
    try {
        const decoded = (0, jwtService_1.verifyToken)(token, jwtSecret_1.JWT_SECRET);
        req.body.user = decoded; // Attach superuser data to the request object
        next();
    }
    catch (err) {
        return res.status(403).json({
            message: "You are not Authorized to perform this action.",
        });
    }
};
exports.authenticateToken = authenticateToken;
