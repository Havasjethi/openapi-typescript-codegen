import type { Service } from '../client/interfaces/Service';
import { sort } from './sort';
import { unique } from './unique';

/**
 * Set unique imports, sorted by name
 * @param service
 */
export function postProcessServiceImports(service: Service): string[] {
    return service.imports
        .filter(unique)
        .sort(sort)
        .filter(name => service.name !== name);
}

export function postProcessImports(imports: string[]): string[] {
    return imports
        .filter(unique)
        .sort(sort)
}
