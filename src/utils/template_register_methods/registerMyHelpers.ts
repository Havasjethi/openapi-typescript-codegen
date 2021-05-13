import Handlebars from "handlebars/runtime";
import { Operation } from "../../client/interfaces/Operation";
import { ImportBuilder } from "../ImportBuilder";

export function registerMyHelpers() {
    Handlebars.registerHelper('MethodInput', function (obj: Operation['parameters'][0]): string  {
        let decorator_name = '';
        let property = '';

        switch (obj.in) {
            case 'path':
                decorator_name = 'PathVariable';
                property = obj.prop;
                break;

            case 'query':
                decorator_name = 'Query';
                property = obj.name;
                break;

            case 'header':
                decorator_name = 'Header';
                break;

            case 'formData':
            case 'body':
                decorator_name = 'Body';
                property = obj.prop;
                break;

            case "cookie":
                decorator_name = 'Body';
                property = obj.prop;
                break;

            default:
                console.log('Whatta', obj.in);
        }

        return `@${decorator_name}('${property}') ${obj.name}: ${obj.type}`;
    });
    Handlebars.registerHelper('Capital', function (x: string, fn)  {
        const head = x.charAt(0).toUpperCase();
        const tail = x.slice(1).toLowerCase();

        return head + tail;
    });

    Handlebars.registerHelper('Lower', function (c: any, x: any) {
        return x.toLowerCase();
    });

    Handlebars.registerHelper('Upper', function (c: any, x: any) {
        return x.toUpperCase();
    });

    Handlebars.registerHelper('import_printer', function (object: ImportBuilder['imports'][0]) {
        // console.log('X', object);

        return `import { ${object.name} ${object.alias ? `as ${object.alias}` : '' } } from '${object.file_path}';`;
    });

}



enum Typings {
    snake_case,
    camelCase,
    PascalCase,
    UPPER_CAMEL,
    Some_Weird,
    cabob,
}

export function registerCaseGeneration () {
    const case_types = ['snake_case', 'kabob-case', 'PascalCase', 'camelCase', 'UPPER_CAMEL'];
    const main_types = ['Class', 'Method', 'MethodVariable', 'Variable', 'Enums', 'EnumVariable'];

    const classTyping = Typings.PascalCase;
    const active_values = {
        variable: Typings.camelCase,
        className: classTyping,
        fileNames: classTyping, // Make live easier if same as className
    }

    Handlebars.registerHelper('variableName', (variable: string) => {
        return formatNameDyn(variable, active_values.variable);
    });

    Handlebars.registerHelper('className', (variable: string) => {
        return variable;
    });
}

function formatNameDyn (string_like: string, typing: Typings) {
    let formatted: string = '';

    switch (typing) {
        case Typings.snake_case:
        case Typings.camelCase:
        default:
            formatted = `__${string_like}`;
    }

    return formatted;
}
