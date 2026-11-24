import express from 'express';
import pg from 'pg';
import { loadUser } from './auth.js';
import { authRouter, usersRouter } from './users.js';

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
app.use(loadUser(pool));
app.use('/api/auth', authRouter(pool));
app.use('/api/users', usersRouter(pool));

app.get('/api/orders', async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT id, customer, product, category, amount, status, date FROM orders ORDER BY date DESC'
  );
  res.json(rows);
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
