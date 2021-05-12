import type { Model } from '../client/interfaces/Model';
import { HttpClient } from '../HttpClient';
import { writeFile } from './fileSystem';
import { writeClientSchemas } from './writeClientSchemas';
import { test_templates } from "./common_test_files";

jest.mock('./fileSystem');

describe('writeClientSchemas', () => {
    it('should write to filesystem', async () => {
        const models: Model[] = [
            {
                export: 'interface',
                name: 'MyModel',
                type: 'MyModel',
                base: 'MyModel',
                template: null,
                link: null,
                description: null,
                isDefinition: true,
                isReadOnly: false,
                isRequired: false,
                isNullable: false,
                imports: [],
                enum: [],
                enums: [],
                properties: [],
            },
        ];

        await writeClientSchemas(models, test_templates, '/', HttpClient.FETCH, false);

        expect(writeFile).toBeCalledWith('/$MyModel.ts', 'schema');
    });
});
