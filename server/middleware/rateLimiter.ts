import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Слишком много попыток входа. Попробуйте позже через 15 минут.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Слишком много попыток регистрации. Попробуйте позже через 1 час.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const promocodeValidationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Слишком много попыток проверки промокода. Попробуйте позже.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов. Попробуйте позже.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path.startsWith('/api/products') && req.method === 'GET';
  },
});
