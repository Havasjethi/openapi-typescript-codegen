import { writeFile } from "../../../src/utils/fileSystem";
import { HttpClient } from "../../../src/HttpClient";
import { StructuredOptions } from "../from_spec";

export const generateDefaultConfig = async (path) => {
    console.log('Generating default files to: ', path);
    const default_config = getDefaultConfig();
    const raw_string = JSON.stringify(default_config, undefined, 2);
    await writeFile(path, raw_string);
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
