export abstract class DomainException extends Error {
  public readonly code: string;
  public readonly langKey: string;
  public readonly langInterpolation: Record<string, any>;

  constructor(
    message: string,
    code: string,
    langKey: string,
    langInterpolation: Record<string, any> = {},
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.langKey = langKey;
    this.langInterpolation = langInterpolation;
    Error.captureStackTrace(this, this.constructor);
  }
}
