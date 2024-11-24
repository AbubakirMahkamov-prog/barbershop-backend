import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    // Log the request before the response is sent
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - req['startTime'];

      // Only log successful responses (status codes < 400)
      if (statusCode < 400) {
        logger.info(`${method} ${originalUrl} ${statusCode} - ${responseTime}ms`);
      }
    });

    req['startTime'] = Date.now();
    next();
  }
}
