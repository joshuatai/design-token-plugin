import React, { useEffect } from "react";
import useTokens from "hooks/useTokens";
import useProperties from "hooks/useProperties";
import { Mixed } from "symbols/index";
import PropertyIcon from "./property-components/PropertyIcon";
const AssignedTokenNodes = ({ data, }) => {
    const { getToken } = useTokens();
    const { getProperties } = useProperties();
    useEffect(() => {
        $('.assignedTokenNode .sortable').sortable({
            placeholder: "ui-sortable-placeholder",
            handle: ".sortable-handler",
            axis: "y"
        });
    });
    return (React.createElement(React.Fragment, null, data.map((node) => {
        let { id, name, useTokens } = node;
        const _id = id.replace(":", "-");
        return (React.createElement("div", { key: _id, id: _id, className: "assignedTokenNode selected-node panel panel-default panel-collapse-shown" },
            React.createElement("div", { className: "panel-heading node-item", "data-toggle": "collapse", "aria-expanded": "true", "data-target": `#node-${_id}` },
                React.createElement("h6", { className: "panel-title" },
                    React.createElement("span", { className: "tmicon tmicon-caret-right tmicon-hoverable" }),
                    React.createElement("span", { className: "node-name" }, name))),
            React.createElement("div", { id: `node-${_id}`, className: "panel-collapse collapse in", "aria-expanded": "true" },
                React.createElement("ul", { className: "token-list sortable" }, useTokens.length ? (useTokens.map((_token) => {
                    const token = getToken(_token);
                    return (React.createElement("li", { key: `assignedTokenItem-${_id}-${token.id}`, className: "token-item" },
                        React.createElement("span", { className: "sortable-handler" }),
                        token.propertyType !== Mixed && (React.createElement(PropertyIcon, { options: getProperties(token.properties), disabled: true, fromTokenList: true })),
                        React.createElement("span", { className: "token-key" }, token.name)));
                })) : (React.createElement("div", { className: "no-node-selected" }, "Please select a node that has assigned at least one token."))))));
    })));
};
export default AssignedTokenNodes;
