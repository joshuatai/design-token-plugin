import MessageTypes from './enums/MessageType';
import ColorMode from './enums/ColorMode';
import PropertyTypes from './enums/PropertyTypes';

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
    const { type: assignType, properties }  = message;
    const selection = figma.currentPage.selection.slice();
    // console.log(selection);
    if (assignType === PropertyTypes.FILL_COLOR) {
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
}