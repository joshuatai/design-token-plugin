import React, { useState } from "react";
import TokenAction from './TokenAction';
import PropertyIcon from './property-components/PropertyIcon';
import { sendMessage } from 'model/DataManager';
import useAPI from 'hooks/useAPI';
import useProperties from 'hooks/useProperties';
import MessageTypes from 'enums/MessageTypes';
const TokenItem = ({ token, }) => {
    const { api: { admin } } = useAPI();
    const { id, name, properties } = token;
    const [contextmenu, setContextmenu] = useState(false);
    const { getProperty } = useProperties();
    const propertyIconOptions = properties.map((prop) => getProperty(prop));
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
        sendMessage(MessageTypes.ASSIGN_TOKEN, token);
    };
    return (React.createElement("li", { id: id, className: "token-item", onContextMenu: contextMenuHandler, onMouseLeave: mouseLeaveHandler, onClick: assignTokenHandler },
        React.createElement("span", { className: "sortable-handler" }),
        React.createElement(PropertyIcon, { options: propertyIconOptions, fromTokenList: true }),
        React.createElement("span", { className: "token-key" }, name),
        React.createElement(TokenAction, { token: token, showDropdown: contextmenu, setShowDropdown: setContextmenu })));
};
export default TokenItem;
