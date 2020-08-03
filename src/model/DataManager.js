import _cloneDeep from 'lodash/cloneDeep';
import MessageTypes from 'enums/MessageTypes';
import PropertyTypes from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';
const data = [];
const groupMap = {};
const tokenMap = {};
let fonts = {};
let propertiesMap = {};
const pureToken = Object.keys(PropertyTypes).reduce((calc, type) => (calc[PropertyTypes[type]] = {}, calc), {});
const clearPureToken = () => {
    Object.keys(pureToken).forEach(key => {
        pureToken[key] = {};
    });
};
const getFonts = () => {
    return _cloneDeep(fonts);
};
const fetch = () => sendMessage(MessageTypes.GET_TOKENS);
const getAllGroup = () => data;
const getGroup = (id) => groupMap[id];
const getToken = (id) => tokenMap[id];
const getAllToken = () => Object.values(tokenMap);
const getProperty = id => propertiesMap[id];
const getAllProperty = () => Object.values(propertiesMap);
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
const setFonts = _fonts => {
    fonts = _fonts;
};
const setGroup = (group) => {
    data.push(group);
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
const removeToken = (token) => {
    if (getToken(token.id)) {
        delete tokenMap[token.id];
        const tokens = getGroup(token.parent).tokens;
        const index = tokens.findIndex((_token) => _token.id === token.id);
        tokens.splice(index, 1);
    }
};
const setProperty = property => propertiesMap[property.id] = property;
const setPureToken = (token) => token.propertyType && token.propertyType !== Mixed && (pureToken[token.propertyType][token.id] = token);
const save = () => {
    const _data = _cloneDeep(data);
    propertiesMap = {};
    clearPureToken();
    sendMessage(MessageTypes.SET_TOKENS, _data.map(({ id, name, tokens }, groupIndex) => {
        tokens.forEach((token, tokenIndex) => {
            setPureToken(token);
            if (token.propertyType === Mixed)
                token.propertyType = String(Mixed);
            token.properties.forEach((property, propIndex) => {
                setProperty(data[groupIndex].tokens[tokenIndex].properties[propIndex]);
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
    getAllProperty().forEach((property) => {
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
const referByToken = (token) => getAllProperty()
    .filter((property) => property.useToken === token.id)
    .map((property) => getToken(property.parent));
const syncNode = (token) => {
    sendMessage(MessageTypes.SYNC_NODES, token);
};
const sendMessage = (type, message = "") => parent.postMessage({
    pluginMessage: {
        type,
        message: JSON.stringify(message),
    },
}, "*");
export { fetch, getFonts, getAllGroup, getGroup, getAllToken, getToken, getProperty, getPureToken, setFonts, setGroup, setToken, setProperty, setPureToken, removeToken, save, syncToken, syncNode, referByToken, sendMessage };
