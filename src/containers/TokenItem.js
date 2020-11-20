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
    const propertyIconOptions = properties.map(propId => getProperty(propId));
    const { type } = usePropertyInfo(propertyIconOptions, true);
    const contextMenuHandler = (e) => {
        if (admin || (!admin && from === TokenActionEntry.ASSIGNED_LIST)) {
            setContextmenu(true);
        }
    };
    const mouseLeaveHandler = (e) => {
        setContextmenu(false);
    };
    const assignTokenHandler = (e) => {
        if (from === TokenActionEntry.ASSIGNED_LIST)
            return;
        sendMessage(MessageTypes.ASSIGN_TOKEN, token);
    };
    return type ? (React.createElement("li", { id: id, className: "token-item", onContextMenu: contextMenuHandler, onMouseLeave: mouseLeaveHandler, onClick: assignTokenHandler },
        admin && React.createElement("span", { className: "sortable-handler ui-sortable-handle" }),
        propertyType !== Mixed && (React.createElement(PropertyIcon, { options: propertyIconOptions, fromTokenList: true })),
        React.createElement("span", { className: "token-key" }, name),
        React.createElement(TokenAction, { token: token, showDropdown: contextmenu, setShowDropdown: setContextmenu, from: from }))) : null;
};
export default TokenItem;
