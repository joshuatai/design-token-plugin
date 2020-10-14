import React, { useEffect, useRef } from "react";
import useTokens from 'hooks/useTokens';
import useProperties from 'hooks/useProperties';
import useTokenSetting from 'hooks/useTokenSetting';
import usePropertySetting from 'hooks/usePropertySetting';
import preventEvent from 'utils/preventEvent';
const TokenAction = ({ group, token }) => {
    const { setTokenSetting } = useTokenSetting();
    const { setPropertiesSetting } = usePropertySetting();
    const { properties } = useProperties();
    const tokenEditHandler = (e) => {
        const _properties = token.properties.map(propId => properties.find(prop => prop.id === propId));
        setPropertiesSetting(_properties);
        setTokenSetting({
            group,
            token
        });
        preventEvent(e);
    };
    return React.createElement("div", { className: "token-action-wrapper dropdown" },
        React.createElement("button", { type: "button", className: "token-edit-btn", onClick: tokenEditHandler },
            React.createElement("svg", { className: "svg", width: "12", height: "14", viewBox: "0 0 12 14", xmlns: "http://www.w3.org/2000/svg" },
                React.createElement("path", { d: "M2 7.05V0h1v7.05c1.141.232 2 1.24 2 2.45 0 1.21-.859 2.218-2 2.45V14H2v-2.05c-1.141-.232-2-1.24-2-2.45 0-1.21.859-2.218 2-2.45zM4 9.5c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5C1 8.672 1.672 8 2.5 8 3.328 8 4 8.672 4 9.5zM9 14h1V6.95c1.141-.232 2-1.24 2-2.45 0-1.21-.859-2.218-2-2.45V0H9v2.05c-1.141.232-2 1.24-2 2.45 0 1.21.859 2.218 2 2.45V14zm2-9.5c0-.828-.672-1.5-1.5-1.5C8.672 3 8 3.672 8 4.5 8 5.328 8.672 6 9.5 6c.828 0 1.5-.672 1.5-1.5z", fillRule: "evenodd", fillOpacity: "1", fill: "#000", stroke: "none" }))),
        React.createElement("ul", { className: "dropdown-menu pull-right " },
            React.createElement("li", { className: "clone-token" },
                React.createElement("a", { href: "#" }, "Clone token")),
            React.createElement("li", { className: "delete-token" },
                React.createElement("a", { href: "#" }, "Delete Token")),
            React.createElement("li", { className: "unassign-token" },
                React.createElement("a", { href: "#" }, "Unassign token"))));
};
const TokenItem = ({ group, token }) => {
    const { id, name } = token;
    return React.createElement("li", { id: id, className: "token-item" },
        React.createElement("span", { className: "sortable-handler" }),
        React.createElement("span", { className: "token-key" }, name),
        React.createElement(TokenAction, { group: group, token: token }));
};
const TokenList = ({ group = null }) => {
    const { getToken } = useTokens();
    // console.log(group.tokens);
    const tokens = group.tokens.map(id => getToken(id));
    const tokensContainerRef = useRef();
    useEffect(() => {
        if (tokens.length > 1) {
            $(tokensContainerRef.current).sortable({
                containment: "parent",
                placeholder: 'ui-sortable-placeholder',
                handle: '.sortable-handler',
                axis: "y"
            });
        }
    });
    // console.log(tokens);
    return React.createElement("ul", { ref: tokensContainerRef, className: "token-list" }, tokens.map((token) => {
        return React.createElement(TokenItem, { key: token.id, group: group, token: token });
    }));
};
export default TokenList;
