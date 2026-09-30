import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || 'postgres',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'orders',
  password: process.env.PGPASSWORD || 'orders',
  database: process.env.PGDATABASE || 'orders',
});

const customers = [
  'Acme Corp', 'Globex', 'Initech', 'Umbrella Co',
  'Stark Industries', 'Wayne Enterprises', 'Hooli', 'Vandelay Imports',
];
const products = [
  { name: 'Pro License', category: 'Software', price: 299 },
  { name: 'Team Seat', category: 'Software', price: 49 },
  { name: 'Edge Gateway', category: 'Hardware', price: 1249 },
  { name: 'Sensor Kit', category: 'Hardware', price: 389 },
  { name: 'Onboarding', category: 'Services', price: 1500 },
  { name: 'Support Plan', category: 'Services', price: 199 },
  { name: 'Workshop', category: 'Training', price: 850 },
];
const statuses = ['Paid', 'Paid', 'Paid', 'Pending', 'Refunded'];

async function seed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id        TEXT PRIMARY KEY,
      customer  TEXT NOT NULL,
      product   TEXT NOT NULL,
      category  TEXT NOT NULL,
      amount    INTEGER NOT NULL,
      status    TEXT NOT NULL,
      date      TEXT NOT NULL
    )
  `);

  const { rowCount } = await pool.query('SELECT COUNT(*)::int AS c FROM orders');
  if (rowCount && rowCount > 0) {
    const existing = await pool.query('SELECT COUNT(*)::int AS c FROM orders');
    if (existing.rows[0].c > 0) {
      console.log('orders table already seeded — skipping');
      await pool.end();
      return;
    }
  }

  const rows = Array.from({ length: 48 }, (_, i) => {
    const product = products[(i * 3) % products.length];
    const qty = (i % 4) + 1;
    const date = new Date(2026, 8, 22 - i);
    return [
      `ORD-${(1048 - i).toString().padStart(4, '0')}`,
      customers[(i * 5) % customers.length],
      product.name,
      product.category,
      product.price * qty,
      statuses[(i * 7) % statuses.length],
      date.toISOString().slice(0, 10),
    ];
  });

  for (const r of rows) {
    await pool.query(
      'INSERT INTO orders (id, customer, product, category, amount, status, date) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING',
      r
    );
  }
  console.log(`seeded ${rows.length} orders`);
  await pool.end();
}

seed().catch((err) => {
  console.error('seed failed:', err);
  process.exit(1);
});
