import { Command } from "commander";
import { generateDefaultConfig } from "./FromSpec/generateDefaultConfig";

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
            analyzeControllers();
        }
    });


function analyzeControllers() {

}
