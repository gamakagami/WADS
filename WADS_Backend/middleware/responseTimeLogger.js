import responseTime from '../models/responseTime.model.js'

function responseTimeLogger(req, res, next) {
  const start = process.hrtime();

  res.on('finish', async () => {
    const diff = process.hrtime(start);
    const durationMs = (diff[0] * 1000) + (diff[1] / 1e6);

    try {
      await responseTime.create({
        timestamp: new Date(),
        durationMs
      });
    } catch (err) {
      console.error('Failed to log server response time:', err);
    }
  });

  next();
}

export default responseTimeLogger;
