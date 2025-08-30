import app from '../server.js';

export default async (req, res) => {
  try {
    const frontend = process.env.FRONTEND_URL?.replace(/\/$/, '') || 'http://localhost:5173';

    res.setHeader('Access-Control-Allow-Origin', frontend);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    return app(req, res);
  } catch (err) {
    console.error("Serverless function error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
