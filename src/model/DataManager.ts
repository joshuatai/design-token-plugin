import _cloneDeep from 'lodash/cloneDeep';
import MessageTypes from 'enums/MessageTypes';
import PropertyTypes from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';
import ThemeMode from './ThemeMode';
import Group from './Group';
import Token from './Token';
import Version from './Version';

export const JSONBIN_URL = `https://api.jsonbin.io`;
const versions: Array<Version> = [];
const themeModes: Array<ThemeMode> = [];
const groups: Array<Group> = [];
const versionMap = {};
const themeModeMap = {};
const groupMap = {};
const tokenMap = {};
let APIKey;
let collectionID;
let tokensBinID;
let VersionsBinID;
let isAdmin = false;
let saveData;
let fonts = {};
let propertiesMap = {};
let currentThemeMode;

const pureToken = Object.keys(PropertyTypes).reduce((calc, type) => (calc[PropertyTypes[type]] = {}, calc), {});
const getFonts = () => fonts;
const fetchInitial = () => {
  
  // sendMessage(MessageTypes.GET_VERSIONS);
  // sendMessage(MessageTypes.GET_INIT_THEME_MODE);
};


const initialize = function (data) {
  // console.log(data);
  // console.log(APIKey, collectionID, tokensBinID, VersionsBinID, isAdmin);

  
  
  // useThemeModes();
}


const getAPI = function () { 
  // return {
  //   'api-key': APIKey,
  //   'tokens-id': tokensBinID,
  //   'collection-id': collectionID,
  //   'versions-id': VersionsBinID,
  //   'admin-id': adminBinID,
  //   'admin': isAdmin
  // }
};

const onMessageReceived = (event) => {
  // const msg = event.data.pluginMessage;
  // if (msg.type === MessageTypes.GET_API) {
  //   const settings = msg.message;
  //   APIKey = settings['api-key'];
  //   tokensBinID = settings['tokens-bin-id'];
  //   VersionsBinID = settings['versions-bin-id'];
  //   isAdmin = settings['admin'];
  // }
}
window.addEventListener("message", onMessageReceived, false);

const getVersion = function (id?) { return arguments.length ? versionMap[id] : versions; }

const removeThemeMode = mode => {
  delete themeModeMap[mode.id];
  const index = themeModes.findIndex((_mode: ThemeMode) => _mode.id === mode.id);
  themeModes.splice(index, 1);
}
// const setCurrentThemeMode = themeMode => {
//   currentThemeMode = themeMode;
//   sendMessage(
//     MessageTypes.SET_CURRENT_THEME_MODE,
//     themeMode
//   );
// }
const setProperty = property => propertiesMap[property.id] = property;

const setVersion = (version: Version) => {
  versions.push(version);
  versionMap[version.id] = version;
};
const saveVersion = () => {
  // sendMessage(
  //   MessageTypes.SET_VERSION,
  //   versions
  // );
}
const restore = (id) => {
  
  sendMessage(
    MessageTypes.RESTRORE_VERSION,
    id
  );
};
const referByToken = (token: Token): Array<Token> => null
//   getProperty()
//     .filter((property: any) => property.useToken === token.id)
//     .map((property: any) => getToken(property.parent));
// const syncNode = (token: Token) => {
//   sendMessage(
//     MessageTypes.SYNC_NODES,
//     token
//   );
// };
const sendMessage = (type: MessageTypes | string, message: string | object = "") => parent.postMessage(
  {
    pluginMessage: {
      type,
      message: typeof message === 'string' ?  message : JSON.stringify(message),
    },
  },
  "*"
);

export {
  // checkApiKey,
  getAPI,
  fetchInitial,
  getVersion,
  // getThemeMode,
  getFonts,
  // getGroup,
  // getToken,

  setVersion,
  // setThemeMode,
  // setCurrentThemeMode,
  removeThemeMode,
  // setGroup,
  // setToken,
  setProperty,
  saveVersion,
  // syncNode,
  restore,
  referByToken,
  sendMessage
};