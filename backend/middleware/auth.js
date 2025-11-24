import jwt from 'jsonwebtoken';
/**
 * Middleware to verify the JWT token and attach user data (userId, role) to the request.
 */
export const authenticateToken = (req, res, next) => {
    // 1. CRITICAL CHECK: Ensure JWT Secret is configured
    if (!process.env.JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET is not configured in environment variables.");
        // Return a 500 status as this is a server configuration failure
        return res.status(500).json({ error: 'Server configuration error.' });
    }
    // 2. Extract Token from Authorization Header (Bearer Token)
    const authHeader = req.headers['authorization'];
    // Format is "Bearer [TOKEN]", so we split and take the second part
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        // No token provided
        return res.status(401).json({ error: 'Unauthorized: Access token is missing' });
    }
    // 3. Verify Token
    const jwtSecret = process.env.JWT_SECRET;
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            // Token is expired, invalid signature, or malformed
            return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
        }
        // 4. Attach Payload to Request (using the custom AuthRequest type)
        const payload = decoded;
        // TypeScript error is resolved because AuthRequest includes these properties
        req.userId = payload.userId;
        req.role = payload.role;
        // Token is valid, continue to the next middleware or route handler
        next();
    });
};
/**
 * Middleware to check if the authenticated user has one of the required roles.
 */
export const authorizeRole = (requiredRoles) => {
    return (req, res, next) => {
        // Check if user is authenticated and has a role
        if (!req.role) {
            // Should be caught by authenticateToken, but good practice to check
            return res.status(403).json({ error: 'Forbidden: User role not found.' });
        }
        // Check if the user's role is included in the requiredRoles array
        if (!requiredRoles.includes(req.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
        }
        next();
    };
};
//# sourceMappingURL=auth.js.map