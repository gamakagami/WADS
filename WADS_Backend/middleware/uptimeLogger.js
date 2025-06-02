import uptimeLog from '../models/uptimeLog.model.js';

const uptimeLogger = (req, res, next) => {
  res.on('finish', async () => {
    const isUp = res.statusCode < 500;
    const status = isUp ? 'up' : 'down';

    try {
      await uptimeLog.create({
        status,
        message: `${req.method} ${req.originalUrl} → ${res.statusCode}`
      });
    } catch (err) {
      console.error('Failed to log uptime:', err.message);
    }
  });

  next();
};

export default uptimeLogger;
