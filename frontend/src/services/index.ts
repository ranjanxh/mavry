import { USE_MOCKS } from './config';
import { createHttpServices } from './http/index';
import { createMockServices } from './mock';
import { storage } from './storage';
import type { Services } from './types';

/** The one place components get services from. Swap mock for HTTP with VITE_USE_MOCKS=false. */
export const services: Services = USE_MOCKS ? createMockServices(storage) : createHttpServices();

export { storage } from './storage';
export { onDataChange } from './events';
export { ServiceError } from './types';
export type { Services } from './types';
