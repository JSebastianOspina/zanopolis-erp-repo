import { DomainException } from '../domain.exception';

export class NotFoundException extends DomainException {
  constructor(message: string, langInterpolation: Record<string, any> = {}) {
    super(
      message,
      'NOT_FOUND_ERROR',
      'backend_exception.not_found',
      langInterpolation,
    );
  }
}
