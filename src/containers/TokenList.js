import React, { useEffect, useRef } from "react";
import TokenItem from "./TokenItem";
import useData from "hooks/useData";
import useTokens from "hooks/useTokens";
import useGroup from "hooks/useGroups";
const TokenList = ({ group = null, }) => {
    const { saveGroups } = useData();
    const { getToken } = useTokens();
    const tokens = group.tokens.map((id) => getToken(id));
    const { addGroup } = useGroup();
    const $tokensContainerRef = useRef();
    useEffect(() => {
        if (tokens.length > 1) {
            $($tokensContainerRef.current)
                .sortable({
                containment: "parent",
                placeholder: "ui-sortable-placeholder",
                handle: ".sortable-handler",
                axis: "y",
            })
                .on("sortupdate", function () {
                group.tokens = Array.from($tokensContainerRef.current.children).map((tokenItem) => tokenItem.id);
                saveGroups(addGroup(group));
            });
        }
    });
    return (React.createElement("ul", { ref: $tokensContainerRef, className: "token-list" }, tokens.map((token) => {
        return (React.createElement(TokenItem, { key: token.id, group: group, token: token }));
    })));
};
export default TokenList;
