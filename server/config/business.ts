export const BUSINESS_CONFIG = {
  delivery: {
    defaultCost: 300,
    freeDeliveryThreshold: 5000,
  },
  
  bonuses: {
    maxUsagePercent: 30,
    cashbackPercent: 3,
    noCashbackWithPromocode: true,
    noCashbackWithBonusUsage: true,
  },
  
  websocket: {
    connectionLimit: 10,
    connectionWindowMs: 60 * 1000,
    messageLimit: 60,
    messageWindowMs: 60 * 1000,
  },
  
  orders: {
    defaultStatus: 'pending' as const,
    defaultPaymentStatus: 'pending' as const,
  },
} as const;
