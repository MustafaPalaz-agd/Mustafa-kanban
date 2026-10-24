export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const badRequest = (message: string) =>
  new ApiError(400, "VALIDATION_ERROR", message);

export const notFound = (message = "Kayıt bulunamadı") =>
  new ApiError(404, "NOT_FOUND", message);
