import type { Client } from '../client/interfaces/Client';
import { HttpClient } from '../HttpClient';
import { writeFile } from './fileSystem';
import { writeClientCore } from './writeClientCore';
import { test_templates } from "./common_test_files";

jest.mock('./fileSystem');

describe('writeClientCore', () => {
    it('should write to filesystem', async () => {
        const client: Client = {
            server: 'http://localhost:8080',
            version: '1.0',
            models: [],
            services: [],
        };

        await writeClientCore(client, test_templates, '/', HttpClient.FETCH);

        expect(writeFile).toBeCalledWith('/OpenAPI.ts', 'settings');
        expect(writeFile).toBeCalledWith('/ApiError.ts', 'apiError');
        expect(writeFile).toBeCalledWith('/ApiRequestOptions.ts', 'apiRequestOptions');
        expect(writeFile).toBeCalledWith('/ApiResult.ts', 'apiResult');
        expect(writeFile).toBeCalledWith('/request.ts', 'request');
    });
});
