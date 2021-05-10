import Handlebars from "handlebars/runtime";
import functionCatchErrors from "../../templates/core/functions/catchErrors.hbs";
import functionGetFormData from "../../templates/core/functions/getFormData.hbs";
import functionGetQueryString from "../../templates/core/functions/getQueryString.hbs";
import functionGetUrl from "../../templates/core/functions/getUrl.hbs";
import functionIsBinary from "../../templates/core/functions/isBinary.hbs";
import functionIsBlob from "../../templates/core/functions/isBlob.hbs";
import functionIsDefined from "../../templates/core/functions/isDefined.hbs";
import functionIsString from "../../templates/core/functions/isString.hbs";
import functionIsStringWithValue from "../../templates/core/functions/isStringWithValue.hbs";
import functionIsSuccess from "../../templates/core/functions/isSuccess.hbs";
import functionResolve from "../../templates/core/functions/resolve.hbs";

/**
 * Generic functions used in 'request' file @see src/templates/core/request.hbs for more info
 */
export function register_generic_functions () {
    Handlebars.registerPartial('functions/catchErrors', Handlebars.template(functionCatchErrors));
    Handlebars.registerPartial('functions/getFormData', Handlebars.template(functionGetFormData));
    Handlebars.registerPartial('functions/getQueryString', Handlebars.template(functionGetQueryString));
    Handlebars.registerPartial('functions/getUrl', Handlebars.template(functionGetUrl));
    Handlebars.registerPartial('functions/isBinary', Handlebars.template(functionIsBinary));
    Handlebars.registerPartial('functions/isBlob', Handlebars.template(functionIsBlob));
    Handlebars.registerPartial('functions/isDefined', Handlebars.template(functionIsDefined));
    Handlebars.registerPartial('functions/isString', Handlebars.template(functionIsString));
    Handlebars.registerPartial('functions/isStringWithValue', Handlebars.template(functionIsStringWithValue));
    Handlebars.registerPartial('functions/isSuccess', Handlebars.template(functionIsSuccess));
    Handlebars.registerPartial('functions/resolve', Handlebars.template(functionResolve));
}
