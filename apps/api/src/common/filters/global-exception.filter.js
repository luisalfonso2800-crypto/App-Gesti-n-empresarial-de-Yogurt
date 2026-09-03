import { Catch, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = { message: 'Internal server error' };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception && exception.constructor && exception.constructor.name === 'PrismaClientKnownRequestError') {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = { message: 'Conflict: Unique constraint failed' };
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = { message: 'Not Found: Record to update not found' };
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = { message: 'Bad Request: Invalid database operation' };
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: typeof message === 'string' ? message : message.message || message,
    });
  }
}
