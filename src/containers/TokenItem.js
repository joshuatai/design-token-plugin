import React, { useState } from "react";
import TokenAction from './TokenAction';
import PropertyIcon from './property-components/PropertyIcon';
import useAPI from 'hooks/useAPI';
import useProperties from 'hooks/useProperties';
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
    return (React.createElement("li", { id: id, className: "token-item", onContextMenu: contextMenuHandler, onMouseLeave: mouseLeaveHandler },
        React.createElement("span", { className: "sortable-handler" }),
        React.createElement(PropertyIcon, { options: propertyIconOptions, fromTokenList: true }),
        React.createElement("span", { className: "token-key" }, name),
        React.createElement(TokenAction, { token: token, showDropdown: contextmenu, setShowDropdown: setContextmenu })));
};
export default TokenItem;
