import { ApiServiceRegistryEntry } from "./types";

/**
 * Service registry to keep track of all API services
 * This is useful for documentation, testing, and API exploration
 */
export class ApiServiceRegistry {
  private static instance: ApiServiceRegistry;
  private services: ApiServiceRegistryEntry[] = [];

  private constructor() {}

  /**
   * Returns the singleton instance of the registry
   */
  public static getInstance(): ApiServiceRegistry {
    if (!ApiServiceRegistry.instance) {
      ApiServiceRegistry.instance = new ApiServiceRegistry();
    }
    return ApiServiceRegistry.instance;
  }

  /**
   * Register a service in the registry
   */
  public registerService(service: ApiServiceRegistryEntry): void {
    // Check if service with same name already exists
    const existingIndex = this.services.findIndex(
      (s) => s.name === service.name
    );

    if (existingIndex >= 0) {
      // Replace existing service
      this.services[existingIndex] = service;
    } else {
      // Add new service
      this.services.push(service);
    }
  }

  /**
   * Get all registered services
   */
  public getServices(): ApiServiceRegistryEntry[] {
    return [...this.services];
  }

  /**
   * Get a service by name
   */
  public getServiceByName(name: string): ApiServiceRegistryEntry | undefined {
    return this.services.find((service) => service.name === name);
  }

  /**
   * Get services by endpoint pattern
   */
  public getServicesByEndpoint(
    endpointPattern: string
  ): ApiServiceRegistryEntry[] {
    return this.services.filter(
      (service) =>
        typeof service.endpoint === "string" &&
        service.endpoint.includes(endpointPattern)
    );
  }

  /**
   * Get services by HTTP method
   */
  public getServicesByMethod(method: string): ApiServiceRegistryEntry[] {
    return this.services.filter((service) => service.method === method);
  }

  /**
   * Get authenticated services
   */
  public getAuthenticatedServices(): ApiServiceRegistryEntry[] {
    return this.services.filter((service) => service.requiresAuth);
  }

  /**
   * Get services that expect a request body
   */
  public getServicesWithRequestBody(): ApiServiceRegistryEntry[] {
    return this.services.filter((service) => service.hasRequestBody);
  }
}

/**
 * Singleton instance of the API service registry
 */
export const apiServiceRegistry = ApiServiceRegistry.getInstance();
