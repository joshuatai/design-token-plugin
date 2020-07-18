var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import NodeTypes from 'enums/NodeTypes';
import MessageTypes from 'enums/MessageTypes';
import PropertyTypes from 'enums/PropertyTypes';
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
function supportsChildren(node) {
    const { FRAME, GROUP, COMPONENT, INSTANCE, BOOLEAN_OPERATION } = NodeTypes;
    return node.type === FRAME ||
        node.type === GROUP ||
        node.type === COMPONENT ||
        node.type === INSTANCE ||
        node.type === BOOLEAN_OPERATION;
}
function hasMixedCornerNode(node) {
    return node.type === NodeTypes.RECTANGLE ||
        node.type === NodeTypes.COMPONENT;
}
function hasCornerNode(node) {
    const { RECTANGLE, POLYGON, STAR, VECTOR } = NodeTypes;
    return node.type === RECTANGLE ||
        node.type === POLYGON ||
        node.type === STAR ||
        node.type === VECTOR;
}
function hasStrokeNode(node) {
    const { ELLIPSE, LINE, RECTANGLE, POLYGON, STAR, TEXT, VECTOR } = NodeTypes;
    return [ELLIPSE, LINE, RECTANGLE, POLYGON, STAR, TEXT, VECTOR].includes(node.type);
}
function assignProperty(properties, node) {
    const cornerRadius = properties[PropertyTypes.CORNER_RADIUS];
    const strokeWidthAlign = properties[PropertyTypes.STROKE_WIDTH_ALIGN];
    node.type === NodeTypes.GROUP && node.children.forEach(child => {
        assignProperty(properties, child);
    });
    if (cornerRadius) {
        const { radius, topLeft, topRight, bottomRight, bottomLeft } = cornerRadius;
        if (radius !== undefined && hasCornerNode(node)) {
            node.cornerRadius = radius;
        }
        else if (hasMixedCornerNode(node)) {
            node.topLeftRadius = topLeft;
            node.topRightRadius = topRight;
            node.bottomRightRadius = bottomRight;
            node.bottomLeftRadius = bottomLeft;
        }
    }
    if (strokeWidthAlign) {
        const { width, align } = strokeWidthAlign;
        if (hasStrokeNode(node)) {
            node.strokeWeight = width;
            node.strokeAlign = align;
        }
    }
}
figma.showUI(__html__, { visible: true, width: 240, height: 500 });
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, message } = msg;
    if (type === MessageTypes.GET_TOKENS) {
        postMessage(type, JSON.parse(figma.root.getPluginData('Tokens')));
    }
    if (type === MessageTypes.SET_TOKENS) {
        figma.root.setPluginData('Tokens', message);
    }
    if (type === MessageTypes.ASSIGN_TOKEN) {
        const { id, properties } = JSON.parse(message);
        const _properties = properties.reduce((calc, property) => {
            if (property._type === PropertyTypes.CORNER_RADIUS ||
                property._type === PropertyTypes.STROKE_WIDTH_ALIGN)
                calc[property._type] = property;
            return calc;
        }, {});
        const selection = figma.currentPage.selection.slice();
        selection.forEach((node) => {
            assignProperty(_properties, node);
        });
    }
});
figma.on("selectionchange", () => {
    console.log(figma.currentPage.selection);
    postMessage(MessageTypes.SELECTION_CHANGE, figma.currentPage.selection);
});
