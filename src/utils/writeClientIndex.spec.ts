import type { Client } from '../client/interfaces/Client';
import { writeFile } from './fileSystem';
import { writeClientIndex } from './writeClientIndex';
import { test_templates } from "./common_test_files";

jest.mock('./fileSystem');

describe('writeClientIndex', () => {
    it('should write to filesystem', async () => {
        const client: Client = {
            server: 'http://localhost:8080',
            version: '1.0',
            models: [],
            services: [],
        };

        await writeClientIndex(client, test_templates, '/', true, {
            exportCore: true,
            exportServices: true,
            exportModels: true,
            exportSchemas: true,
            exportControllers: false,
        });

        expect(writeFile).toBeCalledWith('/index.ts', 'index');
    });
});
