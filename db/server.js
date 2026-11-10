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

app.get('/api/customer-notes/latest', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT DISTINCT ON (customer) id, customer, body, created_at
       FROM customer_notes
      ORDER BY customer, created_at DESC, id DESC`
  );
  res.json(rows);
});

app.post('/api/customer-notes', async (req, res) => {
  const customer = String(req.body?.customer ?? '').trim();
  const body = String(req.body?.body ?? '').trim();
  if (!customer || !body || body.length > 280) {
    return res.status(400).json({ error: 'customer and a 1-280 character note are required' });
  }
  const { rows } = await pool.query(
    'INSERT INTO customer_notes (customer, body) VALUES ($1, $2) RETURNING id, customer, body, created_at',
    [customer, body]
  );
  res.status(201).json(rows[0]);
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
