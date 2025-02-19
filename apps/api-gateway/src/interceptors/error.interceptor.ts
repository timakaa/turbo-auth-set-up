import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';

function doException(err: any) {
  console.log('Error details:', err);

  // handle gRPC errors
  if (err.code && err.details) {
    console.log(err);
    return new HttpException(
      {
        statusCode: err.code || HttpStatus.BAD_REQUEST,
        message: err.details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  if (err instanceof RpcException) {
    const error = err.getError();
    return new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: typeof error === 'object' ? (error as any).message : error,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  try {
    if (err.status === 'error') {
      return new HttpException(
        {
          statusCode: HttpStatus.BAD_GATEWAY,
          message: 'Something went wrong',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }

    const message = err.message || err.details;
    const statusCode =
      err.status ||
      err.code ||
      err.statusCode ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    return new HttpException(
      {
        statusCode,
        message,
      },
      statusCode,
    );
  } catch {
    return new HttpException(
      {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: 'Something went wrong',
      },
      HttpStatus.BAD_GATEWAY,
    );
  }
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        return throwError(() => doException(err));
      }),
    );
  }
}
