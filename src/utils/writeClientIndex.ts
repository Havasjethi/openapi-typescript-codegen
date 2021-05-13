import { resolve } from 'path';

import type { Client } from '../client/interfaces/Client';
import { writeFile } from './fileSystem';
import { Templates } from './registerHandlebarTemplates';
import { sortModelsByName } from './sortModelsByName';
import { sortServicesByName } from './sortServicesByName';
import { ExportOptions } from "../types/default";
import { ImportBuilder } from "./ImportBuilder";

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
    const import_builder = ImportBuilder.create();
    const context: any = {
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

    let output_path: string;
    let file_content: string;

    if (exportOptions.exportCore) {
        client.models.forEach(e => import_builder.add_import(e.name, `./models/${e.name}`, 'Model'));
    }
    if (exportOptions.exportCore) {
        client.services.forEach(e => import_builder.add_import(e.name, `./services/${e.name}`, 'Service'));
    }
    if (exportOptions.exportCore && client.controllers) {
        const controller_names = client.controllers.map(e => import_builder.add_import(e.name, `./controllers/${e.name}`, 'Controllers'));
        context.controller_names = controller_names;
    }

    if (exportOptions.exportControllers) {
        output_path = resolve(outputPath, 'backend_index.ts');

        const imports = import_builder
            .get_imports()
            .sort((a: any, b: any) => a.file_path.toLowerCase().localeCompare(b.file_path.toLowerCase(), 'en'));

        context['imports'] = imports;

        file_content = templates.backend_index(context);
    } else {
        output_path = resolve(outputPath, 'index.ts');
        file_content = templates.index(context);
    }

    await writeFile(output_path, file_content);
}
