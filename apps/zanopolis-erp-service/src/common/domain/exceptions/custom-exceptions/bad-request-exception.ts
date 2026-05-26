import { DomainException } from '../domain.exception';

export class BadRequestException extends DomainException {
  constructor(message: string, langInterpolation: Record<string, any> = {}) {
    super(
      message,
      'BAD_REQUEST_ERROR',
      'backend_exception.bad_request',
      langInterpolation,
    );
  }
}
