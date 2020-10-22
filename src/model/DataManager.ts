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
  
  // sendMessage(MessageTypes.GET_FONTS);
  // sendMessage(MessageTypes.GET_VERSIONS);
  // sendMessage(MessageTypes.GET_MODES);
  // sendMessage(MessageTypes.GET_INIT_THEME_MODE);
  // sendMessage(MessageTypes.GET_TOKENS);
};


const initialize = function (data) {
  // console.log(data);
  // console.log(APIKey, collectionID, tokensBinID, VersionsBinID, isAdmin);

  // initThemeMode(data.themeMode);
  
  // useThemeModes();
  // sendMessage(
  //   MessageTypes.SET_API,
  //   {
  //     'api-key': APIKey,
  //     'collection-id': collectionID,
  //     'tokens-bin-id': tokensBinID,
  //     'versions-bin-id': VersionsBinID,
  //     'admin': isAdmin
  //   }
  // );
}
function initThemeMode (modes: Array<ThemeMode> | undefined) {
  // let hasDefault = true;
  // if (!modes) {
  //   hasDefault = false;
  //   modes = [new ThemeMode()];
  // }
  // modes.forEach((mode: ThemeMode) => {
  //   // const $themeMode = Renderer.themeMode();
  //   // const { data } = $themeMode.data();
  //   setThemeMode(new ThemeMode(mode));
  // });
  // if (!hasDefault) {
  //   saveThemeMode();
  // }
  // Renderer.themeModes();
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
// const setAPI = async (key, binID, password?) => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'secret-key': null
//     },
//     body: null
//   };
//   let response;

//   if (key) {
//     APIKey = key;
//     options.headers['secret-key'] = key;
//     if (binID) {
//       let data;
//       response = fetch(`${JSONBIN_URL}/b/${binID}`, options)
//         .then(res => res.json())
//         .then(res => {
//           if (res.message === undefined) {
//             data = res.data;
//             tokensBinID = binID;
//             collectionID = res['collection-id'];
//             VersionsBinID = res['versions-bin-id'];
//           } else {
//             return Promise.reject({
//               message: res.message,
//             });
//           }
//           if (password) {
//             return fetch(`${JSONBIN_URL}/b/${res['admin-id']}`, options)
//               .then(res => res.json())
//               .then(res => {
//                 if (res.password === password) {
//                   isAdmin = true;
//                   initialize(data);
//                   return Promise.resolve({
//                     id: binID,
//                     admin: true,
//                     success: true
//                   });
//                 } 
//                 return Promise.reject({
//                   message: 'Invalid password'
//                 });
//               });
//           } else {
//             if (password === '') isAdmin = false;
//             if (isAdmin) {
//               initialize(data);
//               return Promise.resolve({
//                 id: binID,
//                 admin: true,
//                 success: true
//               });
//             } else {
//               return fetch(`${JSONBIN_URL}/b/${VersionsBinID}`, options)
//                 .then(res => res.json())
//                 .then(res => {
//                   if (res['last-version'] === 0) {
//                     data = {};
//                     initialize(data);
//                     return Promise.resolve({
//                       id: binID,
//                       admin: false,
//                       success: true
//                     });
//                   }
//                 });
//             }
//           }
//         });
//     } else {
//       // Create Collection
//       options.headers['Content-Type'] = 'application/json';
//       options.method = 'POST';
//       options.body = JSON.stringify({ name: 'Tonic Design Tokens (Collection)' })
//       response = fetch(`${JSONBIN_URL}/c`, options)
//         .then(res => res.json())
//         .then(res => {
//           if (res.success) {
//             collectionID = res.id;
//             options.headers['private'] = 'true';
//             options.headers['name'] = 'Tonic Design Tokens (Versions)';
//             options.headers['collection-id'] = res.id;
//             options.body = JSON.stringify({ 'last-version': 0, versions: {} });
//             const versions = fetch(`${JSONBIN_URL}/b`, options);

//             options.headers['name'] = 'Tonic Design Tokens (Admin)';
//             options.body = JSON.stringify({ password });
//             const admin = fetch(`${JSONBIN_URL}/b`, options);
//             return Promise.all([versions, admin]);
//           }
//           return Promise.reject({ message: res.message });
//         })
//         .then(([versions, admin]) => Promise.all([versions.json(), admin.json()]))
//         .then(([versions, admin]) => {
//           if (versions.success, admin.success) {
//             VersionsBinID = versions.id;
//             options.headers['name'] = 'Tonic Design Tokens';
//             options.body = JSON.stringify({
//               'collection-id': collectionID,
//               'admin-id': admin.id, //remove it once the collection api is back!!
//               'last-version': 0,
//               'versions-bin-id': versions.id,
//               'data': {}
//             });
//             return fetch(`${JSONBIN_URL}/b`, options)
//               .then(res => res.json())
//               .then(res => {
//                 if (res.success) {
//                   tokensBinID = res.id;
//                   isAdmin = true;
//                   initialize(res.data.data);
//                   return Promise.resolve({
//                     id: res.id,
//                     admin: true,
//                     success: res.success
//                   });
//                 }
//                 return Promise.reject(false);
//               })
//           }
//           return Promise.reject(false);
//         });
//     }
//   }
//   return response;
// }
const saveThemeMode = () => {
  sendMessage(
    MessageTypes.SET_MODES,
    themeModes
  );
}
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

const getCurrentThemeMode = () => currentThemeMode;
const getVersion = function (id?) { return arguments.length ? versionMap[id] : versions; }

const removeThemeMode = mode => {
  delete themeModeMap[mode.id];
  const index = themeModes.findIndex((_mode: ThemeMode) => _mode.id === mode.id);
  themeModes.splice(index, 1);
}
const setCurrentThemeMode = themeMode => {
  currentThemeMode = themeMode;
  sendMessage(
    MessageTypes.SET_CURRENT_THEME_MODE,
    themeMode
  );
}
const setFonts = _fonts => {
  fonts = _fonts;
};
const setProperty = property => propertiesMap[property.id] = property;
const save = () => {
  sendMessage(
    MessageTypes.SET_TOKENS,
    _cloneDeep(groups)
  );
};
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
const syncToken = (token: Token) => {
  const refer: any = token.properties[0];
  // getProperty().forEach((property: any) => {
  //   const hostToken = getToken(property.parent);
  //   if (property.useToken === token.id) {
  //     if (property.type === PropertyTypes.CORNER_RADIUS) {
  //       property.topLeft = refer.topLeft;
  //       property.topRight = refer.topRight;
  //       property.bottomRight = refer.bottomRight;
  //       property.bottomLeft = refer.bottomLeft;
  //       property.radius = refer.radius;
  //     }
  //     if (property.type === PropertyTypes.STROKE_WIDTH_ALIGN) {
  //       property.align = refer.align;
  //       property.width = refer.width;
  //     }
  //     if (property.type === PropertyTypes.FILL_COLOR) {
  //       property.blendMode = refer.blendMode;
  //       property.color = refer.color;
  //       property.fillType = refer.fillType;
  //       property.opacity = refer.opacity;
  //       property.visible = refer.visible;
  //     } 
  //     if (hostToken.properties.length === 1) syncToken(hostToken);
  //   }
  // });
};
const syncPageThemeMode = () => {
  sendMessage(
    MessageTypes.SYNC_CURRENT_THEME_MODE
  );
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
  getCurrentThemeMode,
  getFonts,
  // getGroup,
  // getToken,

  // setAPI,
  setVersion,
  // setThemeMode,
  setCurrentThemeMode,
  removeThemeMode,
  setFonts,
  // setGroup,
  // setToken,
  setProperty,
  save,
  saveThemeMode,
  saveVersion,
  syncToken,
  // syncNode,
  syncPageThemeMode,
  restore,
  referByToken,
  sendMessage
};