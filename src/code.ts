import NodeTypes from 'enums/NodeTypes';
import MessageTypes from 'enums/MessageTypes';
import PropertyTypes from 'enums/PropertyTypes';
import Token from 'model/Token';

function clone(val) {
  const type = typeof val
  if (val === null) {
    return null
  } else if (type === 'undefined' || type === 'number' ||
             type === 'string' || type === 'boolean') {
    return val
  } else if (type === 'object') {
    if (val instanceof Array) {
      return val.map(x => clone(x))
    } else if (val instanceof Uint8Array) {
      return new Uint8Array(val)
    } else {
      let o = {}
      for (const key in val) {
        o[key] = clone(val[key])
      }
      return o
    }
  }
  throw 'unknown'
}
function postMessage (type: String, message: String | Object): void {
  figma.ui.postMessage({ type, message });
}

function supportsChildren(node: SceneNode):
  node is FrameNode | ComponentNode | InstanceNode | BooleanOperationNode
{
  const { FRAME, GROUP, COMPONENT, INSTANCE, BOOLEAN_OPERATION } = NodeTypes;
  return node.type === FRAME ||
         node.type === GROUP ||
         node.type === COMPONENT ||
         node.type === INSTANCE ||
         node.type === BOOLEAN_OPERATION
}
function hasMixedCornerNode (node):
  node is ComponentNode | RectangleNode {
    return node.type === NodeTypes.RECTANGLE ||
           node.type === NodeTypes.COMPONENT;
}
function hasCornerNode (node):
  node is RectangleNode | PolygonNode | StarNode | VectorNode {
    const { RECTANGLE, POLYGON, STAR, VECTOR } = NodeTypes;
    return node.type === RECTANGLE ||
           node.type === POLYGON ||
           node.type === STAR ||
           node.type === VECTOR
}
function hasStrokeNode (node):
  node is EllipseNode | LineNode | RectangleNode | PolygonNode | StarNode | TextNode
{
  const { ELLIPSE, LINE, RECTANGLE, POLYGON, STAR, TEXT, VECTOR } = NodeTypes;
  return [ELLIPSE, LINE, RECTANGLE, POLYGON, STAR, TEXT, VECTOR].includes(node.type);
}
function assignProperty (properties, node) {
  const cornerRadius = properties[PropertyTypes.CORNER_RADIUS];
  const strokeWidthAlign = properties[PropertyTypes.STROKE_WIDTH_ALIGN];

  node.type === NodeTypes.GROUP && node.children.forEach(child => {
    assignProperty(properties, child);
  });

  if (cornerRadius) {
    const { radius, topLeft, topRight, bottomRight, bottomLeft } = cornerRadius;
    
    if (radius !== undefined && hasCornerNode(node)) {
      node.cornerRadius = radius;
    } else if (hasMixedCornerNode(node)) {
      node.topLeftRadius = topLeft;
      node.topRightRadius = topRight;
      node.bottomRightRadius = bottomRight;
      node.bottomLeftRadius = bottomLeft;
    } 
  }
  if (strokeWidthAlign) {
    const { width, align } = strokeWidthAlign;
    if (width && hasStrokeNode(node)) {
      node.strokeWeight = width;
      console.log(node.strokes);
    }
  }

}
figma.showUI(__html__, { visible: true, width: 240, height: 500 });

figma.ui.onmessage = async (msg) => {
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
      if (
        property._type === PropertyTypes.CORNER_RADIUS ||
        property._type === PropertyTypes.STROKE_WIDTH_ALIGN
      ) calc[property._type] = property;

      return calc;
    }, {});

    const selection = figma.currentPage.selection.slice();
    selection.forEach((node: any) => {
      assignProperty(_properties, node);
    });
  }
};
figma.on("selectionchange", () => {
  console.log(figma.currentPage.selection);
  postMessage(MessageTypes.SELECTION_CHANGE, figma.currentPage.selection);
});
