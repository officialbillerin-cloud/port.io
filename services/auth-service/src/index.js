const express = require('express');
const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'auth-service', version: '4.2.1', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.json({ ready: true });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  // Mock auth — never expose real credentials
  if (password.length < 8) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }
  res.json({
    accessToken: `mock-jwt-${Buffer.from(email).toString('base64')}-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
    expiresIn: 3600,
    tokenType: 'Bearer',
    userId: `USR-${Math.floor(Math.random() * 100000)}`
  });
});

app.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  res.json({
    accessToken: `mock-jwt-refreshed-${Date.now()}`,
    expiresIn: 3600,
    tokenType: 'Bearer'
  });
});

app.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/auth/validate', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, error: 'missing_token' });
  }
  res.json({ valid: true, userId: 'USR-12345', roles: ['customer'] });
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`# HELP auth_logins_total Total login attempts\n# TYPE auth_logins_total counter\nauth_logins_total{result="success"} 52341\nauth_logins_total{result="failure"} 892\n# HELP auth_active_sessions Active sessions\n# TYPE auth_active_sessions gauge\nauth_active_sessions 8432\n`);
});

app.listen(PORT, () => console.log(`auth-service running on port ${PORT}`));
module.exports = app;
