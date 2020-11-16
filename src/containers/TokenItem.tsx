import React, { FC, ReactElement, useEffect, useState } from "react";
import TokenAction from "./TokenAction";
import PropertyIcon from "./property-components/PropertyIcon";
import { sendMessage } from "model/DataManager";
import Token from "model/Token";
import useAPI from "hooks/useAPI";
import useProperties from "hooks/useProperties";
import usePropertyInfo from "hooks/usePropertyInfo";
import MessageTypes from "enums/MessageTypes";
import TokenActionEntry from "enums/TokenActionEntry";
import { Mixed } from "symbols/index";

type T_TokenItem = {
  token: Token;
  from?: TokenActionEntry;
};
const TokenItem: FC<T_TokenItem> = ({
  token,
  from = TokenActionEntry.TOKEN_LIST,
}: T_TokenItem): ReactElement => {
  const {
    api: { admin },
  } = useAPI();
  const { id, name, properties, propertyType } = token;
  const [contextmenu, setContextmenu] = useState(false);
  const { getProperty } = useProperties();
  const propertyIconOptions = properties.map((prop) => getProperty(prop));
  const { type } = usePropertyInfo(propertyIconOptions, true);
  const contextMenuHandler = (e) => {
    if (!admin) return;
    setContextmenu(true);
  };
  const mouseLeaveHandler = (e) => {
    if (!admin) return;
    setContextmenu(false);
  };
  const assignTokenHandler = (e) => {
    if (from === TokenActionEntry.ASSIGNED_LIST) return;
    sendMessage(MessageTypes.ASSIGN_TOKEN, token);
  };
  
  return type ? (
    <li
      id={id}
      className="token-item"
      onContextMenu={contextMenuHandler}
      onMouseLeave={mouseLeaveHandler}
      onClick={assignTokenHandler}
    >
      <span className="sortable-handler"></span>
      {propertyType !== Mixed && (
        <PropertyIcon
          options={propertyIconOptions}
          fromTokenList={true}
        ></PropertyIcon>
      )}
      <span className="token-key">{name}</span>
      <TokenAction
        token={token}
        showDropdown={contextmenu}
        setShowDropdown={setContextmenu}
        from={from}
      ></TokenAction>
    </li>
  ) : null;
};

export default TokenItem;
