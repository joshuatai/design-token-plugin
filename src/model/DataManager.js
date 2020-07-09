import MessageTypes from '../enums/MessageType';
const data = [];
const groupMap = {};
const tokenMap = {};
const fetch = () => sendMessage(MessageTypes.GET_TOKENS);
const getData = () => data;
const getGroup = (id) => groupMap[id];
const getToken = (id) => tokenMap[id];
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
const save = () => {
    // console.log("save", data);
    sendMessage(MessageTypes.SET_TOKENS, data.map(({ id, name, tokens }) => ({ id, name, tokens })));
};
const sendMessage = (type, message = "") => parent.postMessage({
    pluginMessage: {
        type,
        message: JSON.stringify(message),
    },
}, "*");
export { fetch, getData, getGroup, getToken, setGroup, setToken, removeToken, save };
