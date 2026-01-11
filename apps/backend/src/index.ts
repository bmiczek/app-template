import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authMiddleware, type AuthVariables } from './middleware/auth';
import { authRoutes } from './routes/auth';

const app = new Hono<{ Variables: AuthVariables }>();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Auth middleware - attaches session/user to all requests
app.use('*', authMiddleware());

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.get('/api', (c) => {
  return c.json({
    message: 'Welcome to App Template API',
    version: '1.0.0',
  });
});

// Auth routes
app.route('/api/auth', authRoutes);

const port = Number(process.env.PORT) || 3001;

console.log(`🚀 Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
