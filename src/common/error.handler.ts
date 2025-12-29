import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorHandler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({ errors: exception.message });
    } else if (exception instanceof ZodError) {
      response.status(400).json({
        errors: exception.message,
      });
    } else {
      response.status(500).json({ errors: 'Internal server error' });
    }
  }
}
