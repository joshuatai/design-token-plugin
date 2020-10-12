import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import Token from 'model/Token';

export type T_TokenSetting = {
  groupId: String,
  groupName: String,
  token: Token
}
const initialTokenSetting: T_TokenSetting = {
  groupId: '',
  groupName: '',
  token: null
};
const initialTokenSettingSetter = {
  setTokenSetting: null
};
const tokenSettingContext = React.createContext(initialTokenSetting);
const tokenSettingSetterContext = React.createContext(initialTokenSettingSetter);
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
export { tokenSettingContext, tokenSettingSetterContext };
