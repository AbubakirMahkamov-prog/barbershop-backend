import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    //
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Internal server error',
    };

    // Log the error details only to errors.log
    logger.error(`HTTP ${status} Error: ${exception.message}`, {
      method: request.method,
      url: request.url,
      status: status,
      stack: exception.stack,
    });

    // Send the error response back to the client
    response.status(status).json(errorResponse);
  }
}
