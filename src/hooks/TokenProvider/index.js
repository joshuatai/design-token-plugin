import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialTokens = [];
const initialTokensSetter = {
    setTokens: null
};
const initialPurePropertyTokens = {};
const initialPurePropertyTokensSetter = {
    setPureTokens: null
};
const tokensContext = React.createContext(initialTokens);
const tokensSetterContext = React.createContext(initialTokensSetter);
const purePropertyTokensContext = React.createContext(initialPurePropertyTokens);
const purePropertyTokensSetterContext = React.createContext(initialPurePropertyTokensSetter);
const TokenProvider = ({ value = initialTokens, children }) => {
    const [tokens, setTokens] = useState(value);
    const [pureTokens, setPureTokens] = useState(initialPurePropertyTokens);
    const tokensSetterRef = useRef({
        setTokens
    });
    const purePropertyTokensSetterRef = useRef({
        setPureTokens
    });
    return (React.createElement(tokensContext.Provider, { value: tokens },
        React.createElement(tokensSetterContext.Provider, { value: tokensSetterRef.current },
            React.createElement(purePropertyTokensContext.Provider, { value: pureTokens },
                React.createElement(purePropertyTokensSetterContext.Provider, { value: purePropertyTokensSetterRef.current }, children)))));
};
TokenProvider.propTypes = {
    value: PropTypes.array,
};
TokenProvider.displayName = "TokenProvider";
export default TokenProvider;
export { tokensContext, tokensSetterContext, purePropertyTokensContext, purePropertyTokensSetterContext };
