const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'payment-gateway', version: '2.1.0', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.json({ ready: true });
});

app.post('/payments/process', (req, res) => {
  const { orderId, amount, currency, paymentMethod } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({ error: 'orderId and amount are required' });
  }
  // Simulate payment processing
  const success = Math.random() > 0.05; // 95% success rate
  if (success) {
    res.json({
      transactionId: `TXN-${Date.now()}`,
      orderId,
      amount,
      currency: currency || 'USD',
      status: 'approved',
      processor: 'stripe',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(402).json({ error: 'payment_declined', orderId });
  }
});

app.get('/payments/:transactionId', (req, res) => {
  res.json({
    transactionId: req.params.transactionId,
    status: 'settled',
    amount: '99.99',
    currency: 'USD'
  });
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`# HELP payment_transactions_total Total payment transactions\n# TYPE payment_transactions_total counter\npayment_transactions_total{status="approved"} 9821\npayment_transactions_total{status="declined"} 47\n`);
});

app.listen(PORT, () => console.log(`payment-gateway running on port ${PORT}`));
module.exports = app;
