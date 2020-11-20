import React, { useEffect, useRef } from "react";
import TokenItem from "./TokenItem";
import useAPI from 'hooks/useAPI';
import useData from "hooks/useData";
import useGroups from "hooks/useGroups";
import useTokens from "hooks/useTokens";
const TokenList = ({ group = null }) => {
    const { api: { admin } } = useAPI();
    const { saveGroups } = useData();
    const { addGroup } = useGroups();
    const { getToken } = useTokens();
    const tokens = group.tokens.map((id) => getToken(id));
    const $tokensContainerRef = useRef();
    const setSortable = () => {
        $($tokensContainerRef.current)
            .sortable({
            containment: "parent",
            placeholder: "ui-sortable-placeholder",
            handle: ".sortable-handler",
            axis: "y",
        })
            .on("sortupdate", function () {
            group.tokens = Array.from($tokensContainerRef.current.children).map((tokenItem) => tokenItem.id);
            setTimeout(() => {
                saveGroups(addGroup(group));
            }, 500);
        });
    };
    const unsetSortable = () => {
        if (tokens.length > 1) {
            $($tokensContainerRef.current).sortable('destroy');
        }
    };
    useEffect(() => {
        if (tokens.length > 1 && admin) {
            setSortable();
            return unsetSortable;
        }
    }, []);
    return (React.createElement("ul", { ref: $tokensContainerRef, className: "token-list" }, tokens.map((token) => {
        return (React.createElement(TokenItem, { key: token.id, token: token }));
    })));
};
export default TokenList;
