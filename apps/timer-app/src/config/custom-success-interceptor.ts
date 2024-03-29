import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class SuccessResponse<T> {
  readonly status: string;
  readonly data?: T;

  constructor(data: T) {
    this.status = 'success';
    this.data = data;
  }
}

@Injectable()
export class CustomSuccessInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<unknown>> {
    context.switchToHttp().getResponse().status(HttpStatus.OK);
    return next.handle().pipe(map((data) => new SuccessResponse(data)));
  }
}
