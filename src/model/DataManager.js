import _cloneDeep from 'lodash/cloneDeep';
import MessageTypes from 'enums/MessageTypes';
import PropertyTypes from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';
const data = [];
const groupMap = {};
const tokenMap = {};
const propertiesMap = {};
const pureToken = {
    [PropertyTypes.CORNER_RADIUS]: {}
};
const fetch = () => sendMessage(MessageTypes.GET_TOKENS);
const getAllGroup = () => data;
const getGroup = (id) => groupMap[id];
const getToken = (id) => tokenMap[id];
const getAllToken = () => Object.values(tokenMap);
const getPureToken = (type) => pureToken[type];
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
const getProperty = id => propertiesMap[id];
const clearProperty = () => Object.keys(propertiesMap).forEach(key => delete propertiesMap[key]);
const setPureToken = (token) => token.propertyType && token.propertyType !== Mixed && (pureToken[token.propertyType][token.id] = token);
const save = () => {
    const _data = _cloneDeep(data);
    clearProperty();
    sendMessage(MessageTypes.SET_TOKENS, _data.map(({ id, name, tokens }) => {
        tokens.forEach((token) => {
            setPureToken(token);
            if (token.propertyType === Mixed)
                token.propertyType = String(Mixed);
            token.properties.forEach((property) => {
                setProperty(property);
                if (property.type === PropertyTypes.CORNER_RADIUS && property.radius === Mixed) {
                    property.radius = String(Mixed);
                }
            });
        });
        return { id, name, tokens };
    }));
};
const sendMessage = (type, message = "") => parent.postMessage({
    pluginMessage: {
        type,
        message: JSON.stringify(message),
    },
}, "*");
export { fetch, getAllGroup, getGroup, getAllToken, getToken, getPureToken, getProperty, setGroup, setToken, setPureToken, removeToken, save, sendMessage };
