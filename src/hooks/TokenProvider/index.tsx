import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import Token from 'model/Token';

const initialTokens: Array<Token> = [];
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
  const [ tokens, setTokens ] = useState(value);
  const [ pureTokens, setPureTokens ] = useState(initialPurePropertyTokens);
  const tokensSetterRef = useRef({
    setTokens
  });
  const purePropertyTokensSetterRef = useRef({
    setPureTokens
  });
  return (
    <tokensContext.Provider value={tokens}>
      <tokensSetterContext.Provider value={tokensSetterRef.current}>
        <purePropertyTokensContext.Provider value={pureTokens}>
          <purePropertyTokensSetterContext.Provider value={purePropertyTokensSetterRef.current}>
            {children}
          </purePropertyTokensSetterContext.Provider>
        </purePropertyTokensContext.Provider>
      </tokensSetterContext.Provider>
    </tokensContext.Provider>
  );
};
TokenProvider.propTypes = {
  value: PropTypes.array,
};
TokenProvider.displayName = "TokenProvider";

export default TokenProvider;
export { tokensContext, tokensSetterContext, purePropertyTokensContext, purePropertyTokensSetterContext };
