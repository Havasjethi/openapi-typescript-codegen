import { Command } from "commander";
import { default_config_path, StructuredOptions } from "./from_spec";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { HttpClient } from "./FromSpec/generateDefaultConfig";

/**
 * Copy from src/types/default.src
 */
export type GenerationOptions = {
    input: string | Record<string, any>;
    output: string;
    httpClient?: HttpClient;
    useOptions?: boolean;
    useUnionTypes?: boolean;
    exportCore?: boolean;
    exportServices?: boolean;
    exportModels?: boolean;
    exportSchemas?: boolean;
    request?: string;
    write?: boolean;
};


const pkg = require('../../package.json');

export const generation = new Command()
    .name('generate_files')
    .usage('[options]')
    .version(pkg.version)
    .option('-i, --input <value>', 'OpenAPI specification, can be a path, url or string content (required)')
    .option('-o, --output <value>', 'Output directory (required)')
    .option('-f, --config [path]', 'Generate by config file (required)')
    .option('-c, --client <value>', 'HTTP client to generate [fetch, xhr, node]', 'fetch')
    .option('--useOptions', 'Use options instead of arguments')
    .option('--useUnionTypes', 'Use union types instead of enums')
    .option('--exportCore <value>', 'Write core files to disk', true)
    .option('--exportServices <value>', 'Write services to disk', true)
    .option('--exportModels <value>', 'Write models to disk', true)
    .option('--exportSchemas <value>', 'Write schemas to disk', false)
    .option('--request <value>', 'Path to custom request file')
    // .parse(process.argv)
    // .opts();
    .action(async (params) => {
        let generation_setting: GenerationOptions;
        if (params.config) {
            const x: StructuredOptions = await get_config(params.config === true ? default_config_path : params.config);
            generation_setting = {
                input: x.input,
                output: x.output,
                httpClient: x.httpClient,
                useOptions: x.options.useOptions,
                useUnionTypes: x.options.useUnionTypes,
                exportCore: x.export_options.exportCore,
                exportServices: x.export_options.exportServices,
                exportModels: x.export_options.exportModels,
                exportSchemas: x.export_options.exportSchemas,
            }
        } else if (params.input && params.output) {
            generation_setting = {
                input: params.input,
                output: params.output,
                httpClient: params.client,
                useOptions: params.useOptions,
                useUnionTypes: params.useUnionTypes,
                exportCore: JSON.parse(params.exportCore) === true,
                exportServices: JSON.parse(params.exportServices) === true,
                exportModels: JSON.parse(params.exportModels) === true,
                exportSchemas: JSON.parse(params.exportSchemas) === true,
                request: params.request,
            };
        } else {
            throw new Error('DEFINE PLS');
        }

        const OpenAPI = require(resolve(__dirname, '../../dist/index.js'));
        OpenAPI.generate(generation_setting)
            .then(() => {
                process.exit(0);
            })
            .catch(error => {
                console.error(error);
                process.exit(1);
            });

        // const OpenAPI = require(resolve(__dirname, '../dist/index.js'));
        //
        // if (OpenAPI) {
        //     OpenAPI.generate({
        //         input: params.input,
        //         output: params.output,
        //         httpClient: params.client,
        //         useOptions: params.useOptions,
        //         useUnionTypes: params.useUnionTypes,
        //         exportCore: JSON.parse(params.exportCore) === true,
        //         exportServices: JSON.parse(params.exportServices) === true,
        //         exportModels: JSON.parse(params.exportModels) === true,
        //         exportSchemas: JSON.parse(params.exportSchemas) === true,
        //         request: params.request,
        //     })
        //         .then(() => {
        //             process.exit(0);
        //         })
        //         .catch(error => {
        //             console.error(error);
        //             process.exit(1);
        //         });
        // }
    });


const get_config = async (spec_path: string): Promise<StructuredOptions> => {
    if (!existsSync(spec_path)) {
        throw new Error(`File not found @ ${spec_path}`);
    }

    return JSON.parse(
        readFileSync(spec_path, {encoding: "utf8"})
    );
};
