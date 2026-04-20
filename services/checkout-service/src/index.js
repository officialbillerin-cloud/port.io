const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'checkout-service', version: '1.4.2', timestamp: new Date().toISOString() });
});

// Readiness probe
app.get('/ready', (req, res) => {
  res.json({ ready: true });
});

// Mock checkout endpoint
app.post('/checkout', (req, res) => {
  const { cartId, userId, paymentMethod } = req.body;
  if (!cartId || !userId) {
    return res.status(400).json({ error: 'cartId and userId are required' });
  }
  res.json({
    orderId: `ORD-${Date.now()}`,
    cartId,
    userId,
    status: 'confirmed',
    total: (Math.random() * 200 + 10).toFixed(2),
    currency: 'USD',
    estimatedDelivery: '2-3 business days'
  });
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`# HELP checkout_requests_total Total checkout requests\n# TYPE checkout_requests_total counter\ncheckout_requests_total 1042\n# HELP checkout_errors_total Total checkout errors\n# TYPE checkout_errors_total counter\ncheckout_errors_total 3\n`);
});

app.listen(PORT, () => console.log(`checkout-service running on port ${PORT}`));
module.exports = app;
