import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
const initialFonts = [];
const initialFontsSetter = {
    setFonts: null
};
const fontsContext = React.createContext(initialFonts);
const fontsSetterContext = React.createContext(initialFontsSetter);
const FontProvider = ({ value = initialFonts, children }) => {
    const [fonts, setFonts] = useState(value);
    const fontsSetterRef = useRef({
        setFonts
    });
    return (React.createElement(fontsContext.Provider, { value: fonts },
        React.createElement(fontsSetterContext.Provider, { value: fontsSetterRef.current }, children)));
};
FontProvider.propTypes = {
    value: PropTypes.array,
};
FontProvider.displayName = "FontProvider";
export default FontProvider;
export { fontsContext, fontsSetterContext };
