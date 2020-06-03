var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import MessageTypes from './MessageType';
import TokenTypes from './TokenTypes';
function clone(val) {
    const type = typeof val;
    if (val === null) {
        return null;
    }
    else if (type === 'undefined' || type === 'number' ||
        type === 'string' || type === 'boolean') {
        return val;
    }
    else if (type === 'object') {
        if (val instanceof Array) {
            return val.map(x => clone(x));
        }
        else if (val instanceof Uint8Array) {
            return new Uint8Array(val);
        }
        else {
            let o = {};
            for (const key in val) {
                o[key] = clone(val[key]);
            }
            return o;
        }
    }
    throw 'unknown';
}
function postMessage(type, message) {
    figma.ui.postMessage({ type, message });
}
figma.showUI(__html__, { visible: true, width: 240, height: 500 });
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    const { type, message } = msg;
    if (type === MessageTypes.GET_TOKENS) {
        postMessage(type, JSON.parse(figma.root.getPluginData('Tokens')));
    }
    if (type === MessageTypes.SET_TOKENS) {
        figma.root.setPluginData('Tokens', JSON.stringify(message));
    }
    if (type === MessageTypes.ASSIGN_TOKEN) {
        const { type: assignType, properties } = message;
        const selection = figma.currentPage.selection.slice();
        console.log(selection);
        if (assignType === TokenTypes.FILL_COLOR) {
            properties.map(property => {
                console.log(property);
            });
        }
        for (const node of selection) {
            // properties
            // const fills = clone(node.fills);
            // console.log(fills);
        }
    }
});
