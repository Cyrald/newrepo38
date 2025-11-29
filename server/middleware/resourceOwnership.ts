import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface ResourceWithOwner {
  userId: string;
}

export function requireOwnership(
  resourceGetter: (id: string) => Promise<ResourceWithOwner | undefined>,
  resourceName: string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource = await resourceGetter(req.params.id);
      
      if (!resource) {
        return res.status(404).json({ 
          message: `${resourceName} не найден` 
        });
      }
      
      if (resource.userId !== req.userId) {
        logger.warn('IDOR attempt detected', {
          userId: req.userId,
          resourceId: req.params.id,
          resourceType: resourceName,
          ip: req.ip,
        });
        
        return res.status(404).json({ 
          message: `${resourceName} не найден` 
        });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}
