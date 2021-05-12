import { HttpClient } from './HttpClient';
import { parse as parseV2 } from './openApi/v2';
import { parse as parseV3 } from './openApi/v3';
import { getOpenApiSpec } from './utils/getOpenApiSpec';
import { getOpenApiVersion, OpenApiVersion } from './utils/getOpenApiVersion';
import { isString } from './utils/isString';
import { postProcessClient } from './utils/postProcessClient';
import { registerHandlebarTemplates } from './utils/registerHandlebarTemplates';
import { writeClient } from './utils/writeClient';
import { Client } from "./client/interfaces/Client";
import { OpenApi as OpenApiV3 } from "./openApi/v3/interfaces/OpenApi";
import { OpenApi as OpenApiV2 } from "./openApi/v2/interfaces/OpenApi";
import { ExportOptions, ExportOptionsMight, GenerationOptions } from "./types/default";

export { HttpClient } from './HttpClient';

/**
 * Generate the OpenAPI client. This method will read the OpenAPI specification and based on the
 * given language it will generate the client, including the typed models, validation schemas,
 * service layer, etc.
 * @param input The relative location of the OpenAPI spec
 * @param output The relative location of the output directory
 * @param httpClient The selected httpClient (fetch or XHR)
 * @param useOptions Use options or arguments functions
 * @param useUnionTypes Use union types instead of enums
 * @param export_options
 * @param request: Path to custom request file
 * @param write Write the files to disk (true or false)
 */
export async function generate({
    input,
    output,
    httpClient = HttpClient.FETCH,
    useOptions = false,
    useUnionTypes = false,
    export_options = { },
    request,
    write = true,
}: GenerationOptions): Promise<void> {
    const openApi = isString(input) ? await getOpenApiSpec(input) : input;
    const openApiVersion = getOpenApiVersion(openApi);
    const templates = registerHandlebarTemplates({
        httpClient,
        useUnionTypes,
        useOptions,
    });

    const defined_export_options = fixOptions(export_options);

    const clientFinal = getClient(openApiVersion, openApi);
    if (write) {
        await writeClient(clientFinal, templates, output, httpClient, useOptions, useUnionTypes, defined_export_options, request);
    }
}

const fixOptions = (some: ExportOptionsMight): ExportOptions => {
    let a = {...some};

    if (a.exportCore === undefined) {
        a.exportCore = true;
    }
    if (a.exportServices === undefined) {
        a.exportServices = true;
    }
    if (a.exportModels === undefined) {
        a.exportModels = true;
    }
    if (a.exportSchemas === undefined) {
        a.exportSchemas = true;
    }
    if (a.exportControllers === undefined) {
        a.exportControllers = true;
    }

    //@ts-ignore
    return a;
}

function getClient (openApiVersion: OpenApiVersion, openApi: OpenApiV3 | OpenApiV2): Client {
    let parsed_client = null;

    switch (openApiVersion) {
        case OpenApiVersion.V2:
        case OpenApiVersion.V3:
            //@ts-ignore
            parsed_client = parseV3(openApi);
            break;

        default:
            throw new Error('Invalid API number');
    }

    return postProcessClient(parsed_client);
}
