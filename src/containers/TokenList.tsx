import React, { useEffect, FC, useRef, ReactElement } from "react";
import TokenItem from "./TokenItem";
import Group from "model/Group";
import Token from "model/Token";
import useData from "hooks/useData";
import useGroups from "hooks/useGroups";
import useTokens from "hooks/useTokens";

type T_TokenList = {
  group: Group
};
const TokenList: FC<T_TokenList> = ({
  group = null
}: T_TokenList): ReactElement => {
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
        group.tokens = Array.from(
          ($tokensContainerRef.current as HTMLElement).children
        ).map((tokenItem: HTMLElement) => tokenItem.id);
        setTimeout(() => {
          saveGroups(addGroup(group));
        }, 500);
      });
  }
  const unsetSortable = () => {
    if (tokens.length > 1) {
      $($tokensContainerRef.current).sortable('destroy');
    }
  }
  useEffect(() => {
    if (tokens.length > 1) {
      setSortable();
    }
    return unsetSortable;
  }, []);

  return (
    <ul ref={$tokensContainerRef} className="token-list">
      {tokens.map((token: Token) => {
        return (
          <TokenItem key={token.id} token={token}></TokenItem>
        );
      })}
    </ul>
  );
};

export default TokenList;
