import React, { FC, ReactElement, useEffect, useState } from "react";
import PropertyIcon from './property-components/PropertyIcon';
import Group from 'model/Group';
import Token from 'model/Token';
import Properties from 'model/Properties';
import useAPI from 'hooks/useAPI';
import useProperties from 'hooks/useProperties';
import useTokenSetting from 'hooks/useTokenSetting';
import usePropertySetting from 'hooks/usePropertySetting';
import preventEvent from 'utils/preventEvent';

type T_TokenAction = {
  group: Group;
  token: Token;
  showDropdwon: boolean;
};
const TokenAction: FC<T_TokenAction> = ({
  group,
  token,
  showDropdwon = false
}: T_TokenAction): ReactElement => {
  const { setTokenSetting } = useTokenSetting();
  const { setPropertiesSetting } = usePropertySetting();
  const { properties } = useProperties();
  const tokenEditHandler = (e) => {
    const _properties = token.properties.map((propId) => {
      const property = properties.find((prop) => prop.id === propId);
      return new Properties[property.type](property);
    });
    setPropertiesSetting(_properties);
    setTokenSetting({
      group,
      token: new Token(token),
    });
    preventEvent(e);
  };

  return (
    <div className={ showDropdwon ? 'token-action-wrapper dropdown open' : 'token-action-wrapper dropdown' }>
      <button
        type="button"
        className="token-edit-btn"
        onClick={tokenEditHandler}
      >
        <svg
          className="svg"
          width="12"
          height="14"
          viewBox="0 0 12 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 7.05V0h1v7.05c1.141.232 2 1.24 2 2.45 0 1.21-.859 2.218-2 2.45V14H2v-2.05c-1.141-.232-2-1.24-2-2.45 0-1.21.859-2.218 2-2.45zM4 9.5c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5C1 8.672 1.672 8 2.5 8 3.328 8 4 8.672 4 9.5zM9 14h1V6.95c1.141-.232 2-1.24 2-2.45 0-1.21-.859-2.218-2-2.45V0H9v2.05c-1.141.232-2 1.24-2 2.45 0 1.21.859 2.218 2 2.45V14zm2-9.5c0-.828-.672-1.5-1.5-1.5C8.672 3 8 3.672 8 4.5 8 5.328 8.672 6 9.5 6c.828 0 1.5-.672 1.5-1.5z"
            fillRule="evenodd"
            fillOpacity="1"
            fill="#000"
            stroke="none"
          ></path>
        </svg>
      </button>
      <ul className="dropdown-menu pull-right ">
        <li className="clone-token">
          <a href="#">Clone token</a>
        </li>
        <li className="delete-token">
          <a href="#">Delete Token</a>
        </li>
        <li className="unassign-token">
          <a href="#">Unassign token</a>
        </li>
      </ul>
    </div>
  );
};

type T_TokenItem = {
  group: Group;
  token: Token;
};
const TokenItem: FC<T_TokenItem> = ({
  group,
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

  useEffect(() => {

  }, []);

  return (
    <li id={id} className="token-item" onContextMenu={contextMenuHandler} onMouseLeave={mouseLeaveHandler}>
      <span className="sortable-handler"></span>
      <PropertyIcon
        options={propertyIconOptions}
        fromTokenList={true}
      ></PropertyIcon>
      <span className="token-key">{name}</span>
      <TokenAction group={group} token={token} showDropdwon={contextmenu}></TokenAction>
    </li>
  );
};

export default TokenItem;