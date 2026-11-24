import express from 'express';
import { hashPassword, verifyPassword, createSession, destroySession, requireAuth, requireAdmin } from './auth.js';

const ROLES = ['Admin', 'Viewer'];
const PUBLIC_COLUMNS = 'id, name, email, role, created_at';

function validate(body, { requirePassword }) {
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const role = body.role;
  const password = body.password ? String(body.password) : '';
  if (!name) return { error: 'Name is required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'A valid email is required' };
  if (!ROLES.includes(role)) return { error: `Role must be one of ${ROLES.join(', ')}` };
  if ((requirePassword || password) && password.length < 8) return { error: 'Password must be at least 8 characters' };
  return { name, email, role, password };
}

async function adminCount(pool) {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS c FROM users WHERE role = 'Admin'`);
  return rows[0].c;
}

function sendDbError(res, err) {
  if (err.code === '23505') return res.status(409).json({ error: 'A user with this email already exists' });
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}

export function authRouter(pool) {
  const r = express.Router();

  r.post('/login', async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const { rows } = await pool.query('SELECT id, name, email, role, password_hash FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user || !verifyPassword(String(req.body.password || ''), user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    await createSession(pool, res, user.id);
    const { password_hash, ...safe } = user;
    res.json(safe);
  });

  r.post('/logout', async (req, res) => {
    await destroySession(pool, req, res);
    res.status(204).end();
  });

  r.get('/me', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not signed in' });
    res.json(req.user);
  });

  return r;
}

export function usersRouter(pool) {
  const r = express.Router();

  r.get('/', requireAuth, async (_req, res) => {
    const { rows } = await pool.query(`SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY created_at, id`);
    res.json(rows);
  });

  r.post('/', requireAdmin, async (req, res) => {
    const v = validate(req.body, { requirePassword: true });
    if (v.error) return res.status(400).json({ error: v.error });
    try {
      const { rows } = await pool.query(
        `INSERT INTO users (name, email, role, password_hash) VALUES ($1, $2, $3, $4) RETURNING ${PUBLIC_COLUMNS}`,
        [v.name, v.email, v.role, hashPassword(v.password)]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      sendDbError(res, err);
    }
  });

  r.put('/:id', requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const v = validate(req.body, { requirePassword: false });
    if (v.error) return res.status(400).json({ error: v.error });
    const existing = await pool.query('SELECT role FROM users WHERE id = $1', [id]);
    if (!existing.rows[0]) return res.status(404).json({ error: 'User not found' });
    if (existing.rows[0].role === 'Admin' && v.role !== 'Admin' && (await adminCount(pool)) <= 1) {
      return res.status(400).json({ error: 'There must be at least one Admin' });
    }
    try {
      const { rows } = await pool.query(
        `UPDATE users SET name = $1, email = $2, role = $3,
           password_hash = COALESCE($4, password_hash)
         WHERE id = $5 RETURNING ${PUBLIC_COLUMNS}`,
        [v.name, v.email, v.role, v.password ? hashPassword(v.password) : null, id]
      );
      res.json(rows[0]);
    } catch (err) {
      sendDbError(res, err);
    }
  });

  r.delete('/:id', requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (id === req.user.id) return res.status(400).json({ error: "You can't delete your own account" });
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'User not found' });
    res.status(204).end();
  });

  return r;
}
