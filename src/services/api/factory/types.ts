import { RequestConfigType } from "../services/types/request-config";
import { FetchJsonResponse } from "../types/fetch-json-response";

/**
 * Standard HTTP methods supported by the API
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Function type for dynamic endpoint generation from path parameters
 */
export type DynamicEndpointFn<TPathParams> = (params: TPathParams) => string;

/**
 * Base query parameters interface - Removed as it was too restrictive
 */
export type QueryParams = Record<string, unknown>;

/**
 * Base options for all API services
 */
export interface BaseApiServiceOptions<
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
> {
  method: HttpMethod;
  endpoint: string | DynamicEndpointFn<TPathParams>;
  baseUrl?: string;
  requiresAuth?: boolean;
  withCredentials?: boolean;
  formatQueryParams?: (params: TQueryParams) => URLSearchParams | string;
}

/**
 * Options for API services that accept a request body (POST, PUT, PATCH)
 */
export interface ApiServiceWithBodyOptions<
  TRequest = unknown,
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
> extends BaseApiServiceOptions<TPathParams, TQueryParams> {
  transformRequest?: (data: TRequest) => BodyInit;
}

/**
 * Options for API services that don't accept a request body (GET, DELETE)
 */
export interface ApiServiceWithoutBodyOptions<
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
> extends BaseApiServiceOptions<TPathParams, TQueryParams> {}

/**
 * Hook signature for API services without a request body (GET, DELETE)
 */
export type ApiServiceHook<
  TResponse,
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
> = (
  pathParams?: TPathParams,
  queryParams?: TQueryParams,
  requestConfig?: RequestConfigType
) => Promise<FetchJsonResponse<TResponse>>;

/**
 * Hook signature for API services with a request body (POST, PUT, PATCH)
 */
export type ApiServiceWithBodyHook<
  TRequest,
  TResponse,
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
> = (
  data: TRequest,
  pathParams?: TPathParams,
  queryParams?: TQueryParams,
  requestConfig?: RequestConfigType
) => Promise<FetchJsonResponse<TResponse>>;

/**
 * Interface for registering services in the service registry
 */
export interface ApiServiceRegistryEntry {
  name: string;
  description: string;
  endpoint: string | DynamicEndpointFn<unknown>;
  method: HttpMethod;
  requiresAuth: boolean;
  hasRequestBody: boolean;
  requestType?: string;
  responseType?: string;
}
