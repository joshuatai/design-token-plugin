import React, { useEffect, FC, ReactElement, useRef } from "react";
import useAPI from 'hooks/useAPI';
import useTokens from "hooks/useTokens";
import useProperties from "hooks/useProperties";
import { sendMessage } from 'model/DataManager';
import Token from "model/Token";
import TokenItem from './TokenItem';
import MessageTypes from 'enums/MessageTypes';
import TokenActionEntry from 'enums/TokenActionEntry';

type T_AssignedTokenNodes = {
  data: Array<any>;
};

const AssignedTokenNodes: FC<T_AssignedTokenNodes> = ({
  data,
}: T_AssignedTokenNodes): ReactElement => {
  const { getToken } = useTokens();
  const $sortableRef = useRef(null);
  const setSortable = () => {
    $sortableRef.current
      .sortable({
        placeholder: "ui-sortable-placeholder",
        handle: ".sortable-handler",
        axis: "y"
      })
      .on("sortupdate", function (e, ui) {
        const $sortedItem: HTMLElement = ui.item[0];
        const $sortableContainer = $sortedItem.parentElement;
        const $node: HTMLElement = $sortableContainer.closest('.assignedTokenNode');
        const tokens: string[] = Array.from($sortableContainer.children).map(($token: HTMLElement) => $token.getAttribute('id'));
        sendMessage(MessageTypes.REORDER_ASSIGN_TOKEN , {
          nodeId: $node.dataset['id'].replace("-", ":"),
          tokens
        });
      });
  }
  const unsetSortable = () => {
    $sortableRef.current.sortable('destroy');
  }
  useEffect(() => {
    if (data.length === 0 ) return;
    $sortableRef.current = $('.assignedTokenNode .sortable');
    setSortable();
    return unsetSortable;
  }, [data]);

  return (
    <div id="assigned-tokens-node-list" className="plugin-panel panel-group panel-group-collapse panel-group-collapse-basic">
      {data.map((node) => {
        let { id, name, useTokens } = node;
        const _id = id.replace(":", "-");
        
        return (
          <div
            key={_id}
            data-id={_id}
            className="assignedTokenNode selected-node panel panel-default panel-collapse-shown"
          >
            <div
              className="panel-heading node-item"
              data-toggle="collapse"
              aria-expanded="true"
              data-target={`#node-${_id}`}
            >
              <h6 className="panel-title">
                <span className="tmicon tmicon-caret-right tmicon-hoverable"></span>
                <span className="node-name">{name}</span>
              </h6>
            </div>
            <div id={`node-${_id}`} className="panel-collapse collapse in" aria-expanded="true">
              <ul className="token-list sortable">
                {useTokens.length ? (
                  useTokens.map(tokenId => {
                    const token: Token = getToken(tokenId) as Token;
                    return token ? <TokenItem key={`assignedTokenItem-${_id}-${token.id}`} token={token} from={TokenActionEntry.ASSIGNED_LIST}></TokenItem> : null;
                  })
                ) : (
                  <div className="no-node-selected">
                    Please select a node that has assigned at least one token.
                  </div>
                )}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssignedTokenNodes;
