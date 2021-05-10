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

import controllerImports from '../templates/controller_partials/imports.hbs';
import controller_method from '../templates/controller_partials/method.hbs';
import controller_method_comment from '../templates/controller_partials/method_comment.hbs';
import { registerHandlebarHelpers } from './registerHandlebarHelpers';

import { Operation } from "../client/interfaces/Operation";
import { register_partials, register_generic_functions, register_fetch_files, register_xmr_files, register_node_client } from "./template_register_methods";

export interface Templates {
    index: Handlebars.TemplateDelegate;
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
export function registerHandlebarTemplates(root: { httpClient: HttpClient; useOptions: boolean; useUnionTypes: boolean }): Templates {
    registerHandlebarHelpers(root);
    registerMyHelpers();

    // Main templates (entry points for the files we write to disk)
    const templates: Templates = {
        index: Handlebars.template(templateIndex),
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

function registerMyHelpers() {
    Handlebars.registerHelper('MethodInput', function (obj: Operation['parameters'][0]): string  {
        let decorator_name = '';
        let property = '';

        switch (obj.in) {
            case 'path':
                decorator_name = 'PathVariable';
                property = obj.prop;
                break;


            case 'query':
                decorator_name = 'Query';
                property = obj.name;
                break;

            case 'header':
                decorator_name = 'Header';
                break;

            case 'formData':
            case 'body':
                decorator_name = 'Body';
                property = obj.prop;
                break;

            case "cookie":
                decorator_name = 'Body';
                property = obj.prop;
                break;

            default:
                console.log('Whatta', obj.in);
        }


        // console.log('Got this badbody: ', obj);
        return `@${decorator_name}('${property}') ${obj.name}: ${obj.type}`;
    });
    Handlebars.registerHelper('Capital', function (x: string, fn)  {
        const head = x.charAt(0).toUpperCase();
        const tail = x.slice(1).toLowerCase();

        return head + tail;
    });

    Handlebars.registerHelper('Lower', function (c: any, x: any) {
        return x.toLowerCase();
    });

    Handlebars.registerHelper('Upper', function (c: any, x: any) {
        return x.toUpperCase();
    });

}

function registerCaseGeneration () {
    const case_types = ['snake_case', 'kabob-case', 'PascalCase', 'camelCase', 'UPPER_CAMEL'];
    const main_types = ['Class', 'Method', 'MethodVariable', 'Variable', 'Enums', 'EnumVariable']
}

function register_controller_partials () {
    Handlebars.registerPartial('controller_imports', Handlebars.template(controllerImports));
    Handlebars.registerPartial('controller_method', Handlebars.template(controller_method));
    Handlebars.registerPartial('controller_method_comment', Handlebars.template(controller_method_comment));
}
