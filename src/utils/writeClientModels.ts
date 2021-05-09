import { resolve } from 'path';

import type { Model } from '../client/interfaces/Model';
import { HttpClient } from '../HttpClient';
import { writeFile } from './fileSystem';
import { format } from './format';
import { Templates } from './registerHandlebarTemplates';

/**
 * Generate Models using the Handlebar template and write to disk.
 * @param models Array of Models to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param httpClient The selected httpClient (fetch, xhr or node)
 * @param useUnionTypes Use union types instead of enums
 */
export async function writeClientModels(models: Model[], templates: Templates, outputPath: string, httpClient: HttpClient, useUnionTypes: boolean): Promise<void> {
    const promises: Promise<any>[] = [];

    for (const model of models) {
        const file = resolve(outputPath, `${model.name}.ts`);
        const templateResult = templates.exports.model({
            ...model,
            httpClient,
            useUnionTypes,
        });

        const fileWrite = writeFile(file, format(templateResult));
        promises.push(fileWrite);
    }

    await Promise.all(promises);
}
