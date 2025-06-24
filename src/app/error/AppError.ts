class AppError extends Error {
  statusCode: number;
  errorDetails?: string;

  constructor(statusCode: number, message: string, errorDetails?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
