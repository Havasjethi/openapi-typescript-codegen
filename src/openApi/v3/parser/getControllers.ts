import { OpenApi } from "../interfaces/OpenApi";
import { getOperationParameters } from "./getOperationParameters";
import { getControllerOperation, getOperation } from "./getOperation";
import { Controller } from "../../../client/interfaces/Client";
import { Operation } from "../../../client/interfaces/Operation";
import { postProcessServiceOperations } from "../../../utils/postProcessServiceOperations";
import { postProcessImports } from "../../../utils/postProcessServiceImports";

export function getControllers (openApi: OpenApi) {
    const controllers = new Map<string, Controller>();

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
                    const operation = getControllerOperation(openApi, url, method, op, pathParams);
                    // console.log(operation);

                    // If we have already declared a service, then we should fetch that and
                    // append the new method to it. Otherwise we should create a new service object.
                    const service = controllers.get(operation.className) || {
                        name: operation.className,
                        operations: [],
                        imports: [],
                        path: '/'
                    };

                    //   Push the operation in the service
                    service.operations.push(operation);
                    service.imports.push(...operation.imports);
                    controllers.set(operation.className, service);
                    break;
            }
        }
    }

    postProcessControllers(controllers);

    return Array.from(controllers.values());
}

function postProcessControllers (map: Map<string, Controller>) {
    for (const [key, controller] of map.entries()) {
        fixControllerExports(controller);
        fixControllerAndMethodPaths(controller);
    }
}

function fixControllerExports (controller: Controller) {
    controller.operations = postProcessServiceOperations(controller);

    const x: string[] = [];
    controller.operations.forEach(operation => {
        x.push(...operation.imports);
    });
    controller.imports = postProcessImports(x);
}

function fixControllerAndMethodPaths (controller: Controller) {
    const common = get_common_path(controller.operations);
    controller.path = common;

    const x = common.length;

    for (const operation of controller.operations) {
        let new_path = operation.path.slice(x);
        new_path = new_path.length > 0 ? new_path : '/';
        // const x = operation.path.;
        // console.log(`      Path:  ${operation.method}  ${operation.path}`);
        // console.log('  New Path: ', new_path); // operation.path.slice(x));
        operation.path = new_path;
    }
}

function get_common_path (paths: Operation[]): string {
    let longest_length = -1;
    let longest_path = '';

    const path_array = paths.map(e => {
        if (e.path.length > longest_length) {
            longest_length = e.path.length;
            longest_path = e.path;
        }
        return e.path;
    });

    if (longest_length < 0) {
        return '';
    }

    const parts = longest_path.split('/');
    let parts_length = parts.length;
    let to_compare: string;
    let all_matching = false;

    do {
        to_compare = parts.slice(0, parts_length).join('/');
        all_matching = path_array.every(path => path.startsWith(to_compare));
    }
    while (!all_matching && parts_length-- >  1);
    // console.log({
    //     parts_length,
    //     to_compare,
    //     path_array,
    //     all_matching,
    // });

    return all_matching ? to_compare : '';
}
