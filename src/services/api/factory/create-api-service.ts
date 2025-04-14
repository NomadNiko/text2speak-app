import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "../services/types/request-config";
import {
  ApiServiceWithBodyOptions,
  ApiServiceWithoutBodyOptions,
  ApiServiceHook,
  ApiServiceWithBodyHook,
  DynamicEndpointFn,
  QueryParams,
} from "./types";
import { apiServiceRegistry } from "./service-registry";

/**
 * Creates an API service hook for endpoints that expect a request body (POST, PUT, PATCH)
 */
export function createApiServiceWithBody<
  TRequest,
  TResponse,
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
>(
  options: ApiServiceWithBodyOptions<TRequest, TPathParams, TQueryParams>
): () => ApiServiceWithBodyHook<
  TRequest,
  TResponse,
  TPathParams,
  TQueryParams
> {
  const {
    method,
    endpoint,
    baseUrl = API_URL,
    requiresAuth = true,
    withCredentials = false,
    transformRequest = (data) => JSON.stringify(data) as BodyInit,
    formatQueryParams,
  } = options;

  // Register service for documentation
  apiServiceRegistry.registerService({
    name: typeof endpoint === "string" ? endpoint : "dynamic-endpoint",
    description: `${method} service with body`,
    endpoint:
      typeof endpoint === "string"
        ? endpoint
        : (params: unknown) => endpoint(params as TPathParams),
    method,
    requiresAuth,
    hasRequestBody: true,
    requestType: "TRequest",
    responseType: "TResponse",
  });

  if (!["POST", "PUT", "PATCH"].includes(method)) {
    console.warn(
      `Method ${method} usually doesn't include a request body. Consider using createApiService instead.`
    );
  }

  return function useApiService() {
    const fetchBase = useFetch();

    return useCallback(
      async (
        data: TRequest,
        pathParams?: TPathParams,
        queryParams?: TQueryParams,
        requestConfig?: RequestConfigType
      ) => {
        const resolvedEndpoint =
          typeof endpoint === "function" && pathParams
            ? endpoint(pathParams)
            : endpoint;

        let url = `${baseUrl}${resolvedEndpoint}`;

        if (queryParams && formatQueryParams) {
          const formattedParams = formatQueryParams(queryParams);
          const separator = url.includes("?") ? "&" : "?";
          url += `${separator}${formattedParams}`;
        }

        return fetchBase(url, {
          method,
          body: transformRequest(data),
          credentials: withCredentials ? "include" : undefined,
          ...requestConfig,
        }).then(wrapperFetchJsonResponse<TResponse>);
      },
      [fetchBase]
    );
  };
}

/**
 * Creates an API service hook for endpoints that don't expect a request body (GET, DELETE)
 */
export function createApiService<
  TResponse,
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
>(
  options: ApiServiceWithoutBodyOptions<TPathParams, TQueryParams>
): () => ApiServiceHook<TResponse, TPathParams, TQueryParams> {
  const {
    method,
    endpoint,
    baseUrl = API_URL,
    requiresAuth = true,
    withCredentials = false,
    formatQueryParams,
  } = options;

  // Register service for documentation
  apiServiceRegistry.registerService({
    name: typeof endpoint === "string" ? endpoint : "dynamic-endpoint",
    description: `${method} service`,
    endpoint:
      typeof endpoint === "string"
        ? endpoint
        : (params: unknown) => endpoint(params as TPathParams),
    method,
    requiresAuth,
    hasRequestBody: false,
    responseType: "TResponse",
  });

  if (["POST", "PUT", "PATCH"].includes(method)) {
    console.warn(
      `Method ${method} usually includes a request body. Consider using createApiServiceWithBody instead.`
    );
  }

  return function useApiService() {
    const fetchBase = useFetch();

    return useCallback(
      async (
        pathParams?: TPathParams,
        queryParams?: TQueryParams,
        requestConfig?: RequestConfigType
      ) => {
        const resolvedEndpoint =
          typeof endpoint === "function" && pathParams
            ? endpoint(pathParams)
            : endpoint;

        let url = `${baseUrl}${resolvedEndpoint}`;

        if (queryParams && formatQueryParams) {
          const formattedParams = formatQueryParams(queryParams);
          const separator = url.includes("?") ? "&" : "?";
          url += `${separator}${formattedParams}`;
        }

        return fetchBase(url, {
          method,
          credentials: withCredentials ? "include" : undefined,
          ...requestConfig,
        }).then(wrapperFetchJsonResponse<TResponse>);
      },
      [fetchBase]
    );
  };
}

/**
 * Helper function to create a simple GET service
 */
export function createGetService<
  TResponse,
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
>(
  endpoint: string | DynamicEndpointFn<TPathParams>,
  options: Partial<ApiServiceWithoutBodyOptions<TPathParams, TQueryParams>> = {}
) {
  return createApiService<TResponse, TPathParams, TQueryParams>({
    method: "GET",
    endpoint,
    ...options,
  });
}

/**
 * Helper function to create a simple POST service
 */
export function createPostService<
  TRequest,
  TResponse,
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
>(
  endpoint: string | DynamicEndpointFn<TPathParams>,
  options: Partial<
    ApiServiceWithBodyOptions<TRequest, TPathParams, TQueryParams>
  > = {}
) {
  return createApiServiceWithBody<
    TRequest,
    TResponse,
    TPathParams,
    TQueryParams
  >({
    method: "POST",
    endpoint,
    ...options,
  });
}

/**
 * Helper function to create a simple PUT service
 */
export function createPutService<
  TRequest,
  TResponse,
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
>(
  endpoint: string | DynamicEndpointFn<TPathParams>,
  options: Partial<
    ApiServiceWithBodyOptions<TRequest, TPathParams, TQueryParams>
  > = {}
) {
  return createApiServiceWithBody<
    TRequest,
    TResponse,
    TPathParams,
    TQueryParams
  >({
    method: "PUT",
    endpoint,
    ...options,
  });
}

/**
 * Helper function to create a simple PATCH service
 */
export function createPatchService<
  TRequest,
  TResponse,
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
>(
  endpoint: string | DynamicEndpointFn<TPathParams>,
  options: Partial<
    ApiServiceWithBodyOptions<TRequest, TPathParams, TQueryParams>
  > = {}
) {
  return createApiServiceWithBody<
    TRequest,
    TResponse,
    TPathParams,
    TQueryParams
  >({
    method: "PATCH",
    endpoint,
    ...options,
  });
}

/**
 * Helper function to create a simple DELETE service
 */
export function createDeleteService<
  TResponse,
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
>(
  endpoint: string | DynamicEndpointFn<TPathParams>,
  options: Partial<ApiServiceWithoutBodyOptions<TPathParams, TQueryParams>> = {}
) {
  return createApiService<TResponse, TPathParams, TQueryParams>({
    method: "DELETE",
    endpoint,
    ...options,
  });
}

/**
 * Helper function for handling file uploads
 */
export function createFileUploadService<
  TResponse,
  TPathParams = unknown,
  TQueryParams extends QueryParams = QueryParams,
>(
  endpoint: string | DynamicEndpointFn<TPathParams>,
  options: Partial<
    ApiServiceWithBodyOptions<File, TPathParams, TQueryParams>
  > = {}
) {
  return createApiServiceWithBody<File, TResponse, TPathParams, TQueryParams>({
    method: "POST",
    endpoint,
    transformRequest: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return formData;
    },
    ...options,
  });
}
