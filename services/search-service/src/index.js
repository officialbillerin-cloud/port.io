const express = require('express');
const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

const mockProducts = [
  { id: 'P001', name: 'iPhone 15 Pro', category: 'Electronics', price: 999.99, rating: 4.8 },
  { id: 'P002', name: 'Samsung 65" QLED TV', category: 'Electronics', price: 1299.99, rating: 4.6 },
  { id: 'P003', name: 'Nike Air Max 270', category: 'Footwear', price: 149.99, rating: 4.5 },
  { id: 'P004', name: 'Instant Pot Duo 7-in-1', category: 'Kitchen', price: 79.99, rating: 4.7 },
  { id: 'P005', name: 'Dyson V15 Vacuum', category: 'Home', price: 649.99, rating: 4.9 },
  { id: 'P006', name: 'Apple AirPods Pro', category: 'Electronics', price: 249.99, rating: 4.7 },
];

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'search-service', version: '1.8.3', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.json({ ready: true });
});

app.get('/search', (req, res) => {
  const { q, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  let results = [...mockProducts];

  if (q) {
    results = results.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  }
  if (category) {
    results = results.filter(p => p.category === category);
  }
  if (minPrice) results = results.filter(p => p.price >= parseFloat(minPrice));
  if (maxPrice) results = results.filter(p => p.price <= parseFloat(maxPrice));

  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + parseInt(limit));

  res.json({
    query: q || '',
    total: results.length,
    page: parseInt(page),
    results: paginated,
    took_ms: Math.floor(Math.random() * 30 + 5)
  });
});

app.get('/search/suggest', (req, res) => {
  const { q } = req.query;
  const suggestions = mockProducts
    .filter(p => p.name.toLowerCase().startsWith((q || '').toLowerCase()))
    .map(p => p.name)
    .slice(0, 5);
  res.json({ suggestions });
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`# HELP search_requests_total Total search requests\n# TYPE search_requests_total counter\nsearch_requests_total 287432\n# HELP search_latency_ms Average search latency\n# TYPE search_latency_ms gauge\nsearch_latency_ms 12.4\n`);
});

app.listen(PORT, () => console.log(`search-service running on port ${PORT}`));
module.exports = app;
