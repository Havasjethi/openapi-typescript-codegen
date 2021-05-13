import { resolve } from 'path';

import type { Client } from '../client/interfaces/Client';
import { HttpClient } from '../HttpClient';
import { mkdir, rmdir } from './fileSystem';
import { isSubDirectory } from './isSubdirectory';
import { Templates } from './registerHandlebarTemplates';
import { writeClientCore } from './writeClientCore';
import { writeClientIndex } from './writeClientIndex';
import { writeClientModels } from './writeClientModels';
import { writeClientSchemas } from './writeClientSchemas';
import { writeClientServices } from './writeClientServices';
import { ExportOptions } from "../types/default";
import { writeBackendControllers } from "./writeBackendControllers";

/**
 * Write our OpenAPI client, using the given templates at the given output
 * @param client Client object with all the models, services, etc.
 * @param templates Templates wrapper with all loaded Handlebars templates
 * @param output The relative location of the output directory
 * @param httpClient The selected httpClient (fetch, xhr or node)
 * @param useOptions Use options or arguments functions
 * @param useUnionTypes Use union types instead of enums
 * @param exportOptions
 * @param request: Path to custom request file
 */
export async function writeClient(
    client: Client,
    templates: Templates,
    output: string,
    httpClient: HttpClient,
    useOptions: boolean,
    useUnionTypes: boolean,
    exportOptions: ExportOptions,
    request?: string
): Promise<void> {
    // Todo :: Configurable folder names
    const outputPath = resolve(process.cwd(), output);
    const outputPathCore = resolve(outputPath, 'core');
    const outputPathModels = resolve(outputPath, 'models');
    const outputPathSchemas = resolve(outputPath, 'schemas');
    const outputPathServices = resolve(outputPath, 'services');
    const output_path_controllers = resolve(outputPath, 'controllers');

    const promises: Promise<any>[] = [];

    if (!isSubDirectory(process.cwd(), output)) {
        throw new Error(`Output folder is not a subdirectory of the current working directory`);
    }

    if (exportOptions.exportCore) {
        await rmdir(outputPathCore);
        await mkdir(outputPathCore);
        const promise = writeClientCore(client, templates, outputPathCore, httpClient, request);
        promises.push(promise);
    }

    if (exportOptions.exportServices) {
        await rmdir(outputPathServices);
        await mkdir(outputPathServices);
        const promise = writeClientServices(client.services, templates, outputPathServices, httpClient, useUnionTypes, useOptions);
        promises.push(promise);
    }

    if (exportOptions.exportControllers && client.controllers) {
        await rmdir(output_path_controllers);
        await mkdir(output_path_controllers);
        const promise = writeBackendControllers(client.controllers, templates, output_path_controllers, httpClient, useUnionTypes, useOptions);
        promises.push(promise);
    }

    if (exportOptions.exportSchemas) {
        await rmdir(outputPathSchemas);
        await mkdir(outputPathSchemas);
        const promise = writeClientSchemas(client.models, templates, outputPathSchemas, httpClient, useUnionTypes);
        promises.push(promise);
    }

    if (exportOptions.exportModels) {
        await rmdir(outputPathModels);
        await mkdir(outputPathModels);
        const promise = writeClientModels(client.models, templates, outputPathModels, httpClient, useUnionTypes);
        promises.push(promise);
    }

    if ( exportOptions.exportCore || exportOptions.exportServices
         || exportOptions.exportSchemas || exportOptions.exportModels) {
        await mkdir(outputPath);
        const promise = writeClientIndex(client, templates, outputPath, useUnionTypes, exportOptions);
        promises.push(promise);
    }

    await Promise.all(promises);
}
