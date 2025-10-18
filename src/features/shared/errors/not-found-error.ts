import { ApiError } from "@/infra/http/errors";

export class NotFoundError extends ApiError {
  constructor(description: string = "Resource not found", raw?: unknown) {
    super({ status: 404, code: "not_found", description, raw });
    this.name = "NotFoundError";
  }
}
