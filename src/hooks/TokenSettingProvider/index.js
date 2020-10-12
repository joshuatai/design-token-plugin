import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialTokenSetting = {
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
    const [tokenSetting, setTokenSetting] = useState(value);
    const tokenSettingSetterRef = useRef({
        setTokenSetting
    });
    return (React.createElement(tokenSettingContext.Provider, { value: tokenSetting },
        React.createElement(tokenSettingSetterContext.Provider, { value: tokenSettingSetterRef.current }, children)));
};
TokenSettingProvider.propTypes = {
    value: PropTypes.object
};
TokenSettingProvider.displayName = "TokenSettingProvider";
export default TokenSettingProvider;
export { tokenSettingContext, tokenSettingSetterContext };
