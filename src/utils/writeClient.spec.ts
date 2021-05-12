import type { Client } from '../client/interfaces/Client';
import { HttpClient } from '../HttpClient';
import { mkdir, rmdir, writeFile } from './fileSystem';
import { writeClient } from './writeClient';
import { test_templates } from "./common_test_files";

jest.mock('./fileSystem');

describe('writeClient', () => {
    it('should write to filesystem', async () => {
        const client: Client = {
            server: 'http://localhost:8080',
            version: 'v1',
            models: [],
            services: [],
        };

        await writeClient(client, test_templates, './dist', HttpClient.FETCH, false, false, {
            exportCore: true,
            exportServices: true,
            exportModels: true,
            exportSchemas: true,
            exportControllers: false
        });

        expect(rmdir).toBeCalled();
        expect(mkdir).toBeCalled();
        expect(writeFile).toBeCalled();
    });
});
