import _cloneDeep from 'lodash/cloneDeep';
import MessageTypes from 'enums/MessageTypes';
import PropertyTypes from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';
const themeModes = [];
const groups = [];
const themeModeMap = {};
const groupMap = {};
const tokenMap = {};
let fonts = {};
let propertiesMap = {};
let currentThemeMode;
const pureToken = Object.keys(PropertyTypes).reduce((calc, type) => (calc[PropertyTypes[type]] = {}, calc), {});
const clearPureToken = () => {
    Object.keys(pureToken).forEach(key => {
        pureToken[key] = {};
    });
};
const getFonts = () => fonts;
const fetch = () => {
    sendMessage(MessageTypes.GET_FONTS);
    sendMessage(MessageTypes.GET_MODES);
    sendMessage(MessageTypes.GET_INIT_THEME_MODE);
    sendMessage(MessageTypes.GET_TOKENS);
};
const getCurrentThemeMode = () => currentThemeMode;
const getThemeMode = function (id) { return arguments.length ? themeModeMap[id] : themeModes; };
const getGroup = function (id) { return arguments.length ? groupMap[id] : groups; };
const getToken = function (id) { return arguments.length ? tokenMap[id] : Object.values(tokenMap); };
const getProperty = function (id) { return arguments.length ? propertiesMap[id] : Object.values(propertiesMap); };
const getPureToken = (type) => {
    if (typeof type === 'string') {
        return pureToken[type];
    }
    else {
        return type.reduce((calc, item) => {
            return Object.assign(calc, pureToken[item]);
        }, {});
    }
};
const setThemeMode = mode => {
    themeModes.push(mode);
    themeModeMap[mode.id] = mode;
};
const removeThemeMode = mode => {
    delete themeModeMap[mode.id];
    const index = themeModes.findIndex((_mode) => _mode.id === mode.id);
    themeModes.splice(index, 1);
};
const setCurrentThemeMode = themeMode => {
    currentThemeMode = themeMode;
    sendMessage(MessageTypes.SET_CURRENT_THEME_MODE, themeMode);
};
const setFonts = _fonts => {
    fonts = _fonts;
};
const setGroup = (group) => {
    groups.push(group);
    groupMap[group.id] = group;
    return group;
};
const setToken = (token) => {
    if (!getToken(token.id)) {
        tokenMap[token.id] = token;
        getGroup(token.parent).tokens.push(token);
    }
    return token;
};
const removeGroup = (group) => {
    if (getGroup(group.id)) {
        const index = groups.findIndex((_group) => _group.id === group.id);
        group.tokens.forEach(token => {
            removeToken(token);
        });
        delete groupMap[group.id];
        groups.splice(index, 1);
    }
};
const removeToken = (token) => {
    if (getToken(token.id)) {
        token.properties.forEach((prop) => {
            delete propertiesMap[prop.id];
        });
        const tokens = getGroup(token.parent).tokens;
        const index = tokens.findIndex((_token) => _token.id === token.id);
        delete tokenMap[token.id];
        tokens.splice(index, 1);
    }
};
const setProperty = property => propertiesMap[property.id] = property;
const setPureToken = (token) => token.propertyType && token.propertyType !== Mixed && (pureToken[token.propertyType][token.id] = token);
const saveThemeMode = () => {
    sendMessage(MessageTypes.SET_MODES, themeModes);
};
const save = () => {
    const _groups = _cloneDeep(groups);
    propertiesMap = {};
    clearPureToken();
    sendMessage(MessageTypes.SET_TOKENS, _groups.map(({ id, name, tokens }, groupIndex) => {
        tokens.forEach((token, tokenIndex) => {
            setPureToken(token);
            if (token.propertyType === Mixed)
                token.propertyType = String(Mixed);
            token.properties.forEach((property, propIndex) => {
                setProperty(groups[groupIndex].tokens[tokenIndex].properties[propIndex]);
                if (property.type === PropertyTypes.CORNER_RADIUS && property.radius === Mixed) {
                    property.radius = String(Mixed);
                }
            });
        });
        return { id, name, tokens };
    }));
};
const syncToken = (token) => {
    const refer = token.properties[0];
    getProperty().forEach((property) => {
        const hostToken = getToken(property.parent);
        if (property.useToken === token.id) {
            if (property.type === PropertyTypes.CORNER_RADIUS) {
                property.topLeft = refer.topLeft;
                property.topRight = refer.topRight;
                property.bottomRight = refer.bottomRight;
                property.bottomLeft = refer.bottomLeft;
                property.radius = refer.radius;
            }
            if (property.type === PropertyTypes.STROKE_WIDTH_ALIGN) {
                property.align = refer.align;
                property.width = refer.width;
            }
            if (property.type === PropertyTypes.FILL_COLOR) {
                property.blendMode = refer.blendMode;
                property.color = refer.color;
                property.fillType = refer.fillType;
                property.opacity = refer.opacity;
                property.visible = refer.visible;
            }
            if (hostToken.properties.length === 1)
                syncToken(hostToken);
        }
    });
};
const syncPageThemeMode = () => {
    sendMessage(MessageTypes.SYNC_CURRENT_THEME_MODE);
};
const referByToken = (token) => getProperty()
    .filter((property) => property.useToken === token.id)
    .map((property) => getToken(property.parent));
const syncNode = (token) => {
    sendMessage(MessageTypes.SYNC_NODES, token);
};
const sendMessage = (type, message = "") => parent.postMessage({
    pluginMessage: {
        type,
        message: typeof message === 'string' ? message : JSON.stringify(message),
    },
}, "*");
export { fetch, getThemeMode, getCurrentThemeMode, getFonts, getGroup, getToken, getProperty, getPureToken, setThemeMode, setCurrentThemeMode, removeThemeMode, setFonts, setGroup, setToken, setProperty, setPureToken, removeGroup, removeToken, save, saveThemeMode, syncToken, syncNode, syncPageThemeMode, referByToken, sendMessage };
