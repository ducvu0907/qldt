export const AUTH_SERVER_URL = "http://157.66.24.126:8080/it4788";
export const RESOURCE_SERVER_URL = "http://157.66.24.126:8080/it5023e";

export type ApiError = {
  readonly code?: number,
  readonly statusCode?: number,
  readonly message?: string,
}

export type ApiResponse = {
  readonly code?: number,
  readonly statusCode?: number,
  readonly message?: number,
  readonly data?: any,
}
