const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            res.json({
                message: err.message,
                stack: process.env.NODE_ENV === "production" ? null : err.stack,
            });
        }
    }

    if (!token) {
        res.status(401);
        res.json({
            message: err.message,
            stack: process.env.NODE_ENV === "production" ? null : err.stack,
        });
    }
}

module.exports = { protect };