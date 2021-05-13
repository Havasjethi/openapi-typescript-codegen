import { Controller } from "../client/interfaces/Client";
import { Templates } from "./registerHandlebarTemplates";
import { HttpClient } from "../HttpClient";
import { resolve } from "path";
import { writeFile } from "./fileSystem";
import { format } from "./format";
import { VERSION_TEMPLATE_STRING } from "./writeClientServices";

export async function writeBackendControllers (controllers: Controller[], templates: Templates, outputPath: string, httpClient: HttpClient, useUnionTypes: boolean, useOptions: boolean): Promise<void> {

    if (templates.exports.controllers === undefined) {
        throw new Error('Controller template is not defined!');
    }

    for (const controller of controllers) {
        const file = resolve(outputPath, `${controller.name}.ts`);
        const useVersion = controller.operations.some(operation => operation.path.includes(VERSION_TEMPLATE_STRING));

        const templateResult = templates.exports.controllers({
            ...controller,
            httpClient,
            useUnionTypes,
            useVersion,
            useOptions,
        });

        await writeFile(file, format(templateResult));
    }
}
