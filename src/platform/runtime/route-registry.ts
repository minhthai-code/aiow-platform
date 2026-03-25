import type { RouteDefinition } from '@core/types';

export interface ProductDescriptor {
  id: string;
  displayName: string;
  routes: RouteDefinition[];
}

const products = new Map<string, ProductDescriptor>();

export function registerProduct(descriptor: ProductDescriptor): void {
  products.set(descriptor.id, descriptor);
}

export function getRoutesForProduct(id: string): RouteDefinition[] {
  return products.get(id)?.routes ?? [];
}

