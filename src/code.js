var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Color from 'color';
import NodeTypes from 'enums/NodeTypes';
import MessageTypes from 'enums/MessageTypes';
import PropertyTypes from 'enums/PropertyTypes';
import FillTypes from 'enums/FillTypes';
import { hasCornerNode, hasMixedCornerNode, hasStrokeNode, hasFillsNode, hasOpacityNode, hasFontNode } from 'utils/hasNodeType';
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
function postMessage(type, message) {
    figma.ui.postMessage({ type, message });
}
function propertyMaps(properties) {
    return properties.reduce((calc, property) => {
        if (property._type === PropertyTypes.CORNER_RADIUS ||
            property._type === PropertyTypes.STROKE_WIDTH_ALIGN ||
            property._type === PropertyTypes.OPACITY ||
            property._type === PropertyTypes.TEXT) {
            calc[property._type] = property;
        }
        else if (property._type === PropertyTypes.FILL_COLOR ||
            property._type === PropertyTypes.STROKE_FILL) {
            if (!calc[property._type])
                calc[property._type] = [];
            calc[property._type].push(property);
        }
        return calc;
    }, {});
}
function assignProperty(properties, node) {
    return __awaiter(this, void 0, void 0, function* () {
        const _themeModes = figma.root.getPluginData('ThemeModes');
        const themeModes = _themeModes ? JSON.parse(_themeModes) : [];
        const defaultThemeMode = themeModes.find(mode => mode.isDefault);
        const useThemeMode = figma.currentPage.getPluginData('themeMode');
        const cornerRadius = properties[PropertyTypes.CORNER_RADIUS];
        const strokeWidthAlign = properties[PropertyTypes.STROKE_WIDTH_ALIGN];
        const strokeFill = properties[PropertyTypes.STROKE_FILL];
        const fillColor = properties[PropertyTypes.FILL_COLOR];
        const opacity = properties[PropertyTypes.OPACITY];
        const text = properties[PropertyTypes.TEXT];
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
        if (strokeWidthAlign && hasStrokeNode(node)) {
            const { width, align } = strokeWidthAlign;
            node.strokeWeight = width;
            node.strokeAlign = align;
        }
        if (strokeFill && hasStrokeNode(node)) {
            const existCurrentMode = strokeFill.find(fill => fill.themeMode === useThemeMode);
            strokeFill.forEach(fill => {
                const { fillType, color, opacity, visible, blendMode, themeMode } = fill;
                const [r, g, b] = Color(`#${color}`).rgb().color;
                if (((!existCurrentMode && defaultThemeMode.id === themeMode) || themeMode === useThemeMode) && fillType === FillTypes.SOLID) {
                    const solidPaint = {
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
                const { fillType, color, visible, opacity, blendMode, themeMode } = fill;
                const [r, g, b] = Color(`#${color}`).rgb().color;
                if (((!existCurrentMode && defaultThemeMode.id === themeMode) || themeMode === useThemeMode) && fillType === FillTypes.SOLID) {
                    const solidPaint = {
                        type: FillTypes.SOLID,
                        color: { r: r / 255, g: g / 255, b: b / 255 },
                        visible,
                        opacity,
                        blendMode
                    };
                    node.fills = [solidPaint];
                }
            });
        }
        if (opacity && hasOpacityNode(node)) {
            node.opacity = opacity.opacity / 100;
        }
        if (text && hasFontNode(node)) {
            const { fontName, fontSize: size } = text;
            let len = node.characters.length;
            yield figma.loadFontAsync(fontName);
            node.fontName = fontName;
            node.fontSize = size;
        }
    });
}
function getUsedTokens(properties, token) {
    const usedTokens = properties
        .filter(prop => prop.useToken && prop.useToken === token)
        .map(prop => prop.parent);
    return usedTokens.concat(...usedTokens.map(token => getUsedTokens(properties, token)));
}
function getInitThemeMode() {
    postMessage(MessageTypes.GET_INIT_THEME_MODE, figma.currentPage.getPluginData('themeMode'));
}
function getCurrentThemeMode() {
    postMessage(MessageTypes.GET_CURRENT_THEME_MODE, figma.currentPage.getPluginData('themeMode'));
}
function setCurrentThemeMode(message) {
    figma.currentPage.setPluginData('themeMode', message);
}
function syncCurrentThemeMode(node) {
    const data = figma.root.getPluginData('Tokens');
    const groups = data ? JSON.parse(data) : [];
    const allProperties = [];
    const tokensMap = groups.reduce((calc, group) => {
        group.tokens.forEach(token => {
            allProperties.push(...token.properties);
            calc[token.id] = token;
        });
        return calc;
    }, {});
    function traverse(node) {
        if ("children" in node) {
            for (const child of node.children) {
                traverse(child);
            }
        }
        if (node instanceof Array) {
            node.forEach(nodeItem => {
                traverse(nodeItem);
            });
            return;
        }
        const data = node.getPluginData('useTokens');
        const tokens = data ? JSON.parse(data) : [];
        tokens.forEach(token => {
            assignProperty(propertyMaps(tokensMap[token].properties), node);
        });
    }
    traverse(node);
}
figma.showUI(__html__, { visible: true, width: 267, height: 600 });
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, message } = msg;
    if (type === MessageTypes.GET_FONTS) {
        let fontList = yield figma.clientStorage.getAsync('font-list');
        if (!fontList) {
            fontList = yield figma.listAvailableFontsAsync();
            figma.clientStorage.setAsync('font-list', fontList);
        }
        const fonts = fontList.reduce((calc, font) => {
            if (!calc[font.fontName.family])
                calc[font.fontName.family] = [];
            calc[font.fontName.family].push(font.fontName);
            return calc;
        }, {});
        postMessage(MessageTypes.GET_FONTS, fonts);
    }
    if (type === MessageTypes.GET_MODES) {
        const themeModes = figma.root.getPluginData('ThemeModes');
        let modes = [];
        if (themeModes) {
            modes = JSON.parse(themeModes);
        }
        postMessage(type, modes);
    }
    if (type === MessageTypes.GET_INIT_THEME_MODE) {
        getInitThemeMode();
    }
    if (type === MessageTypes.GET_CURRENT_THEME_MODE) {
        getCurrentThemeMode();
    }
    if (type === MessageTypes.SET_CURRENT_THEME_MODE) {
        setCurrentThemeMode(message);
    }
    if (type === MessageTypes.SET_MODES) {
        const themeModes = JSON.parse(message);
        const currentTheme = figma.currentPage.getPluginData('themeMode');
        if (currentTheme && themeModes.find(mode => mode.id === currentTheme)) {
        }
        else {
            figma.currentPage.setPluginData('themeMode', themeModes[0].id);
        }
        figma.root.setPluginData('ThemeModes', message);
    }
    if (type === MessageTypes.GET_TOKENS) {
        let tokens = figma.root.getPluginData('Tokens');
        if (!tokens)
            tokens = '[]';
        postMessage(type, JSON.parse(tokens));
    }
    if (type === MessageTypes.SET_TOKENS) {
        figma.root.setPluginData('Tokens', message);
    }
    if (type === MessageTypes.ASSIGN_TOKEN) {
        const { id, properties } = JSON.parse(message);
        const selection = figma.currentPage.selection.slice();
        selection.forEach((node) => {
            const data = node.getPluginData('useTokens');
            const usedTokens = data ? JSON.parse(data) : [];
            const existIndex = usedTokens.findIndex(tokenId => tokenId === id);
            if (existIndex > -1)
                usedTokens.splice(existIndex, 1);
            usedTokens.push(id);
            node.setPluginData('useTokens', JSON.stringify(usedTokens));
            assignProperty(propertyMaps(properties), node);
        });
    }
    if (type === MessageTypes.SYNC_NODES) {
        const token = JSON.parse(message);
        const groups = JSON.parse(figma.root.getPluginData('Tokens'));
        const allProperties = [];
        const tokensMap = groups.reduce((calc, group) => {
            group.tokens.forEach(token => {
                allProperties.push(...token.properties);
                calc[token.id] = token;
            });
            return calc;
        }, {});
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
                    if (tokensMap[token])
                        assignProperty(propertyMaps(tokensMap[token].properties), node);
                });
            }
        }
        traverse(figma.root);
    }
    if (type === MessageTypes.SYNC_CURRENT_THEME_MODE) {
        syncCurrentThemeMode(figma.currentPage);
    }
});
figma.on('currentpagechange', () => {
    getInitThemeMode();
});
figma.on("selectionchange", () => {
    syncCurrentThemeMode(figma.currentPage.selection);
    postMessage(MessageTypes.SELECTION_CHANGE, figma.currentPage.selection);
});
