import type { OperationParameter } from './OperationParameter';

/**
 * parametersBody is Not used in V3
 * @see {requestBody}
 * @see {OpenApiRequestBody}
 */
export interface OperationParameters {
    imports: string[];
    parameters: OperationParameter[];
    parametersPath: OperationParameter[];
    parametersQuery: OperationParameter[];
    parametersForm: OperationParameter[];
    parametersCookie: OperationParameter[];
    parametersHeader: OperationParameter[];
    parametersBody: OperationParameter | null;
}
