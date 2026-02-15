import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const authenticateJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader) {
		return res.status(401).json({ error: 'Authorization header missing' });
	}

	const parts = authHeader.split(' ');
	const token = parts.length === 2 ? parts[1] : parts[0];

	try {
		const payload = jwt.verify(token, JWT_SECRET);
		req.admin = payload;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
};

export default authenticateJWT;
