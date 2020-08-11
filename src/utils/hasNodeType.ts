import NodeTypes from 'enums/NodeTypes';

const hasCornerNode = function (node):
  node is RectangleNode | PolygonNode | StarNode | VectorNode {
    const { RECTANGLE, POLYGON, STAR, VECTOR } = NodeTypes;
    return node.type === RECTANGLE ||
           node.type === POLYGON ||
           node.type === STAR ||
           node.type === VECTOR
};

const hasMixedCornerNode = function (node):
  node is ComponentNode | RectangleNode {
    return node.type === NodeTypes.RECTANGLE ||
           node.type === NodeTypes.COMPONENT;
};

const hasStrokeNode = function (node):
  node is EllipseNode | LineNode | RectangleNode | PolygonNode | StarNode | TextNode
{
  const { ELLIPSE, LINE, RECTANGLE, POLYGON, STAR, TEXT, VECTOR } = NodeTypes;
  return [ELLIPSE, LINE, RECTANGLE, POLYGON, STAR, TEXT, VECTOR].includes(node.type);
};

const hasFillsNode = function (node):
  node is ComponentNode | EllipseNode | FrameNode | InstanceNode | LineNode | PolygonNode | RectangleNode | StarNode | TextNode | VectorNode
{
  const { COMPONENT, ELLIPSE, FRAME, INSTANCE, LINE, POLYGON, RECTANGLE, STAR, TEXT, VECTOR } = NodeTypes;
  return [COMPONENT, ELLIPSE, FRAME, INSTANCE, LINE, POLYGON, RECTANGLE, STAR, TEXT, VECTOR].includes(node.type); 
};

const hasOpacityNode = function (node) :
  node is ComponentNode | EllipseNode | FrameNode | GroupNode | InstanceNode | LineNode | PolygonNode | RectangleNode | StarNode | TextNode | VectorNode
{
  const { COMPONENT, ELLIPSE, FRAME, INSTANCE, LINE, POLYGON, RECTANGLE, STAR, TEXT, VECTOR } = NodeTypes;
  return [COMPONENT, ELLIPSE, FRAME, INSTANCE, LINE, POLYGON, RECTANGLE, STAR, TEXT, VECTOR].includes(node.type);
}

const hasFontNode = function (node):
node is TextNode
{
const { TEXT } = NodeTypes;
return [TEXT].includes(node.type); 
};

export {
    hasMixedCornerNode,
    hasCornerNode,
    hasStrokeNode,
    hasFillsNode,
    hasOpacityNode,
    hasFontNode
}