import type { OpenApi } from '../interfaces/OpenApi';
import type { OpenApiReference } from '../interfaces/OpenApiReference';

export function getRef<T extends OpenApiReference>(openApi: OpenApi, item: T): T {
    if (item.$ref) {
        // Fetch the paths to the definitions, this converts:
        // "#/components/schemas/Form" to ["components", "schemas", "Form"]
        const paths = item.$ref
            .replace(/^#/g, '')
            .split('/')
            .filter(item => item);

        // Try to find the reference by walking down the path,
        // if we cannot find it, then we throw an error.
        let result: any = openApi;
        paths.forEach((path: string): void => {
            if (result.hasOwnProperty(path)) {
                result = result[path];
            } else {
                throw new Error(`Could not find reference: "${item.$ref}"`);
            }
        });
        return result as T;
    }
    return item as T;
}
