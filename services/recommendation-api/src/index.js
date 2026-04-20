const express = require('express');
const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

const recommendations = {
  'P001': ['P006', 'P002', 'P003'],
  'P002': ['P001', 'P005', 'P006'],
  'P003': ['P004', 'P001', 'P005'],
  default: ['P001', 'P003', 'P004', 'P006']
};

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'recommendation-api', version: '2.3.0', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.json({ ready: true });
});

app.get('/recommendations/product/:productId', (req, res) => {
  const recs = recommendations[req.params.productId] || recommendations.default;
  res.json({
    productId: req.params.productId,
    recommendations: recs.map(id => ({ productId: id, score: (Math.random() * 0.3 + 0.7).toFixed(3) })),
    model: 'collaborative-filtering-v3',
    generatedAt: new Date().toISOString()
  });
});

app.get('/recommendations/user/:userId', (req, res) => {
  res.json({
    userId: req.params.userId,
    recommendations: recommendations.default.map(id => ({
      productId: id,
      score: (Math.random() * 0.3 + 0.7).toFixed(3),
      reason: 'based_on_purchase_history'
    })),
    model: 'user-based-cf-v2',
    generatedAt: new Date().toISOString()
  });
});

app.get('/recommendations/trending', (req, res) => {
  res.json({
    trending: ['P001', 'P003', 'P006', 'P005'].map((id, i) => ({
      productId: id,
      rank: i + 1,
      views24h: Math.floor(Math.random() * 10000 + 1000)
    })),
    generatedAt: new Date().toISOString()
  });
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`# HELP recommendation_requests_total Total recommendation requests\n# TYPE recommendation_requests_total counter\nrecommendation_requests_total 123456\n# HELP recommendation_latency_ms Average recommendation latency\n# TYPE recommendation_latency_ms gauge\nrecommendation_latency_ms 8.2\n`);
});

app.listen(PORT, () => console.log(`recommendation-api running on port ${PORT}`));
module.exports = app;
