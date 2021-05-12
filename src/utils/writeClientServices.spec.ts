import type { Service } from '../client/interfaces/Service';
import { HttpClient } from '../HttpClient';
import { writeFile } from './fileSystem';
import { writeClientServices } from './writeClientServices';
import { test_templates } from "./common_test_files";

jest.mock('./fileSystem');

describe('writeClientServices', () => {
    it('should write to filesystem', async () => {
        const services: Service[] = [
            {
                name: 'MyService',
                operations: [],
                imports: [],
            },
        ];

        await writeClientServices(services, test_templates, '/', HttpClient.FETCH, false, false);

        expect(writeFile).toBeCalledWith('/MyService.ts', 'service');
    });
});
