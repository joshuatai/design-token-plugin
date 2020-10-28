import Color from 'color';
import NodeTypes from 'enums/NodeTypes';
import MessageTypes from 'enums/MessageTypes';
import PropertyTypes from 'enums/PropertyTypes';
import FillTypes from 'enums/FillTypes';
import { hasCornerNode, hasMixedCornerNode, hasStrokeNode, hasFillsNode, hasOpacityNode, hasFontNode } from 'utils/hasNodeType';

let themeModes = [];
let versions = [];
let groups;
let tokens = [];
let tokensMap = {};
let allProperties = [];
// function clone(val) {
//   const type = typeof val
//   if (val === null) {
//     return null
//   } else if (type === 'undefined' || type === 'number' ||
//              type === 'string' || type === 'boolean') {
//     return val
//   } else if (type === 'object') {
//     if (val instanceof Array) {
//       return val.map(x => clone(x))
//     } else if (val instanceof Uint8Array) {
//       return new Uint8Array(val)
//     } else {
//       let o = {}
//       for (const key in val) {
//         o[key] = clone(val[key])
//       }
//       return o
//     }
//   }
//   throw 'unknown'
// }
function postMessage (type: string, message: string | Object): void {
  figma.ui.postMessage({ type, message });
}
function getCurrentThemeMode () {
  return figma.currentPage.getPluginData('themeMode');
}
function setCurrentThemeMode (message) {
  figma.currentPage.setPluginData('themeMode', message);
}
function sendCurrentThemeMode () {
  // postMessage(MessageTypes.FETCH_CURRENT_THEME_MODE, figma.currentPage.getPluginData('themeMode'));
}


