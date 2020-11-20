import React from "react";
import PropertyTypes from "enums/PropertyTypes";
const _Icons = {
    [PropertyTypes.CORNER_RADIUS]: ({ title, disabled }) => (React.createElement("span", { className: "corner-radius-icon", title: title, "data-disabled": disabled })),
    [PropertyTypes.STROKE_WIDTH_ALIGN]: ({ title, disabled }) => (React.createElement("span", { className: "stroke-width-icon", title: title, "data-disabled": disabled })),
    [PropertyTypes.STROKE_FILL]: ({ title, style, disabled }) => (React.createElement("div", { className: "stroke-fill-icon", title: title, style: style, "data-disabled": disabled })),
    [PropertyTypes.FILL_COLOR]: ({ title, style, disabled }) => (React.createElement("div", { className: "fill-color-icon", title: title, style: { background: style.background }, "data-disabled": disabled },
        React.createElement("div", { className: "color-icon-opacity", style: { opacity: style.opacity, width: style.width } }))),
    [PropertyTypes.OPACITY]: ({ title, disabled }) => (React.createElement("div", { className: "opacity-icon color-icon-opacity", title: title, "data-disabled": disabled })),
    [PropertyTypes.FONT_FAMILY_STYLE]: ({ title, disabled }) => (React.createElement("div", { className: "font-icon", title: title, "data-disabled": disabled }, "A")),
    [PropertyTypes.SPACING]: ({ title, disabled }) => (React.createElement("div", { className: "spacing-icon", title: title, "data-disabled": disabled },
        React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React.createElement("path", { d: "M1 8.38237L3.71667 5.45318L3.71667 11.3116L1 8.38237Z", fill: "black" }),
            React.createElement("path", { d: "M3 8.5L13 8.5", stroke: "black" }),
            React.createElement("path", { d: "M15 8.38234L12.2833 11.3115V5.45315L15 8.38234Z", fill: "black" }),
            React.createElement("line", { x1: "0.5", y1: "2.45985e-08", x2: "0.499999", y2: "16", stroke: "black" }),
            React.createElement("line", { x1: "15.5", y1: "2.63555e-08", x2: "15.5", y2: "16", stroke: "black" })))),
};
const Icon = ({ type, title, disabled, style, }) => {
    const PropertyIcon = _Icons[type];
    return (React.createElement(PropertyIcon, { title: title, style: style, disabled: disabled }));
};
export default Icon;
