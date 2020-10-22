import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import Group from "model/Group";
import Token from "model/Token";
import Properties from "model/Properties";
import Property from "model/Property";
import useAPI from "hooks/useAPI";
import useData from "hooks/useData";
import useGroups from "hooks/useGroups";
import useTokens from "hooks/useTokens";
import useProperties from "hooks/useProperties";
import useTokenSetting from "hooks/useTokenSetting";
import usePropertySetting from "hooks/usePropertySetting";
import preventEvent from "utils/preventEvent";
import TokenActionEntry from "enums/TokenActionEntry";

type T_TokenAction = {
  token: Token;
  showDropdown: boolean;
  setShowDropdown;
};
const TokenAction: FC<T_TokenAction> = ({
  token,
  showDropdown = false,
  setShowDropdown = null,
}: T_TokenAction): ReactElement => {
  const {
    api: { admin },
  } = useAPI();
  const { saveTokensProperties } = useData();
  const { setTokenSetting } = useTokenSetting();
  const { setPropertiesSetting } = usePropertySetting();
  const { getGroup, addGroup } = useGroups();
  const { removeToken, addToken } = useTokens();
  const [entry, setEntry] = useState(TokenActionEntry.GROUP_LIST);
  const {
    properties,
    getProperty,
    addProperties,
    referedTokens,
    setAllProperties,
  } = useProperties();
  const $tokenActionRef = useRef();
  const tokenLinks = referedTokens(token.id).flat();

  const editHandler = (e) => {
    const _properties = token.properties.map((propId) => {
      const property = properties.find((prop) => prop.id === propId);
      return new Properties[property.type](property);
    });
    setPropertiesSetting(_properties);
    setTokenSetting({
      group: getGroup(token.parent) as Group,
      token: new Token(token),
    });
    preventEvent(e);
  };
  const removeHandler = () => {
    if (!admin) return;
    const _group = getGroup(token.parent) as Group;
    const _removeProperties = token.properties;
    const index = _group.tokens.indexOf(token.id);
    if (index > -1) _group.tokens.splice(index, 1);

    let _groups = addGroup(_group);
    let _tokens = removeToken(token);
    let _properties = properties.slice();

    _removeProperties.forEach((_propId) => {
      const index = _properties.findIndex((_prop) => _prop.id === _propId);
      if (index > -1) _properties.splice(index, 1);
    });
    setAllProperties(_properties);
    saveTokensProperties(_groups, _tokens, _properties);
  };
  const cloneHandler = () => {
    const { key, name, description, parent, properties, propertyType } = token;
    const group: Group = getGroup(parent) as Group;
    const newProperties = properties.map((_propId) => {
      const _property = Object.assign({}, getProperty(_propId) as Property);
      delete _property.id;
      return new Properties[_property._type](_property);
    });
    const cloneToken = new Token({
      key,
      name: `${name}-copy`,
      description,
      parent,
      properties: newProperties.map((_prop) => _prop.id),
      propertyType,
    });
    group.tokens.push(cloneToken.id);
    setShowDropdown(false);
    saveTokensProperties(
      addGroup(group),
      addToken(cloneToken),
      addProperties(newProperties)
    )
      .then((res) => {})
      .catch();
  };
  const deleteTokenProps = {
    className: "delete-token",
    onClick: removeHandler,
  };
  if (tokenLinks.length) {
    delete deleteTokenProps.onClick;
    Object.assign(deleteTokenProps, {
      className: "delete-token disabled",
      title: `The token: ${
        token.name
      } has been linked by token: ${tokenLinks
        .map((token: Token) => token.name)
        .join(", ")}`,
    });
  }

  useEffect(() => {
    const container = ($tokenActionRef.current as HTMLElement).closest(
      "#design-tokens-container"
    );
    setEntry(
      container ? TokenActionEntry.GROUP_LIST : TokenActionEntry.ASSIGNED_LIST
    );
  }, []);

  return (
    <div
      ref={$tokenActionRef}
      className={
        showDropdown
          ? "token-action-wrapper dropdown open"
          : "token-action-wrapper dropdown"
      }
    >
      <button type="button" className="token-edit-btn" onClick={editHandler}>
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
        {entry === TokenActionEntry.GROUP_LIST ? (
          <>
            <li className="clone-token" onClick={cloneHandler}>
              <a href="#">Clone token</a>
            </li>
            <li {...deleteTokenProps}>
              <a href="#">Delete Token</a>
            </li>
          </>
        ) : (
          <li className="unassign-token">
            <a href="#">Unassign token</a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default TokenAction;
