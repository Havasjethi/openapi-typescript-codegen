import { writeFileSync } from "fs";
import { StructuredOptions } from "../from_spec";

/**
 * Copy of the src/HttpClient.ts file
 */
export enum HttpClient {
    FETCH = 'fetch',
    XHR = 'xhr',
    NODE = 'node',
}

export const generateDefaultConfig = async (path) => {
    console.log('Generating default files to: ', path);
    const default_config = getDefaultConfig();
    const raw_string = JSON.stringify(default_config, undefined, 2);
    writeFileSync(path, raw_string, {encoding: "utf8"});
}

function getDefaultConfig (): StructuredOptions {
    return {
        input: './api-specification',
        output: './generated',
        httpClient: HttpClient.FETCH,
        options: {
            useOptions: false,
            useUnionTypes: false,
        },
        export_options: {
            exportCore: true,
            exportServices: true,
            exportModels: true,
            exportSchemas: false,
        },
        // write: false,
        // request: false,
    };
}