function propertyMaps (properties) {
  return properties.reduce((calc, property) => {
    if (
      property._type === PropertyTypes.CORNER_RADIUS ||
      property._type === PropertyTypes.STROKE_WIDTH_ALIGN ||
      property._type === PropertyTypes.FONT
    ) {
      calc[property._type] = property;
    } else if (
      property._type === PropertyTypes.FILL_COLOR ||
      property._type === PropertyTypes.STROKE_FILL ||
      property._type === PropertyTypes.OPACITY
    ) {
      if (!calc[property._type]) calc[property._type] = [];
      calc[property._type].push(property);
    }
    return calc;
  }, {});
}
function traversingUseToken (token) {
  const _themeModes = figma.root.getPluginData('ThemeModes');
  const themeModes = _themeModes ? JSON.parse(_themeModes) : [];
  const defaultThemeMode = themeModes.find(mode => mode.isDefault).id;
  const useThemeMode = figma.currentPage.getPluginData('themeMode');
  const existCurrentMode = token.properties.find(prop => prop.themeMode === useThemeMode);
  const defaultMode = token.properties.find(prop => prop.themeMode === defaultThemeMode);
  const property = existCurrentMode ? existCurrentMode : defaultMode;

  if (property.useToken) {
    return traversingUseToken(tokensMap[property.useToken]);
  } else {
    return property;
  }
}
async function assignProperty (properties, node, setNodeUseTheme = true) {
  const _themeModes = figma.root.getPluginData('ThemeModes');
  const themeModes = _themeModes ? JSON.parse(_themeModes) : [];
  const defaultThemeMode = themeModes.find(mode => mode.isDefault).id;
  const useThemeMode = figma.currentPage.getPluginData('themeMode');

  const cornerRadius = properties[PropertyTypes.CORNER_RADIUS];
  const strokeWidthAlign = properties[PropertyTypes.STROKE_WIDTH_ALIGN];
  const strokeFill = properties[PropertyTypes.STROKE_FILL];
  const fillColor = properties[PropertyTypes.FILL_COLOR];
  const opacity = properties[PropertyTypes.OPACITY];
  const text = properties[PropertyTypes.FONT];
  
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

  if (strokeWidthAlign && hasStrokeNode(node)) {
    const { width, align } = strokeWidthAlign;
    node.strokeWeight = width;
    node.strokeAlign = align;
  }

  if (strokeFill && hasStrokeNode(node)) {
    const existCurrentMode = strokeFill.find(fill => fill.themeMode === useThemeMode);

    strokeFill.forEach(fill => {
      let { fillType, themeMode, useToken } = fill;
      let prop = fill;
      if (((!existCurrentMode && defaultThemeMode === themeMode) || themeMode === useThemeMode) && fillType === FillTypes.SOLID) {
        if (useToken) {
          prop = traversingUseToken(tokensMap[useToken]);
        }
        let { color, visible, opacity, blendMode } = prop;
        const [r, g, b] = Color(`#${color}`).rgb().color;
        const solidPaint: SolidPaint = {
          type: FillTypes.SOLID,
          color: { r: r / 255, g: g / 255, b: b / 255 },
          visible,
          opacity,
          blendMode
        };
        node.strokes = [solidPaint];
      }
    });
  }
  
  if (fillColor && hasFillsNode(node)) {
    const existCurrentMode = fillColor.find(fill => fill.themeMode === useThemeMode);

    fillColor.forEach(fill => {
      let { fillType, themeMode, useToken } = fill;
      let prop = fill;
      if (((!existCurrentMode && defaultThemeMode === themeMode) || themeMode === useThemeMode) && fillType === FillTypes.SOLID) {
        if (useToken) {
          prop = traversingUseToken(tokensMap[useToken]);
        }
        let { color, visible, opacity, blendMode } = prop;
        if (color === 'transparent' || color === 'null') {
          node.fills = [];
        } else {
          const [r, g, b] = Color(`#${color}`).rgb().color;
          const solidPaint: SolidPaint = {
            type: FillTypes.SOLID,
            color: { r: r / 255, g: g / 255, b: b / 255 },
            visible,
            opacity,
            blendMode
          };
          node.fills = [solidPaint];
        }
      }
    });
  }

  if (opacity && hasOpacityNode(node)) {
    const existCurrentMode = opacity.find(fill => fill.themeMode === useThemeMode);
    opacity.forEach(_opacity => {
      let { themeMode, useToken } = _opacity;
      let prop = _opacity;
      if (((!existCurrentMode && defaultThemeMode === themeMode) || themeMode === useThemeMode)) {
        if (useToken) {
          prop = traversingUseToken(tokensMap[useToken]);
        }
        node.opacity = prop.opacity / 100;
      }
    });
  }

  if (text && hasFontNode(node)) {
    const { fontName, fontSize: size } = text;
    let len = node.characters.length;
    await figma.loadFontAsync(fontName);
    node.fontName = fontName;
    node.fontSize = size;
  }
}
function setTokens (groups) {
  tokens = [];
  tokensMap = {};
  allProperties = [];
  groups.forEach(group => {
    group.tokens.length && 
    (tokens = tokens.concat(
        group.tokens.map(token => { 
          tokensMap[token.id] = token;
          allProperties.push(...token.properties);
          return token;
        })
      )
    )
  });
}
function getUsedTokens (properties, token: string) {
  const usedTokens = properties
    .filter(prop => prop.useToken && prop.useToken === token)
    .map(prop => prop.parent);
  return usedTokens.concat(...usedTokens.map(token => getUsedTokens(properties, token)));
}



