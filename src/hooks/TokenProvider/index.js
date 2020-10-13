import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialTokens = [];
const initialTokensSetter = {
    setTokens: null
};
const tokensContext = React.createContext(initialTokens);
const tokensSetterContext = React.createContext(initialTokensSetter);
const TokenProvider = ({ value = initialTokens, children }) => {
    const [tokens, setTokens] = useState(value);
    const tokensSetterRef = useRef({
        setTokens
    });
    return (React.createElement(tokensContext.Provider, { value: tokens },
        React.createElement(tokensSetterContext.Provider, { value: tokensSetterRef.current }, children)));
};
TokenProvider.propTypes = {
    value: PropTypes.array,
};
TokenProvider.displayName = "TokenProvider";
export default TokenProvider;
export { tokensContext, tokensSetterContext };
