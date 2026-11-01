import express from 'express';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || 'postgres',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'orders',
  password: process.env.PGPASSWORD || 'orders',
  database: process.env.PGDATABASE || 'orders',
});

const app = express();
app.use(express.json());

app.get('/api/orders', async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT id, customer, product, category, amount, status, date FROM orders ORDER BY date DESC'
  );
  res.json(rows);
});

const ROLES = ['Admin', 'Editor', 'Viewer'];
const USER_STATUSES = ['Active', 'Invited', 'Suspended'];
const USER_COLUMNS = 'id, name, email, role, status, created_at AS "createdAt"';

function validateUser(body, partial) {
  const { name, email, role, status } = body ?? {};
  if (!partial || name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) return 'Name is required';
  }
  if (!partial || email !== undefined) {
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'A valid email is required';
  }
  if (role !== undefined && !ROLES.includes(role)) return `Role must be one of ${ROLES.join(', ')}`;
  if (status !== undefined && !USER_STATUSES.includes(status)) return `Status must be one of ${USER_STATUSES.join(', ')}`;
  return null;
}

function normalize(key, value) {
  if (key === 'email') return value.trim().toLowerCase();
  if (key === 'name') return value.trim();
  return value;
}

function handleDbError(res, err) {
  if (err.code === '23505') return res.status(409).json({ error: 'A user with this email already exists' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}

app.get('/api/users', async (_req, res) => {
  const { rows } = await pool.query(`SELECT ${USER_COLUMNS} FROM users ORDER BY id`);
  res.json(rows);
});

app.post('/api/users', async (req, res) => {
  const error = validateUser(req.body, false);
  if (error) return res.status(400).json({ error });
  const { name, email, role = 'Viewer', status = 'Invited' } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, role, status, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING ${USER_COLUMNS}`,
      [normalize('name', name), normalize('email', email), role, status, new Date().toISOString().slice(0, 10)]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    handleDbError(res, err);
  }
});

app.patch('/api/users/:id', async (req, res) => {
  const error = validateUser(req.body, true);
  if (error) return res.status(400).json({ error });
  const keys = ['name', 'email', 'role', 'status'].filter((k) => req.body[k] !== undefined);
  if (!keys.length) return res.status(400).json({ error: 'Nothing to update' });
  try {
    const { rows } = await pool.query(
      `UPDATE users SET ${keys.map((k, i) => `${k} = $${i + 1}`).join(', ')} WHERE id = $${keys.length + 1} RETURNING ${USER_COLUMNS}`,
      [...keys.map((k) => normalize(k, req.body[k])), Number(req.params.id)]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    handleDbError(res, err);
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [Number(req.params.id)]);
  if (!rowCount) return res.status(404).json({ error: 'User not found' });
  res.status(204).end();
});

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: String(err) });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, '0.0.0.0', () => console.log(`orders-api listening on ${port}`));
