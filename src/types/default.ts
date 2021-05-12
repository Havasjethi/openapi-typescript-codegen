import { HttpClient } from "../HttpClient";

export type GenerationOptions = {
    input: string | Record<string, any>;
    output: string;
    httpClient?: HttpClient;
    useOptions?: boolean;
    useUnionTypes?: boolean;
    export_options?: ExportOptionsMight;
    request?: string;
    write?: boolean;
};

export interface ExportOptions {
    exportCore: boolean;
    exportServices: boolean;
    exportModels: boolean;
    exportSchemas: boolean;
    exportControllers: boolean;
}

export interface ExportOptionsMight {
    exportCore?: boolean;
    exportServices?: boolean;
    exportModels?: boolean;
    exportSchemas?: boolean;
    exportControllers?: boolean;
}


