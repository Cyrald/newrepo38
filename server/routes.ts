import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { db } from "./db";
import * as cookieSignature from "cookie-signature";
import { env } from "./env";
import { logger } from "./utils/logger";
import { BUSINESS_CONFIG } from "./config/business";

import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import productsRoutes from "./routes/products.routes";
import cartRoutes from "./routes/cart.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import addressesRoutes from "./routes/addresses.routes";
import paymentCardsRoutes from "./routes/payment-cards.routes";
import categoriesRoutes from "./routes/categories.routes";
import promocodesRoutes from "./routes/promocodes.routes";
import { createOrdersRoutes } from "./routes/orders.routes";
import adminRoutes from "./routes/admin.routes";
import { createSupportRoutes } from "./routes/support.routes";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  const connectedUsers = new Map<string, { ws: any, roles: string[] }>();

  const SESSION_ID_REGEX = /^[a-zA-Z0-9_-]{20,128}$/;

  async function validateSessionFromCookie(cookieHeader: string | undefined): Promise<{ userId: string; userRoles: string[] } | null> {
    if (!cookieHeader) return null;
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const sessionCookie = cookies['sessionId'];
    if (!sessionCookie) return null;
    
    const decodedCookie = decodeURIComponent(sessionCookie);
    
    if (!decodedCookie.startsWith('s:')) {
      return null;
    }
    
    const signedValue = decodedCookie.slice(2);
    const unsignedValue = cookieSignature.unsign(signedValue, env.SESSION_SECRET);
    
    if (unsignedValue === false) {
      return null;
    }
    
    const sid = unsignedValue;
    
    if (!SESSION_ID_REGEX.test(sid)) {
      logger.warn('Invalid session ID format detected');
      return null;
    }
    
    try {
      const sessionRecord = await db.query.sessions.findFirst({
        where: (sessions, { eq }) => eq(sessions.sid, sid),
      });
      
      if (!sessionRecord) return null;
      
      const now = new Date();
      const expireDate = new Date(sessionRecord.expire);
      
      if (expireDate < now) {
        logger.warn('Expired session detected in WebSocket', { 
          sid, 
          expiredAt: expireDate 
        });
        return null;
      }
      
      const sessionData = sessionRecord.sess as any;
      if (!sessionData || !sessionData.userId) return null;
      
      return {
        userId: sessionData.userId,
        userRoles: sessionData.userRoles || []
      };
    } catch (error) {
      logger.error('Session validation error', { error });
      return null;
    }
  }

  const connectionRateLimits = new Map<string, { count: number; resetAt: number }>();
  const messageRateLimits = new Map<string, { count: number; resetAt: number }>();
  const activeConnectionsByIp = new Map<string, Set<any>>();
  const MAX_CONCURRENT_CONNECTIONS_PER_IP = 5;
  const MAX_MESSAGE_SIZE = 50 * 1024;
  const { connectionLimit, connectionWindowMs, messageLimit, messageWindowMs } = BUSINESS_CONFIG.websocket;

  setInterval(() => {
    const now = Date.now();
    
    Array.from(connectionRateLimits.entries()).forEach(([key, value]) => {
      if (now > value.resetAt) {
        connectionRateLimits.delete(key);
      }
    });
    
    Array.from(messageRateLimits.entries()).forEach(([key, value]) => {
      if (now > value.resetAt) {
        messageRateLimits.delete(key);
      }
    });
    
    const cleanedConnections = connectionRateLimits.size;
    const cleanedMessages = messageRateLimits.size;
    if (cleanedConnections > 0 || cleanedMessages > 0) {
      logger.debug('Rate limit maps cleanup', { 
        connectionRateLimits: cleanedConnections,
        messageRateLimits: cleanedMessages 
      });
    }
  }, 60000);

  wss.on("connection", async (ws: any, req: any) => {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
    
    const activeConns = activeConnectionsByIp.get(clientIp) || new Set();
    if (activeConns.size >= MAX_CONCURRENT_CONNECTIONS_PER_IP) {
      logger.warn('Too many concurrent WebSocket connections from IP', { 
        clientIp, 
        count: activeConns.size 
      });
      ws.close(1008, 'Maximum concurrent connections exceeded');
      return;
    }
    
    const origin = req.headers.origin;
    if (env.NODE_ENV === 'production') {
      const allowedOrigins = [
        env.FRONTEND_URL,
        env.REPLIT_DEV_DOMAIN
      ].filter(Boolean);
      
      if (!origin || !allowedOrigins.includes(origin)) {
        logger.warn('WebSocket connection from invalid origin', { origin, clientIp });
        ws.close(1008, 'Invalid origin');
        return;
      }
    }
    
    const now = Date.now();
    const ipLimit = connectionRateLimits.get(clientIp) || { count: 0, resetAt: now + connectionWindowMs };
    
    if (now > ipLimit.resetAt) {
      ipLimit.count = 0;
      ipLimit.resetAt = now + connectionWindowMs;
    }
    
    if (ipLimit.count >= connectionLimit) {
      logger.warn('WebSocket connection rate limit exceeded', { clientIp });
      ws.close(1008, 'Too many connections');
      return;
    }
    
    ipLimit.count++;
    connectionRateLimits.set(clientIp, ipLimit);
    
    const sessionData = await validateSessionFromCookie(req.headers.cookie);
    
    if (!sessionData) {
      logger.warn('WebSocket connection rejected - invalid session', { clientIp });
      ws.close(1008, 'Unauthorized - invalid session');
      return;
    }
    
    const userId = sessionData.userId;
    const userRoleRecords = await storage.getUserRoles(userId);
    const userRoles = userRoleRecords.map(r => r.role);
    connectedUsers.set(userId, { ws, roles: userRoles });
    
    activeConns.add(ws);
    activeConnectionsByIp.set(clientIp, activeConns);
    
    logger.info('WebSocket connection established', { userId, roles: userRoles });
    
    ws.send(JSON.stringify({
      type: "auth_success",
      message: "Подключение установлено",
    }));

    let isAlive = true;
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    const pingInterval = setInterval(() => {
      if (ws.isAlive === false) {
        logger.warn('WebSocket connection timeout - no pong received', { userId });
        clearInterval(pingInterval);
        ws.terminate();
        connectedUsers.delete(userId);
        messageRateLimits.delete(userId);
        return;
      }
      
      ws.isAlive = false;
      ws.ping();
    }, 30000);

    let messageTimeout: NodeJS.Timeout | null = null;

    ws.on("message", async (data: any) => {
      try {
        if (messageTimeout) clearTimeout(messageTimeout);
        
        if (data.length > MAX_MESSAGE_SIZE) {
          logger.warn('WebSocket message too large', { userId, size: data.length, maxSize: MAX_MESSAGE_SIZE });
          ws.close(1009, 'Message too large');
          return;
        }

        const msgNow = Date.now();
        const userMsgLimit = messageRateLimits.get(userId) || { count: 0, resetAt: msgNow + messageWindowMs };
        
        if (msgNow > userMsgLimit.resetAt) {
          userMsgLimit.count = 0;
          userMsgLimit.resetAt = msgNow + messageWindowMs;
        }
        
        if (userMsgLimit.count >= messageLimit) {
          logger.warn('WebSocket message rate limit exceeded', { userId });
          ws.send(JSON.stringify({
            type: "rate_limit",
            message: "Слишком много сообщений, подождите минуту",
          }));
          return;
        }
        
        userMsgLimit.count++;
        messageRateLimits.set(userId, userMsgLimit);
        
        const message = JSON.parse(data.toString());
        
        if (messageTimeout) clearTimeout(messageTimeout);
        messageTimeout = null;
        
      } catch (error) {
        logger.error("WebSocket message error", { error, userId });
        if (messageTimeout) clearTimeout(messageTimeout);
        messageTimeout = null;
      }
    });

    ws.on("close", () => {
      clearInterval(pingInterval);
      if (messageTimeout) clearTimeout(messageTimeout);
      connectedUsers.delete(userId);
      messageRateLimits.delete(userId);
      
      const conns = activeConnectionsByIp.get(clientIp);
      if (conns) {
        conns.delete(ws);
        if (conns.size === 0) {
          activeConnectionsByIp.delete(clientIp);
        }
      }
    });

    ws.on("error", (error: any) => {
      logger.error('WebSocket error', { error, userId });
      clearInterval(pingInterval);
      if (messageTimeout) clearTimeout(messageTimeout);
      connectedUsers.delete(userId);
      messageRateLimits.delete(userId);
      
      const conns = activeConnectionsByIp.get(clientIp);
      if (conns) {
        conns.delete(ws);
        if (conns.size === 0) {
          activeConnectionsByIp.delete(clientIp);
        }
      }
    });
  });

  app.use('/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productsRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/addresses', addressesRoutes);
  app.use('/api/payment-cards', paymentCardsRoutes);
  app.use('/api/categories', categoriesRoutes);
  app.use('/api/promocodes', promocodesRoutes);
  app.use('/api/orders', createOrdersRoutes(connectedUsers));
  app.use('/api/admin', adminRoutes);
  app.use('/api/support', createSupportRoutes(connectedUsers));

  return httpServer;
}
