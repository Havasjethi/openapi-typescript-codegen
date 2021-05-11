import { resolve } from 'path';

import type { Service } from '../client/interfaces/Service';
import { HttpClient } from '../HttpClient';
import { writeFile } from './fileSystem';
import { format } from './format';
import { Templates } from './registerHandlebarTemplates';
import { Controller } from "../client/interfaces/Client";

const VERSION_TEMPLATE_STRING = 'OpenAPI.VERSION';

/**
 * Generate Services using the Handlebar template and write to disk.
 * @param services Array of Services to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param httpClient The selected httpClient (fetch, xhr or node)
 * @param useUnionTypes Use union types instead of enums
 * @param useOptions Use options or arguments functions
 */
export async function writeClientServices(services: Service[], templates: Templates, outputPath: string, httpClient: HttpClient, useUnionTypes: boolean, useOptions: boolean): Promise<void> {
    for (const service of services) {
        const file = resolve(outputPath, `${service.name}.ts`);
        const useVersion = service.operations.some(operation => operation.path.includes(VERSION_TEMPLATE_STRING));

        const templateResult = templates.exports.service({
            ...service,
            httpClient,
            useUnionTypes,
            useVersion,
            useOptions,
        });
        await writeFile(file, format(templateResult));
    }
}

export async function writeBackendControllers (controllers: Controller[], templates: Templates, outputPath: string, httpClient: HttpClient, useUnionTypes: boolean, useOptions: boolean): Promise<void> {

    if (templates.exports.controllers === undefined) {
        throw new Error('Controller template is not defined!');
    }

    for (const controller of controllers) {
        const file = resolve(outputPath, `${controller.name}.ts`);
        const useVersion = controller.operations.some(operation => operation.path.includes(VERSION_TEMPLATE_STRING));

        const templateResult = templates.exports.controllers({
            ...controller,
            httpClient,
            useUnionTypes,
            useVersion,
            useOptions,
        });
        await writeFile(file, format(templateResult));
    }
}
