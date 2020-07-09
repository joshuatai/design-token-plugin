import MessageTypes from '../enums/MessageType';
import Group from './Group';
import Token from './Token';

const data: Array<Group> = [];
const groupMap = {};
const tokenMap = {};

const fetch = () => sendMessage(MessageTypes.GET_TOKENS);
const getData = (): Array<Group> => data;
const getGroup = (id): Group => groupMap[id];
const getToken = (id?): Token => tokenMap[id];
const setGroup = (group: Group): Group => {
  data.push(group);
  groupMap[group.id] = group;
  return group;
};
const setToken = (token: Token): Token => {
  if (!getToken(token.id)) {
    tokenMap[token.id] = token;
    getGroup(token.parent).tokens.push(token);
  }
  return token;
};
const removeToken = (token: Token) => {
  if (getToken(token.id)) {
    delete tokenMap[token.id];
    const tokens = getGroup(token.parent).tokens;
    const index = tokens.findIndex((_token: Token) => _token.id === token.id);
    tokens.splice(index, 1);
  }
};
const save = () => {
  // console.log("save", data);
  sendMessage (
    MessageTypes.SET_TOKENS,
    data.map(({ id, name, tokens }) => ({ id, name, tokens }))
  );
};
const sendMessage = (type: MessageTypes | String, message: String | object = "") => parent.postMessage(
  {
    pluginMessage: {
      type,
      message: JSON.stringify(message),
    },
  },
  "*"
);

export {
  fetch,
  getData,
  getGroup,
  getToken,
  setGroup,
  setToken,
  removeToken,
  save
};