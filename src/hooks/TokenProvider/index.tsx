import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import Token from 'model/Token';

const initialTokens: Array<Token> = [];
const initialTokensSetter = {
  setTokens: null
};
const tokensContext = React.createContext(initialTokens);
const tokensSetterContext = React.createContext(initialTokensSetter);
const TokenProvider = ({ value = initialTokens, children }) => {
  const [ tokens, setTokens ] = useState(value);
  const tokensSetterRef = useRef({
    setTokens
  });
  return (
    <tokensContext.Provider value={tokens}>
      <tokensSetterContext.Provider value={tokensSetterRef.current}>
        {children}
      </tokensSetterContext.Provider>
    </tokensContext.Provider>
  );
};

TokenProvider.propTypes = {
  value: PropTypes.array,
};

TokenProvider.displayName = "TokenProvider";

export default TokenProvider;
export { tokensContext, tokensSetterContext };
