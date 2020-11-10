import React, { FC, ReactElement, useEffect, useState } from "react";
import TokenAction from './TokenAction';
import PropertyIcon from './property-components/PropertyIcon';
import { sendMessage } from 'model/DataManager';
import Token from 'model/Token';
import useAPI from 'hooks/useAPI';
import useProperties from 'hooks/useProperties';
import MessageTypes from 'enums/MessageTypes';

type T_TokenItem = {
  token: Token;
};
const TokenItem: FC<T_TokenItem> = ({
  token,
}: T_TokenItem): ReactElement => {
  const { api: { admin } } = useAPI();
  const { id, name, properties } = token;
  const [ contextmenu, setContextmenu ] = useState(false);
  const { getProperty } = useProperties();
  const propertyIconOptions = properties.map((prop) => getProperty(prop));


  const contextMenuHandler = (e) => {
    if (!admin) return;
    setContextmenu(true);
  }
  const mouseLeaveHandler = (e) => {
    if (!admin) return;
    setContextmenu(false);
  }
  const assignTokenHandler = (e) => {
    sendMessage(MessageTypes.ASSIGN_TOKEN, token);
  }
  
  return (
    <li id={id} className="token-item" onContextMenu={contextMenuHandler} onMouseLeave={mouseLeaveHandler} onClick={assignTokenHandler}>
      <span className="sortable-handler"></span>
      <PropertyIcon
        options={propertyIconOptions}
        fromTokenList={true}
      ></PropertyIcon>
      <span className="token-key">{name}</span>
      <TokenAction token={token} showDropdown={contextmenu} setShowDropdown={setContextmenu}></TokenAction>
    </li>
  );
};

export default TokenItem;