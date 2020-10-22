import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import Group from 'model/Group';
import Token from 'model/Token';

export type T_TokenSetting = {
  group: Group,
  token: Token
}
export const initialTokenSetting: T_TokenSetting = {
  group: null,
  token: null
};
const initialTokenSettingSetter = {
  setTokenSetting: null,
};
export const tokenSettingContext = React.createContext(initialTokenSetting);
export const tokenSettingSetterContext = React.createContext(initialTokenSettingSetter);
const TokenSettingProvider = ({ value = initialTokenSetting, children }) => {
  const [ tokenSetting, setTokenSetting ] = useState(value);
  const tokenSettingSetterRef = useRef({
    setTokenSetting
  });
  return (
    <tokenSettingContext.Provider value={tokenSetting}>
      <tokenSettingSetterContext.Provider value={tokenSettingSetterRef.current}>
        {children}
      </tokenSettingSetterContext.Provider>
    </tokenSettingContext.Provider>
  );
};

TokenSettingProvider.propTypes = {
  value: PropTypes.object
};
TokenSettingProvider.displayName = "TokenSettingProvider";

export default TokenSettingProvider;
