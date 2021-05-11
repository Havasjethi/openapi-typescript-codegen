import type { Operation } from '../../../client/interfaces/Operation';
import type { OperationParameters } from '../../../client/interfaces/OperationParameters';
import type { OpenApi } from '../interfaces/OpenApi';
import type { OpenApiOperation } from '../interfaces/OpenApiOperation';
import type { OpenApiRequestBody } from '../interfaces/OpenApiRequestBody';
import { getComment } from './getComment';
import { getOperationErrors } from './getOperationErrors';
import { getOperationName } from './getOperationName';
import { getOperationParameters } from './getOperationParameters';
import { getControllerOperationPath, getOperationPath } from './getOperationPath';
import { getOperationRequestBody } from './getOperationRequestBody';
import { getOperationResponseHeader } from './getOperationResponseHeader';
import { getOperationResponses } from './getOperationResponses';
import { getOperationResults } from './getOperationResults';
import { getRef } from './getRef';
import { getControllerClassName, getServiceClassName } from './getServiceClassName';
import { sortByRequired } from './sortByRequired';

export function getOperation(openApi: OpenApi, url: string, method: string, op: OpenApiOperation, pathParams: OperationParameters): Operation {
    const serviceName = op.tags?.[0] || 'Service';
    const serviceClassName = getServiceClassName(serviceName);
    const operationNameFallback = `${method}${serviceClassName}`;
    const operationName = getOperationName(op.operationId || operationNameFallback);
    const operationPath = getOperationPath(url);

    // Create a new operation object for this method.
    const operation: Operation = {
        className: serviceClassName,
        name: operationName,
        summary: getComment(op.summary),
        description: getComment(op.description),
        deprecated: op.deprecated === true,
        method: method.toUpperCase(),
        path: operationPath,
        parameters: [...pathParams.parameters],
        parametersPath: [...pathParams.parametersPath],
        parametersQuery: [...pathParams.parametersQuery],
        parametersForm: [...pathParams.parametersForm],
        parametersHeader: [...pathParams.parametersHeader],
        parametersCookie: [...pathParams.parametersCookie],
        parametersBody: pathParams.parametersBody,
        imports: [],
        errors: [],
        results: [],
        responseHeader: null,
    };

    // Parse the operation parameters (path, query, body, etc).
    if (op.parameters) {
        const parameters = getOperationParameters(openApi, op.parameters);
        operation.imports.push(...parameters.imports);
        operation.parameters.push(...parameters.parameters);
        operation.parametersPath.push(...parameters.parametersPath);
        operation.parametersQuery.push(...parameters.parametersQuery);
        operation.parametersForm.push(...parameters.parametersForm);
        operation.parametersHeader.push(...parameters.parametersHeader);
        operation.parametersCookie.push(...parameters.parametersCookie);
        operation.parametersBody = parameters.parametersBody;
    }

    // TODO: form data goes wrong here: https://github.com/ferdikoomen/openapi-typescript-codegen/issues/257§
    if (op.requestBody) {
        const requestBodyDef = getRef<OpenApiRequestBody>(openApi, op.requestBody);
        const requestBody = getOperationRequestBody(openApi, requestBodyDef);
        operation.imports.push(...requestBody.imports);
        operation.parameters.push(requestBody);
        operation.parameters = operation.parameters.sort(sortByRequired);
        operation.parametersBody = requestBody;
    }

    // Parse the operation responses.
    if (op.responses) {
        const operationResponses = getOperationResponses(openApi, op.responses);
        const operationResults = getOperationResults(operationResponses);
        operation.errors = getOperationErrors(operationResponses);
        operation.responseHeader = getOperationResponseHeader(operationResults);

        operationResults.forEach(operationResult => {
            operation.results.push(operationResult);
            operation.imports.push(...operationResult.imports);
        });
    }

    return operation;
}

/**
 * Todo :: Add parsing options --> camelCase, snake_case
 * @param openApi
 * @param url
 * @param method
 * @param op
 * @param pathParams
 */
export function getControllerOperation(openApi: OpenApi, url: string, method: string, op: OpenApiOperation, pathParams: OperationParameters): Operation {
    const controllerName = op.tags?.[0] || 'Controller';

    const className = getControllerClassName(controllerName);
    const operationNameFallback = `${method}${className}`;
    const operationName = getOperationName(op.operationId || operationNameFallback);
    const operationPath = getControllerOperationPath(url);

    // Create a new operation object for this method.
    const operation: Operation = {
        className: className,
        name: operationName,
        summary: getComment(op.summary),
        description: getComment(op.description),
        deprecated: op.deprecated === true,
        method: method.toUpperCase(),
        path: operationPath,
        parameters: [...pathParams.parameters],
        parametersPath: [...pathParams.parametersPath],
        parametersQuery: [...pathParams.parametersQuery],
        parametersForm: [...pathParams.parametersForm],
        parametersHeader: [...pathParams.parametersHeader],
        parametersCookie: [...pathParams.parametersCookie],
        parametersBody: pathParams.parametersBody,
        imports: [],
        errors: [],
        results: [],
        responseHeader: null,
    };


    // Parse the operation parameters (path, query, body, etc).
    if (op.parameters) {
        const parameters = getOperationParameters(openApi, op.parameters);
        operation.imports.push(...parameters.imports);
        operation.parameters.push(...parameters.parameters);
        operation.parametersPath.push(...parameters.parametersPath);
        operation.parametersQuery.push(...parameters.parametersQuery);
        operation.parametersForm.push(...parameters.parametersForm);
        operation.parametersHeader.push(...parameters.parametersHeader);
        operation.parametersCookie.push(...parameters.parametersCookie);
        operation.parametersBody = parameters.parametersBody;
    }

    // TODO: form data goes wrong here: https://github.com/ferdikoomen/openapi-typescript-codegen/issues/257§
    if (op.requestBody) {
        const requestBodyDef = getRef(openApi, op.requestBody);
        const requestBody = getOperationRequestBody(openApi, requestBodyDef);
        operation.imports.push(...requestBody.imports);
        operation.parameters.push(requestBody);
        operation.parameters = operation.parameters.sort(sortByRequired);
        operation.parametersBody = requestBody;
    }

    // Parse the operation responses.
    if (op.responses) {

        const operationResponses = getOperationResponses(openApi, op.responses);
        const operationResults = getOperationResults(operationResponses);
        // console.log('operationResponses  ', operationResponses);
        operation.errors = getOperationErrors(operationResponses);
        operation.responseHeader = getOperationResponseHeader(operationResults);

        operationResults.forEach(operationResult => {
            operation.results.push(operationResult);
            operation.imports.push(...operationResult.imports);
        });
    }

    return operation;
}
