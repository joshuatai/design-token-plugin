import React from "react";
import useTokens from 'hooks/useTokens';
export const DetachIcon = () => {
    return (React.createElement("div", { className: "detach-token" },
        React.createElement("svg", { className: "svg", width: "14", height: "14", viewBox: "0 0 14 14", xmlns: "http://www.w3.org/2000/svg" },
            React.createElement("path", { d: "M4 0v3h1V0H4zm9.103.896c-1.162-1.161-3.045-1.161-4.207 0l-2.75 2.75.707.708 2.75-2.75c.771-.772 2.022-.772 2.793 0 .771.77.771 2.021 0 2.792l-2.75 2.75.707.708 2.75-2.75c1.162-1.162 1.162-3.046 0-4.208zM.896 13.103c-1.162-1.161-1.162-3.045 0-4.207l2.75-2.75.707.708-2.75 2.75c-.771.77-.771 2.021 0 2.792.771.772 2.022.772 2.793 0l2.75-2.75.707.707-2.75 2.75c-1.162 1.162-3.045 1.162-4.207 0zM14 10h-3V9h3v1zM10 11v3H9v-3h1zM3 4H0v1h3V4z", fillRule: "nonzero", fillOpacity: ".9", fill: "#000", stroke: "none" }))));
};
export const PureTokensIcon = () => {
    return (React.createElement("div", { className: "dropdown" },
        React.createElement("div", { className: "use-token", "data-toggle": "dropdown" },
            React.createElement("svg", { className: "svg", width: "10", height: "10", viewBox: "0 0 10 10", xmlns: "http://www.w3.org/2000/svg" },
                React.createElement("path", { d: "M.5 2c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C3.5 1.172 2.828.5 2 .5 1.172.5.5 1.172.5 2zm6 0c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C9.5 1.172 8.828.5 8 .5c-.828 0-1.5.672-1.5 1.5zM8 9.5c-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5 0 .828-.672 1.5-1.5 1.5zM.5 8c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5 0-.828-.672-1.5-1.5-1.5C1.172 6.5.5 7.172.5 8z", "fill-rule": "nonzero", "fill-opacity": "1", fill: "#000", stroke: "none" })))));
};
const PureTokens = ({ property }) => {
    const { getPureTokensByType } = useTokens();
    const pureTokens = getPureTokensByType(property.type);
    // const tokensMap = property.type === PropertyTypes.STROKE_FILL ? 
    // tokensMap = getPureToken(options.type === PropertyTypes.STROKE_FILL ? [PropertyTypes.FILL_COLOR, PropertyTypes.STROKE_FILL] : options.type);
    return React.createElement("div", null);
};
export default PureTokens;
// const tokenList = Object.keys(tokensMap)
//       .map(key => tokensMap[key])
//       .filter(token => token.id !== _token.id);
