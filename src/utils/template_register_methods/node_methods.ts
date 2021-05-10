import Handlebars from "handlebars/runtime";
import nodeGetHeaders from "../../templates/core/node/getHeaders.hbs";
import nodeGetRequestBody from "../../templates/core/node/getRequestBody.hbs";
import nodeGetResponseBody from "../../templates/core/node/getResponseBody.hbs";
import nodeGetResponseHeader from "../../templates/core/node/getResponseHeader.hbs";
import nodeSendRequest from "../../templates/core/node/sendRequest.hbs";
import nodeRequest from "../../templates/core/node/request.hbs";

/**
 * Specific files for the node client implementation
 */
export function register_node_client () {
    Handlebars.registerPartial('node/getHeaders', Handlebars.template(nodeGetHeaders));
    Handlebars.registerPartial('node/getRequestBody', Handlebars.template(nodeGetRequestBody));
    Handlebars.registerPartial('node/getResponseBody', Handlebars.template(nodeGetResponseBody));
    Handlebars.registerPartial('node/getResponseHeader', Handlebars.template(nodeGetResponseHeader));
    Handlebars.registerPartial('node/sendRequest', Handlebars.template(nodeSendRequest));
    Handlebars.registerPartial('node/request', Handlebars.template(nodeRequest));
}
