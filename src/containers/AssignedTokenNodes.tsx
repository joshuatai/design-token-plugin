import React, { useEffect, FC, ReactElement } from "react";
import useTokens from "hooks/useTokens";
import useProperties from "hooks/useProperties";
import Token from "model/Token";
import { Mixed } from "symbols/index";
import PropertyIcon from "./property-components/PropertyIcon";

type T_AssignedTokenNodes = {
  data: Array<any>;
};

const AssignedTokenNodes: FC<T_AssignedTokenNodes> = ({
  data,
}: T_AssignedTokenNodes): ReactElement => {
  const { getToken } = useTokens();
  const { getProperties } = useProperties();

  useEffect(() => {
    $('.assignedTokenNode .sortable').sortable({
      placeholder: "ui-sortable-placeholder",
      handle: ".sortable-handler",
      axis: "y"
    })
  });

  return (
    <>
      {data.map((node) => {
        let { id, name, useTokens } = node;
        const _id = id.replace(":", "-");

        return (
          <div
            key={_id}
            id={_id}
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
                  useTokens.map((_token) => {
                    const token: Token = getToken(_token) as Token;
                    return (
                      <li
                        key={`assignedTokenItem-${_id}-${token.id}`}
                        className="token-item"
                      >
                        <span className="sortable-handler"></span>
                        {token.propertyType !== Mixed && (
                          <PropertyIcon
                            options={getProperties(token.properties)}
                            disabled={true}
                            fromTokenList={true}
                          ></PropertyIcon>
                        )}
                        <span className="token-key">{token.name}</span>
                      </li>
                    );
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
    </>
  );
};

export default AssignedTokenNodes;
