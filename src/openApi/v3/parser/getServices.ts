import type { Service } from '../../../client/interfaces/Service';
import type { OpenApi } from '../interfaces/OpenApi';
import { getOperation } from './getOperation';
import { getOperationParameters } from './getOperationParameters';

/**
 * Get the OpenAPI services
 */
export function getServices(openApi: OpenApi): Service[] {
    const services = new Map<string, Service>();

    for (const url in openApi.paths) {
        if (!openApi.paths.hasOwnProperty(url)) { continue; }

        // Grab path and parse any global path parameters
        const path = openApi.paths[url];
        const pathParams = getOperationParameters(openApi, path.parameters || []);

        // Parse all the methods for this path
        for (const method in path) {
            // This for the Typescript check
            if (!path.hasOwnProperty(method)) { continue; }

            switch (method) {
                case 'get':
                case 'put':
                case 'post':
                case 'delete':
                case 'options':
                case 'head':
                case 'patch':
                    // Each method contains an OpenAPI operation, we parse the operation
                    const op = path[method]!;
                    const operation = getOperation(openApi, url, method, op, pathParams);

                    // If we have already declared a service, then we should fetch that and
                    // append the new method to it. Otherwise we should create a new service object.
                    const service = services.get(operation.className) || {
                        name: operation.className,
                        operations: [],
                        imports: [],
                    };

                    // Push the operation in the service
                    service.operations.push(operation);
                    service.imports.push(...operation.imports);
                    services.set(operation.className, service);
                    break;
            }
        }
    }

    return Array.from(services.values());
}
