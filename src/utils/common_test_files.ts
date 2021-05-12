import { Templates } from "./registerHandlebarTemplates";

export const test_templates: Templates = {
    index: () => 'index',
    // TODO :: How to use this??
    backend_index: () => 'backend_index',
    exports: {
        model: () => 'model',
        schema: () => 'schema',
        service: () => 'service',
    },
    core: {
        settings: () => 'settings',
        apiError: () => 'apiError',
        apiRequestOptions: () => 'apiRequestOptions',
        apiResult: () => 'apiResult',
        request: () => 'request',
    },
};
