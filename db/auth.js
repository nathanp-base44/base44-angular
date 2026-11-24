import crypto from 'node:crypto';

const SESSION_COOKIE = 'sid';
const SESSION_DAYS = 7;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return expected.length === candidate.length && crypto.timingSafeEqual(candidate, expected);
}

function readCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export async function createSession(pool, res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  await pool.query(
    `INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '${SESSION_DAYS} days')`,
    [token, userId]
  );
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export async function destroySession(pool, req, res) {
  const token = readCookie(req, SESSION_COOKIE);
  if (token) await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
  res.clearCookie(SESSION_COOKIE, { path: '/' });
}

/** Attaches req.user ({ id, name, email, role }) when a valid session cookie is present. */
export function loadUser(pool) {
  return async (req, _res, next) => {
    try {
      const token = readCookie(req, SESSION_COOKIE);
      if (token) {
        const { rows } = await pool.query(
          `SELECT u.id, u.name, u.email, u.role FROM sessions s
           JOIN users u ON u.id = s.user_id
           WHERE s.token = $1 AND s.expires_at > NOW()`,
          [token]
        );
        req.user = rows[0] || null;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Sign in required' });
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Sign in required' });
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admins only' });
  next();
}
