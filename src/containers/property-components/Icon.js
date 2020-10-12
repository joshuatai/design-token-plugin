import React from "react";
import PropertyTypes from 'enums/PropertyTypes';
const _Icons = {
    [PropertyTypes.CORNER_RADIUS]: ({ option }) => {
        // const isUseToken = options.useToken;
        // if (themeModes.length > 1) {
        //   applyThemeMode = property.themeMode;
        //   applyThemeMode ? thridValue = getThemeMode(applyThemeMode).name : thridValue = defaultMode.name;
        // }
        const value = `${option.opacity}%`;
        //     if (isUseToken) {
        //       const useToken = getToken(property.useToken);
        //       value = useToken.name;
        //       secondValue = '';
        //       property = traversingUseToken(useToken);
        //     }
        const title = `Opacity: ${option.opacity}%`;
        return React.createElement("span", { title: title, className: "corner-radius-icon" });
    },
    [PropertyTypes.STROKE_WIDTH_ALIGN]: () => React.createElement("span", { className: "stroke-width-icon" }),
    [PropertyTypes.STROKE_FILL]: () => React.createElement("div", { className: "stroke-fill-icon" }),
    [PropertyTypes.FILL_COLOR]: () => React.createElement("div", { className: "fill-color-icon" },
        React.createElement("div", { className: "color-icon-opacity" })),
    [PropertyTypes.OPACITY]: () => React.createElement("div", { className: "opacity-icon color-icon-opacity" }),
    [PropertyTypes.FONT]: () => React.createElement("div", { className: "font-icon" }, "A"),
    [PropertyTypes.SPACING]: () => React.createElement("div", { className: "spacing-icon" },
        React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React.createElement("path", { d: "M1 8.38237L3.71667 5.45318L3.71667 11.3116L1 8.38237Z", fill: "black" }),
            React.createElement("path", { d: "M3 8.5L13 8.5", stroke: "black" }),
            React.createElement("path", { d: "M15 8.38234L12.2833 11.3115V5.45315L15 8.38234Z", fill: "black" }),
            React.createElement("line", { x1: "0.5", y1: "2.45985e-08", x2: "0.499999", y2: "16", stroke: "black" }),
            React.createElement("line", { x1: "15.5", y1: "2.63555e-08", x2: "15.5", y2: "16", stroke: "black" })))
};
const Icon = ({ option = null }) => {
    const PropertyIcon = _Icons[option.type];
    return React.createElement(PropertyIcon, { option: option });
};
export default Icon;
