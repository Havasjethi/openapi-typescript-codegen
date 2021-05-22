import { Command } from "commander";
import { generateDefaultConfig } from "./FromSpec/generateDefaultConfig";
import { getOpenApi } from "../index";
import { readFileSync } from "fs";

const file_name = 'oas-config';
export const default_config_path = `./${file_name}.json`;

interface FromSpecParameters {
    path: string;
    generate: boolean;
}

export interface StructuredOptions {
    input: string;
    output: string;
    httpClient;
    options: {
        useOptions?: boolean;
        useUnionTypes?: boolean;
    }
    export_options: {
        exportCore?: boolean;
        exportControllers?: boolean;
        exportServices?: boolean;
        exportModels?: boolean;
        exportSchemas?: boolean;
    };
}


export const FromSpec = new Command()
    .name('FromSpec')
    .usage('[spec-options]')
    .option('-p, --path <value>', 'Path of configuration file', default_config_path)
    .option(`--generate`, 'Generate default configuration file', false)
    .action(async ({path, generate}: FromSpecParameters) => {
        if (generate) {
            await generateDefaultConfig(path);
        } else {
            const api = getOpenApi();
            const options = getScanOptions(path);
            api.scan(options);
        }
    });


function getScanOptions(config_path: string): ScanOptions {
    const file = readFileSync(config_path, {encoding: "utf8"});
    const parsed: StructuredOptions = JSON.parse(file);

    return {
        folders: {
            base_folder: parsed.output,
            controller_folder: 'controllers',
        }
    };
}

export interface ScanOptions {
    folders: {
        base_folder: string,
            controller_folder: string,
    }
}
