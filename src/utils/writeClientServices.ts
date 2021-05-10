import { resolve } from 'path';

import type { Service } from '../client/interfaces/Service';
import { HttpClient } from '../HttpClient';
import { writeFile } from './fileSystem';
import { format } from './format';
import { Templates } from './registerHandlebarTemplates';

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

export async function writeBackendControllers (services: Service[], templates: Templates, outputPath: string, httpClient: HttpClient, useUnionTypes: boolean, useOptions: boolean): Promise<void> {

    if (templates.exports.controllers === undefined) {
        throw new Error('Controller template is not defined!');
    }

    for (const service of services) {
        const file_name_parts = service.name.split('Service',);
        const fist_part = file_name_parts.slice(0, file_name_parts.length - 1).join('Service');
        const controller_name = `${fist_part}Controller`;
        const file = resolve(outputPath, `${controller_name}.ts`);
        const useVersion = service.operations.some(operation => operation.path.includes(VERSION_TEMPLATE_STRING));

        //@ts-ignore
        // console.log('AS, ', service.operations.parameters);

        //@ts-ignore
        // service.operations.forEach((e) => console.log(e.parameters));

        const templateResult = templates.exports.controllers({
            name: controller_name,
            imports: service.imports,
            operations: service.operations,
            httpClient,
            useUnionTypes,
            useVersion,
            useOptions,
        });
        await writeFile(file, format(templateResult));
    }
}
