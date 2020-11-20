import React from "react";
import PropertySetting from "./PropertySetting";
import PropertyIcon from "./property-components/PropertyIcon";
import useAPI from 'hooks/useAPI';
import useTabs from "hooks/useTabs";
import useTokenSetting from "hooks/useTokenSetting";
import usePropertySetting from "hooks/usePropertySetting";
import usePropertyInfo from "hooks/usePropertyInfo";
import useProperties from "hooks/useProperties";
import Properties from "model/Properties";
import Tabs from "enums/Tabs";
const RemoveIcon = ({ referedTokens = [], removeHandler = null, }) => {
    const props = referedTokens.length > 0
        ? {
            "data-disabled": true,
            title: `This token has been linked by the tokens: ${referedTokens
                .map((token) => token.name)
                .join(", ")}`,
        }
        : {
            "data-disabled": false,
            onClick: removeHandler,
        };
    return (React.createElement("span", Object.assign({ className: "remove-property" }, props),
        React.createElement("svg", { className: "svg", width: "12", height: "6", viewBox: "0 0 12 6", xmlns: "http://www.w3.org/2000/svg" },
            React.createElement("path", { d: "M11.5 3.5H.5v-1h11v1z", fillRule: "nonzero", fillOpacity: "1", fill: "#000", stroke: "none" }))));
};
const PropertyItem = ({ property, }) => {
    const { api: { admin } } = useAPI();
    const { tab } = useTabs();
    const { setting } = useTokenSetting();
    const { token } = setting;
    const { title, value, secondValue, thridValue } = usePropertyInfo(property);
    const { referedTokens } = useProperties();
    const { resetPropertySetting, propertyEdit, setPropertyEdit, } = usePropertySetting();
    const refereds = referedTokens(property.parent);
    const removeHandler = () => {
        resetPropertySetting(property);
    };
    const showPropertySettingHandler = () => {
        if (!admin || tab !== Tabs.TOKENS)
            return;
        setPropertyEdit(new Properties[property.type](property));
    };
    const hidePropertySetting = () => {
        setPropertyEdit(null);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("li", { className: tab === Tabs.TOKENS ? 'editable property-item' : 'property-item', "data-id": property.id, onClick: showPropertySettingHandler },
            React.createElement("span", { className: "sortable-handler" }),
            React.createElement("span", { className: "property-name" }, property.type),
            React.createElement(PropertyIcon, { options: [property] }),
            React.createElement("span", { className: "property-value", title: title }, value),
            secondValue && (React.createElement("span", { className: "property-second-value", title: title }, secondValue)),
            thridValue && (React.createElement("span", { className: "property-third-value", title: title }, thridValue)),
            admin && tab === Tabs.TOKENS && (React.createElement(RemoveIcon, { referedTokens: refereds, removeHandler: removeHandler }))),
        admin && propertyEdit && propertyEdit.id === property.id && (React.createElement(PropertySetting, { token: token, property: propertyEdit, hidePropertySetting: hidePropertySetting }))));
};
export default PropertyItem;