function syncCurrentThemeMode (node) {
  const currentThemeMode = getCurrentThemeMode();
  function traverse(node) {
    if (node instanceof Array) {
      node.forEach(nodeItem => {
        traverse(nodeItem);
      });
      return;
    }
    
    let data = node.getPluginData('useTokens');
    const instanceNodes = node.id.split(';');
    // console.log(node, data, '=================================');
    if (instanceNodes.length > 1) {
      const masterNode = instanceNodes.reduce((calc, id) => {
        let matchNode;
        if (calc) {
          if (id[0] === 'I') {
            matchNode = calc.findOne(_node => _node.id === id.substr(1));
            matchNode = matchNode.masterComponent;
            // console.log(node ,matchNode);
          } else {
            matchNode = calc.findOne(node => node.id.indexOf(id) > -1);
            // console.log(node ,matchNode, matchNode.getPluginData('useTokens'));
          }
        }
        return matchNode;
      }, figma.currentPage);
      // console.log(node ,masterNode, masterNode.getPluginData('useTokens'));
      const _data = masterNode.getPluginData('useTokens');
      if (_data) {
        node.setPluginData('useTokens', _data);
        data = _data;
      }
    } else if (!data && node.type === 'INSTANCE') {
      const masterNode = node.masterComponent;
      const _data = masterNode.getPluginData('useTokens');
      if (_data) {
        node.setPluginData('useTokens', _data);
        data = _data;
      }
    }
    if ("children" in node) {
      for (const child of node.children) {
        traverse(child);
      }
    }
    
    const tokens = data ? JSON.parse(data) : [];
    const length = tokens.length;
    let removedTokens = [];
    tokens.forEach(token => {
      if (tokensMap[token]) {
        assignProperty(propertyMaps(tokensMap[token].properties), node);
      } else {
        removedTokens.push(token);
      }
    });
    removedTokens.forEach(remove => {
      const index = tokens.findIndex((token) => token === remove);
      if (index > -1) tokens.splice(index, 1);
    });
    // if (tokens.length !== length) node.setPluginData('useTokens', JSON.stringify(tokens));
  }
  traverse(node);
}
function selectionchange () {
  const selections = figma.currentPage.selection.map(node => {
    const useTokens = node.getPluginData('useTokens');
    return {
      id: node.id,
      name: node.name,
      useTokens: useTokens ? JSON.parse(useTokens) : []
    };
  });
  postMessage(MessageTypes.SELECTION_CHANGE, selections);
}
figma.showUI(__html__, { visible: true, width: 274, height: 600 });

