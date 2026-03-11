#!/usr/bin/env node
import db from '../src/config/db.js';
import bcrypt from 'bcryptjs';

// This script ensures a `password_hash` column exists on `admin_user`,
// then hashes plaintext passwords from `password` into `password_hash`.
// Usage: node scripts/hash-admin-passwords.js

const SALT_ROUNDS = 10;

const query = (sql, params) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => err ? reject(err) : resolve(results));
});

async function ensureColumn() {
  const res = await query("SHOW COLUMNS FROM admin_user LIKE 'password_hash'");
  if (!res || res.length === 0) {
    console.log('`password_hash` column missing — adding it now...');
    await query('ALTER TABLE admin_user ADD COLUMN password_hash VARCHAR(255) DEFAULT NULL');
    console.log('Added `password_hash` column.');
  } else {
    console.log('`password_hash` column already exists.');
  }
}

async function hashPasswords() {
  try {
    await ensureColumn();

    const users = await query('SELECT id, password, password_hash FROM admin_user');
    if (!users || users.length === 0) {
      console.log('No admin users found.');
      process.exit(0);
    }

    for (const u of users) {
      if (u.password_hash) {
        console.log(`Skipping id=${u.id}, already has password_hash`);
        continue;
      }

      if (!u.password) {
        console.log(`Skipping id=${u.id}, no plaintext password present`);
        continue;
      }

      const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);
      await query('UPDATE admin_user SET password_hash = ? WHERE id = ?', [hashed, u.id]);
      console.log(`Hashed password for id=${u.id}`);
    }

    console.log('Done. Review the table, then consider removing plaintext passwords.');
    process.exit(0);
  } catch (err) {
    console.error('Error hashing passwords:', err);
    process.exit(1);
  }
}

hashPasswords();
