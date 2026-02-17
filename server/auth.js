/**
 * JWT Authentication middleware and helpers.
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'habit-tracker-secret-key-change-in-production';
const JWT_EXPIRY = '30d';

/**
 * Generate a signed JWT for a given userId.
 */
function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Express middleware — verifies JWT and attaches req.userId.
 * Expects header: Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { generateToken, authMiddleware, JWT_SECRET };
