import React, { useEffect, FC, useRef, ReactElement } from "react";
import TokenItem from "./TokenItem";
import Group from "model/Group";
import Token from "model/Token";
import useData from "hooks/useData";
import useTokens from "hooks/useTokens";
import useGroup from "hooks/useGroups";

type T_TokenList = {
  group: Group;
};
const TokenList: FC<T_TokenList> = ({
  group = null,
}: T_TokenList): ReactElement => {
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
          group.tokens = Array.from(
            ($tokensContainerRef.current as HTMLElement).children
          ).map((tokenItem: HTMLElement) => tokenItem.id);
          saveGroups(addGroup(group));
        });
    }
  });

  return (
    <ul ref={$tokensContainerRef} className="token-list">
      {tokens.map((token: Token) => {
        return (
          <TokenItem key={token.id} group={group} token={token}></TokenItem>
        );
      })}
    </ul>
  );
};

export default TokenList;
