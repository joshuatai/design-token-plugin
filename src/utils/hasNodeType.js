import NodeTypes from 'enums/NodeTypes';
const hasCornerNode = function (node) {
    const { RECTANGLE, POLYGON, STAR, VECTOR } = NodeTypes;
    return node.type === RECTANGLE ||
        node.type === POLYGON ||
        node.type === STAR ||
        node.type === VECTOR;
};
const hasMixedCornerNode = function (node) {
    return node.type === NodeTypes.RECTANGLE ||
        node.type === NodeTypes.COMPONENT;
};
const hasStrokeNode = function (node) {
    const { ELLIPSE, LINE, RECTANGLE, POLYGON, STAR, TEXT, VECTOR } = NodeTypes;
    return [ELLIPSE, LINE, RECTANGLE, POLYGON, STAR, TEXT, VECTOR].includes(node.type);
};
const hasFillsNode = function (node) {
    const { COMPONENT, ELLIPSE, FRAME, INSTANCE, LINE, POLYGON, RECTANGLE, STAR, TEXT, VECTOR } = NodeTypes;
    return [COMPONENT, ELLIPSE, FRAME, INSTANCE, LINE, POLYGON, RECTANGLE, STAR, TEXT, VECTOR].includes(node.type);
};
const hasFontNode = function (node) {
    const { TEXT } = NodeTypes;
    return [TEXT].includes(node.type);
};
export { hasMixedCornerNode, hasCornerNode, hasStrokeNode, hasFillsNode, hasFontNode };
