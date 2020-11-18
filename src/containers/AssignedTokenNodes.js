import React, { useEffect, useRef } from "react";
import useTokens from "hooks/useTokens";
import useProperties from "hooks/useProperties";
import { sendMessage } from 'model/DataManager';
import TokenItem from './TokenItem';
import MessageTypes from 'enums/MessageTypes';
import TokenActionEntry from 'enums/TokenActionEntry';
const AssignedTokenNodes = ({ data, }) => {
    const { getToken } = useTokens();
    const { getProperties } = useProperties();
    const $sortableRef = useRef(null);
    const setSortable = () => {
        $sortableRef.current
            .sortable({
            placeholder: "ui-sortable-placeholder",
            handle: ".sortable-handler",
            axis: "y"
        })
            .on("sortupdate", function (e, ui) {
            const $sortedItem = ui.item[0];
            const $sortableContainer = $sortedItem.parentElement;
            const $node = $sortableContainer.closest('.assignedTokenNode');
            const tokens = Array.from($sortableContainer.children).map(($token) => $token.getAttribute('id'));
            sendMessage(MessageTypes.REORDER_ASSIGN_TOKEN, {
                nodeId: $node.dataset['id'].replace("-", ":"),
                tokens
            });
        });
    };
    const unsetSortable = () => {
        $sortableRef.current.sortable('destroy');
    };
    useEffect(() => {
        data;
        if (data.length === 0)
            return;
        $sortableRef.current = $('.assignedTokenNode .sortable');
        setSortable();
        return unsetSortable;
    }, [data]);
    return (React.createElement(React.Fragment, null, data.map((node) => {
        let { id, name, useTokens } = node;
        const _id = id.replace(":", "-");
        return (React.createElement("div", { key: _id, "data-id": _id, className: "assignedTokenNode selected-node panel panel-default panel-collapse-shown" },
            React.createElement("div", { className: "panel-heading node-item", "data-toggle": "collapse", "aria-expanded": "true", "data-target": `#node-${_id}` },
                React.createElement("h6", { className: "panel-title" },
                    React.createElement("span", { className: "tmicon tmicon-caret-right tmicon-hoverable" }),
                    React.createElement("span", { className: "node-name" }, name))),
            React.createElement("div", { id: `node-${_id}`, className: "panel-collapse collapse in", "aria-expanded": "true" },
                React.createElement("ul", { className: "token-list sortable" }, useTokens.length ? (useTokens.map(tokenId => {
                    const token = getToken(tokenId);
                    return token ? React.createElement(TokenItem, { key: `assignedTokenItem-${_id}-${token.id}`, token: token, from: TokenActionEntry.ASSIGNED_LIST }) : null;
                })) : (React.createElement("div", { className: "no-node-selected" }, "Please select a node that has assigned at least one token."))))));
    })));
};
export default AssignedTokenNodes;
