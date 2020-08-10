var MessageTypes;
(function (MessageTypes) {
    MessageTypes["GET_FONTS"] = "Get Fonts";
    MessageTypes["GET_MODES"] = "Get Modes";
    MessageTypes["GET_CURRENT_THEME_MODE"] = "Get Current Theme Mode";
    MessageTypes["GET_INIT_THEME_MODE"] = "Get Init Theme Mode";
    MessageTypes["SET_CURRENT_THEME_MODE"] = "Set Current Theme Mode";
    MessageTypes["SET_MODES"] = "Set Modes";
    MessageTypes["GET_TOKENS"] = "Get Tokens";
    MessageTypes["SET_TOKENS"] = "Set Tokens";
    MessageTypes["ASSIGN_TOKEN"] = "Assign Token";
    MessageTypes["SYNC_NODES"] = "Sync Nodes";
    MessageTypes["SELECTION_CHANGE"] = "Selection Change";
})(MessageTypes || (MessageTypes = {}));
export default MessageTypes;
