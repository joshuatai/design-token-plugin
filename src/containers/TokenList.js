import React, { useEffect, useRef } from "react";
import TokenItem from "./TokenItem";
import useData from "hooks/useData";
import useGroups from "hooks/useGroups";
import useTokens from "hooks/useTokens";
const TokenList = ({ group = null }) => {
    const { saveGroups } = useData();
    const { addGroup } = useGroups();
    const { getToken } = useTokens();
    const tokens = group.tokens.map((id) => getToken(id));
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
        return (React.createElement(TokenItem, { key: token.id, token: token }));
    })));
};
export default TokenList;
