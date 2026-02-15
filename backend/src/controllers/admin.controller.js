import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT id, email, username, password, password_hash FROM admin_user WHERE email = ? LIMIT 1',
      [email]
    );

    if (!rows || rows.length === 0) {
      if (process.env.NODE_ENV !== 'production') console.debug('Admin login: no user found for email', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    // Determine whether we have a bcrypt hash or plaintext stored
    let hashed = null;
    let isPlain = false;
    if (user.password_hash) {
      hashed = user.password_hash;
    } else if (user.password) {
      // If the stored password looks like a bcrypt hash, use it
      if (/^\$2[aby]\$/.test(user.password)) {
        hashed = user.password;
      } else {
        isPlain = true;
      }
    }

    if (isPlain) {
      // Authenticate against plaintext (temporary) and migrate to bcrypt
      if (password !== user.password) {
        if (process.env.NODE_ENV !== 'production') console.debug('Admin login: plaintext password mismatch for id', user.id);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Migrate: hash the plaintext and store in password_hash
      try {
        const newHash = await bcrypt.hash(password, 10);
        await db.promise().query('UPDATE admin_user SET password_hash = ? WHERE id = ?', [newHash, user.id]);
        if (process.env.NODE_ENV !== 'production') console.debug('Admin login: migrated plaintext password to hash for id', user.id);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.error('Admin login: failed to migrate password for id', user.id, e);
      }
    } else {
      if (!hashed) {
        if (process.env.NODE_ENV !== 'production') console.debug('Admin login: user found but no password/hash for id', user.id);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const match = await bcrypt.compare(password, hashed);
      if (process.env.NODE_ENV !== 'production') console.debug('Admin login: bcrypt.compare result for id', user.id, ':', match ? 'MATCH' : 'NO_MATCH');
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });

    return res.json({ token, admin: { id: user.id, email: user.email, name: user.username } });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const adminId = req.admin?.id;
    if (!adminId) return res.status(401).json({ error: 'Unauthorized' });

    const [rows] = await db.promise().query('SELECT id, email, username FROM admin_user WHERE id = ? LIMIT 1', [adminId]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Admin not found' });

    const user = rows[0];
    res.json({ admin: { id: user.id, email: user.email, name: user.username } });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    // Issue a new token with the same payload
    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export default { login, me, refresh };
