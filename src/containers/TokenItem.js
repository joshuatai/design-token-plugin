import React, { useState } from "react";
import TokenAction from "./TokenAction";
import PropertyIcon from "./property-components/PropertyIcon";
import { sendMessage } from "model/DataManager";
import useAPI from "hooks/useAPI";
import useProperties from "hooks/useProperties";
import usePropertyInfo from "hooks/usePropertyInfo";
import MessageTypes from "enums/MessageTypes";
import TokenActionEntry from "enums/TokenActionEntry";
import { Mixed } from "symbols/index";
const TokenItem = ({ token, from = TokenActionEntry.TOKEN_LIST, }) => {
    const { api: { admin }, } = useAPI();
    const { id, name, properties, propertyType } = token;
    const [contextmenu, setContextmenu] = useState(false);
    const { getProperty } = useProperties();
    const propertyIconOptions = properties.map((prop) => getProperty(prop));
    const { type } = usePropertyInfo(propertyIconOptions, true);
    const contextMenuHandler = (e) => {
        if (!admin)
            return;
        setContextmenu(true);
    };
    const mouseLeaveHandler = (e) => {
        if (!admin)
            return;
        setContextmenu(false);
    };
    const assignTokenHandler = (e) => {
        if (from === TokenActionEntry.ASSIGNED_LIST)
            return;
        sendMessage(MessageTypes.ASSIGN_TOKEN, token);
    };
    return type ? (React.createElement("li", { id: id, className: "token-item", onContextMenu: contextMenuHandler, onMouseLeave: mouseLeaveHandler, onClick: assignTokenHandler },
        React.createElement("span", { className: "sortable-handler" }),
        propertyType !== Mixed && (React.createElement(PropertyIcon, { options: propertyIconOptions, fromTokenList: true })),
        React.createElement("span", { className: "token-key" }, name),
        React.createElement(TokenAction, { token: token, showDropdown: contextmenu, setShowDropdown: setContextmenu, from: from }))) : null;
};
export default TokenItem;
