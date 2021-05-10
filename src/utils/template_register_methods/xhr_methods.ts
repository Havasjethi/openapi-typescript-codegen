import Handlebars from "handlebars/runtime";
import xhrGetHeaders from "../../templates/core/xhr/getHeaders.hbs";
import xhrGetRequestBody from "../../templates/core/xhr/getRequestBody.hbs";
import xhrGetResponseBody from "../../templates/core/xhr/getResponseBody.hbs";
import xhrGetResponseHeader from "../../templates/core/xhr/getResponseHeader.hbs";
import xhrSendRequest from "../../templates/core/xhr/sendRequest.hbs";
import xhrRequest from "../../templates/core/xhr/request.hbs";

/**
 *  Specific files for the xhr client implementation
 */
export function register_xmr_files () {
    Handlebars.registerPartial('xhr/getHeaders', Handlebars.template(xhrGetHeaders));
    Handlebars.registerPartial('xhr/getRequestBody', Handlebars.template(xhrGetRequestBody));
    Handlebars.registerPartial('xhr/getResponseBody', Handlebars.template(xhrGetResponseBody));
    Handlebars.registerPartial('xhr/getResponseHeader', Handlebars.template(xhrGetResponseHeader));
    Handlebars.registerPartial('xhr/sendRequest', Handlebars.template(xhrSendRequest));
    Handlebars.registerPartial('xhr/request', Handlebars.template(xhrRequest));
}
