import Handlebars from "handlebars/runtime";
import fetchGetHeaders from "../../templates/core/fetch/getHeaders.hbs";
import fetchGetRequestBody from "../../templates/core/fetch/getRequestBody.hbs";
import fetchGetResponseBody from "../../templates/core/fetch/getResponseBody.hbs";
import fetchGetResponseHeader from "../../templates/core/fetch/getResponseHeader.hbs";
import fetchSendRequest from "../../templates/core/fetch/sendRequest.hbs";
import fetchRequest from "../../templates/core/fetch/request.hbs";

/**
 * Specific files for the fetch client implementation
 */
export function register_fetch_files () {
    Handlebars.registerPartial('fetch/getHeaders', Handlebars.template(fetchGetHeaders));
    Handlebars.registerPartial('fetch/getRequestBody', Handlebars.template(fetchGetRequestBody));
    Handlebars.registerPartial('fetch/getResponseBody', Handlebars.template(fetchGetResponseBody));
    Handlebars.registerPartial('fetch/getResponseHeader', Handlebars.template(fetchGetResponseHeader));
    Handlebars.registerPartial('fetch/sendRequest', Handlebars.template(fetchSendRequest));
    Handlebars.registerPartial('fetch/request', Handlebars.template(fetchRequest));
}
