const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

const mockInventory = {
  'SKU-001': { name: 'iPhone 15 Pro', stock: 342, warehouse: 'WH-DALLAS', reserved: 12 },
  'SKU-002': { name: 'Samsung TV 65"', stock: 87, warehouse: 'WH-CHICAGO', reserved: 5 },
  'SKU-003': { name: 'Nike Air Max', stock: 1204, warehouse: 'WH-LA', reserved: 89 },
  'SKU-004': { name: 'Instant Pot', stock: 456, warehouse: 'WH-DALLAS', reserved: 23 },
};

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'inventory-api', version: '3.0.1', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.json({ ready: true });
});

app.get('/inventory/:sku', (req, res) => {
  const item = mockInventory[req.params.sku];
  if (!item) return res.status(404).json({ error: 'SKU not found' });
  res.json({ sku: req.params.sku, ...item, available: item.stock - item.reserved });
});

app.get('/inventory', (req, res) => {
  const items = Object.entries(mockInventory).map(([sku, data]) => ({
    sku, ...data, available: data.stock - data.reserved
  }));
  res.json({ items, total: items.length });
});

app.patch('/inventory/:sku/reserve', (req, res) => {
  const { quantity } = req.body;
  const item = mockInventory[req.params.sku];
  if (!item) return res.status(404).json({ error: 'SKU not found' });
  if (item.stock - item.reserved < quantity) {
    return res.status(409).json({ error: 'insufficient_stock' });
  }
  item.reserved += quantity;
  res.json({ sku: req.params.sku, reserved: item.reserved, available: item.stock - item.reserved });
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`# HELP inventory_requests_total Total inventory API requests\n# TYPE inventory_requests_total counter\ninventory_requests_total 45231\n# HELP inventory_items_total Total SKUs tracked\n# TYPE inventory_items_total gauge\ninventory_items_total 4\n`);
});

app.listen(PORT, () => console.log(`inventory-api running on port ${PORT}`));
module.exports = app;