figma.ui.onmessage = async (msg) => {
  const { type, message } = msg;
  if (type === MessageTypes.GET_API) {
    const apiKey = await figma.clientStorage.getAsync('api-key');
    const tokensID = await figma.clientStorage.getAsync('tokens-id');
    // const collectionID = await figma.clientStorage.getAsync('collection-id');
    const versionsID = await figma.clientStorage.getAsync('versions-id');
    const adminID = await figma.clientStorage.getAsync('admin-id');
    const admin = await figma.clientStorage.getAsync('admin');
    postMessage(MessageTypes.GET_API, { 'api-key': apiKey, 'tokens-id': tokensID, /*'collection-id': collectionID,*/ 'versions-id': versionsID, 'admin-id': adminID, admin });
  }
  if (type === MessageTypes.SET_API) {
    const settings = JSON.parse(message);
    figma.clientStorage.setAsync('api-key', settings['api-key']);
    figma.clientStorage.setAsync('tokens-id', settings['tokens-id']);
    // figma.clientStorage.setAsync('collection-id', settings['collection-id']);
    figma.clientStorage.setAsync('versions-id', settings['versions-id']);
    figma.clientStorage.setAsync('admin-id', settings['admin-id']);
    figma.clientStorage.setAsync('admin', settings['admin']);
  }
  if (type === MessageTypes.GET_FONTS) {
    const fontList = await figma.listAvailableFontsAsync();
    const fonts = fontList.reduce((calc, font) => {
      if (!calc[font.fontName.family]) calc[font.fontName.family] = [];
      calc[font.fontName.family].push(font.fontName);
      return calc;
    }, {});
    postMessage(MessageTypes.GET_FONTS, fonts);
  }
  if (type === MessageTypes.FETCH_CURRENT_THEME_MODE) {
    postMessage(MessageTypes.FETCH_CURRENT_THEME_MODE, getCurrentThemeMode());
    // setTimeout(selectionchange, 1000);
  }
  if (type === MessageTypes.SET_CURRENT_THEME_MODE) {
    setCurrentThemeMode(message);
  }
  if (type === MessageTypes.GET_CURRENT_THEME_MODE) {
    postMessage(MessageTypes.GET_CURRENT_THEME_MODE, getCurrentThemeMode());
  }





  if (type === MessageTypes.SET_MODES) {
    themeModes = JSON.parse(message);
    const currentTheme = figma.currentPage.getPluginData('themeMode');
    if (!currentTheme || !themeModes.find(mode => mode.id === currentTheme)) {
      // figma.currentPage.setPluginData('themeMode', themeModes[0].id);
    }
  }
  

  
  if (type === MessageTypes.GET_VERSIONS) {
    const versionData = figma.root.getPluginData('versions');
    versions = versionData ? JSON.parse(versionData) : [];
    postMessage(type, versions);
  }
  

  
  
  
  if (type === MessageTypes.SET_VERSION) {
    figma.root.setPluginData('versions', message);
  }
  if (type === MessageTypes.RESTRORE_VERSION) {

  }
  //Done
  if (type === MessageTypes.GET_TOKENS) {
    groups = figma.root.getPluginData('Tokens');

    if (groups) {
      groups = JSON.parse(groups);
    } else {
      groups = [];
    }
    setTokens(groups);
    postMessage(type, groups);
  }
  //Done
  if (type === MessageTypes.SET_TOKENS) {
    groups = JSON.parse(message);
    setTokens(groups);
    figma.root.setPluginData('Tokens', message);
  }
  if (type === MessageTypes.ASSIGN_TOKEN) {
    const { id, properties } = JSON.parse(message);
    const selection = figma.currentPage.selection.slice();
    selection.forEach((node: any) => {
      const data = node.getPluginData('useTokens');
      const usedTokens = data ? JSON.parse(data) : [];
      const existIndex = usedTokens.findIndex(tokenId => tokenId === id);
      if (existIndex > -1) usedTokens.splice(existIndex, 1);
      usedTokens.push(id);
      node.setPluginData('useTokens', JSON.stringify(usedTokens));
      assignProperty(propertyMaps(properties), node);
    });
    selectionchange();
  }
  if (type === MessageTypes.UNASSIGN_TOKEN) {
    const { nodeId, tokenId } = JSON.parse(message);
    const unassignNode = figma.currentPage.findOne(node => node.id ===  nodeId);
    const useTokens = unassignNode.getPluginData('useTokens');
    let tokens = useTokens ? JSON.parse(useTokens) : [];
    tokens = tokens.filter(token => token !== tokenId);
    unassignNode.setPluginData('useTokens', JSON.stringify(tokens));
    tokens.forEach(token => {
      if (tokensMap[token]) assignProperty(propertyMaps(tokensMap[token].properties), unassignNode);
    });
    selectionchange();
  }
  if (type === MessageTypes.REORDER_ASSIGN_TOKEN) {
    const { nodeId, tokens } = JSON.parse(message);
    const unassignNode = figma.currentPage.findOne(node => node.id ===  nodeId);
    
    unassignNode.setPluginData('useTokens', JSON.stringify(tokens));
    tokens.forEach(token => {
      if (tokensMap[token]) assignProperty(propertyMaps(tokensMap[token].properties), unassignNode);
    });
    selectionchange();
  }
  if (type === MessageTypes.SYNC_NODES) {
    const token = JSON.parse(message);
    const usedTokens = getUsedTokens(allProperties, token.id);
    usedTokens.push(token.id);
    function traverse(node) {
      if ("children" in node) {
        for (const child of node.children) {
          traverse(child);
        }
      }
      const data = node.getPluginData('useTokens');
      const tokens = data ? JSON.parse(data) : [];
      const usedToken = usedTokens.filter(token => tokens.includes(token));

      if (usedToken.length > 0) {
        tokens.forEach(token => {
          if (tokensMap[token]) assignProperty(propertyMaps(tokensMap[token].properties), node);
        });
      }
    }
    traverse(figma.currentPage);
  }
  if (type === MessageTypes.SYNC_CURRENT_THEME_MODE) {
    syncCurrentThemeMode(figma.currentPage);
  }
};
figma.on('currentpagechange', () => {
  sendCurrentThemeMode();
  selectionchange();
});
figma.on("selectionchange", () => {
  syncCurrentThemeMode(figma.currentPage.selection);
  selectionchange();
});