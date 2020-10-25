import PropTypes from "prop-types";
import React, { useRef, useState } from "react";

const initialFonts: Array<Font> = [];
const initialFontsSetter = {
  setFonts: null
};
const fontsContext = React.createContext(initialFonts);
const fontsSetterContext = React.createContext(initialFontsSetter);
const FontProvider = ({ value = initialFonts, children }) => {
  const [ fonts, setFonts ] = useState(value);
  const fontsSetterRef = useRef({
    setFonts
  });
  return (
    <fontsContext.Provider value={fonts}>
      <fontsSetterContext.Provider value={fontsSetterRef.current}>
        {children}
      </fontsSetterContext.Provider>
    </fontsContext.Provider>
  );
};

FontProvider.propTypes = {
  value: PropTypes.array,
};

FontProvider.displayName = "FontProvider";

export default FontProvider;
export { fontsContext, fontsSetterContext };
