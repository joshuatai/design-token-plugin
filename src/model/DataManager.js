import MessageTypes from 'enums/MessageTypes';
import PropertyTypes from 'enums/PropertyTypes';
export const JSONBIN_URL = `https://api.jsonbin.io`;
const versions = [];
const themeModes = [];
const groups = [];
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
const getVersion = function (id) { return arguments.length ? versionMap[id] : versions; };
const setVersion = (version) => {
    versions.push(version);
    versionMap[version.id] = version;
};
const saveVersion = () => {
    // sendMessage(
    //   MessageTypes.SET_VERSION,
    //   versions
    // );
};
const restore = (id) => {
    sendMessage(MessageTypes.RESTRORE_VERSION, id);
};
const sendMessage = (type, message = "") => parent.postMessage({
    pluginMessage: {
        type,
        message: typeof message === 'string' ? message : JSON.stringify(message),
    },
}, "*");
export { fetchInitial, getVersion, getFonts, setVersion, saveVersion, restore, sendMessage };
