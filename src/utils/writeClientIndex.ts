import { resolve } from 'path';

import type { Client } from '../client/interfaces/Client';
import { writeFile } from './fileSystem';
import { Templates } from './registerHandlebarTemplates';
import { sortModelsByName } from './sortModelsByName';
import { sortServicesByName } from './sortServicesByName';
import { ExportOptions } from "../types/default";

/**
 * Generate the OpenAPI client index file using the Handlebar template and write it to disk.
 * The index file just contains all the exports you need to use the client as a standalone
 * library. But yuo can also import individual models and services directly.
 * @param client Client object, containing, models, schemas and services
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param useUnionTypes Use union types instead of enums
 * @param exportOptions
 */
export async function writeClientIndex(
    client: Client,
    templates: Templates,
    outputPath: string,
    useUnionTypes: boolean,
    exportOptions: ExportOptions,
): Promise<void> {
    const output_path = resolve(outputPath, 'index.ts');
    const context = {
        exportCore: exportOptions.exportCore,
        exportServices: exportOptions.exportServices,
        exportModels: exportOptions.exportModels,
        exportSchemas: exportOptions.exportSchemas,
        useUnionTypes,
        server: client.server,
        version: client.version,
        models: sortModelsByName(client.models),
        services: sortServicesByName(client.services),
    };

    const index_content = exportOptions.exportControllers
        ? templates.backend_index(context)
        : templates.index(context);

    await writeFile(output_path, index_content);
}
