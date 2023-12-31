"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMiddleware = exports.secretKey = void 0;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
exports.secretKey = crypto.randomBytes(32).toString('hex');
const verifyTokenMiddleware = (allowedUserTypes) => {
    return (req, res, next) => {
        var _a;
        const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
        if (!token) {
            return res.status(400).json({ message: "Nema tokena u zaglavlju!" });
        }
        try {
            // verifikacija tokena
            const decodedToken = jwt.verify(token, exports.secretKey);
            const role = decodedToken.role;
            // provera da li je odgovarajuca uloga
            if (!allowedUserTypes.includes(role)) {
                return res.status(401).json({ message: "Nemate pristup ovoj usluzi!" });
            }
            // If token is valid and user is authorized, proceed to the next middleware or route handler
            next();
        }
        catch (error) {
            return res.status(403).json({ message: "Vaša sesija je istekla! Prijavite se ponovo!" });
        }
    };
};
exports.verifyTokenMiddleware = verifyTokenMiddleware;
//# sourceMappingURL=utility.js.map