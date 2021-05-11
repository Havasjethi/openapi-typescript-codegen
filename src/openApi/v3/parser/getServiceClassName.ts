import camelCase from 'camelcase';

/**
 * Convert the input value to a correct service classname. This converts
 * the input string to PascalCase and appends the "Service" prefix if needed.
 */
export function getServiceClassName(value: string): string {
    return getClassName(value, 'Service');
}

export function getControllerClassName(value: string): string {
    return getClassName(value, 'Controller')
}

export function getClassName (value: string, class_suffix: string) {
    const clean = value
        .replace(/^[^a-zA-Z]+/g, '')
        .replace(/[^\w\-]+/g, '-')
        .trim();
    const name = camelCase(clean, { pascalCase: true });

    if (name && !name.endsWith(class_suffix)) {
        return `${name}${class_suffix}`;
    }

    return name;
}
