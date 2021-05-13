import * as Handlebars from 'handlebars/runtime';

import { HttpClient } from '../HttpClient';
import templateCoreApiError from '../templates/core/ApiError.hbs';
import templateCoreApiRequestOptions from '../templates/core/ApiRequestOptions.hbs';
import templateCoreApiResult from '../templates/core/ApiResult.hbs';
import templateCoreSettings from '../templates/core/OpenAPI.hbs';
import templateCoreRequest from '../templates/core/request.hbs';
import templateExportController from '../templates/exportController.hbs';
import templateExportModel from '../templates/exportModel.hbs';
import templateExportSchema from '../templates/exportSchema.hbs';
import templateExportService from '../templates/exportService.hbs';
import templateIndex from '../templates/index.hbs';
import backendIndex from '../templates/backendIndex.hbs';

// import controllerImports from '../templates/controller_partials/imports.hbs';
import controller_method from '../templates/controller_partials/method.hbs';
import controller_method_comment from '../templates/controller_partials/method_comment.hbs';
import { registerHandlebarHelpers } from './registerHandlebarHelpers';

import { register_partials, register_generic_functions, register_fetch_files, register_xmr_files, register_node_client } from "./template_register_methods";
import { registerCaseGeneration, registerMyHelpers } from "./template_register_methods/registerMyHelpers";
import { ExportOptions } from "../types/default";

export interface Templates {
    index: Handlebars.TemplateDelegate;
    backend_index: Handlebars.TemplateDelegate;
    exports: {
        model: Handlebars.TemplateDelegate;
        schema: Handlebars.TemplateDelegate;
        service: Handlebars.TemplateDelegate;
        controllers?: Handlebars.TemplateDelegate;
    };
    core: {
        settings: Handlebars.TemplateDelegate;
        apiError: Handlebars.TemplateDelegate;
        apiRequestOptions: Handlebars.TemplateDelegate;
        apiResult: Handlebars.TemplateDelegate;
        request: Handlebars.TemplateDelegate;
    };
}

/**
 * Read all the Handlebar templates that we need and return on wrapper object
 * so we can easily access the templates in out generator / write functions.
 */
export function registerHandlebarTemplates(root: { httpClient: HttpClient; useOptions: boolean; useUnionTypes: boolean, exportOptions: ExportOptions }): Templates {
    registerHandlebarHelpers(root);
    registerMyHelpers();
    registerCaseGeneration();

    // Main templates (entry points for the files we write to disk)
    const templates: Templates = {
        index: Handlebars.template(templateIndex),
        backend_index: Handlebars.template(backendIndex),
        exports: {
            model: Handlebars.template(templateExportModel),
            schema: Handlebars.template(templateExportSchema),
            service: Handlebars.template(templateExportService),
            controllers: Handlebars.template(templateExportController),
        },
        core: {
            settings: Handlebars.template(templateCoreSettings),
            apiError: Handlebars.template(templateCoreApiError),
            apiRequestOptions: Handlebars.template(templateCoreApiRequestOptions),
            apiResult: Handlebars.template(templateCoreApiResult),
            request: Handlebars.template(templateCoreRequest),
        },
    };

    // Registering partial classes for generation
    register_controller_partials();
    register_partials();
    register_generic_functions();

    // Registering Method specific stuff
    register_fetch_files();
    register_xmr_files();
    register_node_client();

    return templates;
}

function register_controller_partials () {
    // Handlebars.registerPartial('controller_imports', Handlebars.template(controllerImports));
    Handlebars.registerPartial('controller_method', Handlebars.template(controller_method));
    Handlebars.registerPartial('controller_method_comment', Handlebars.template(controller_method_comment));
}
