export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Email already exists");
    this.name = "EmailAlreadyExistsError";
  }
}