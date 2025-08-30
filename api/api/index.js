import app from '../server.js';

export default async (req, res) => {
  const frontend = process.env.FRONTEND_URL?.replace(/\/$/, '') || 'http://localhost:5173';

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', frontend);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Delegate to Express app
  return app(req, res);
};