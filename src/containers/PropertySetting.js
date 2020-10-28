import React, { useState, useRef, } from "react";
import PropertyConponents from "./property-components";
import usePropertySetting from "hooks/usePropertySetting";
import PropertyTypes from "enums/PropertyTypes";
const PropertySetting = ({ token = null, property = null, hidePropertySetting = null, }) => {
    const initTypeLabel = "Choose a type of property";
    const { propertySetting, setPropertySetting, createPropertySetting, } = usePropertySetting();
    const [choosedType, setChoosedType] = useState(property ? property.type : undefined);
    const $settingRef = useRef();
    const $dropdownBtn = useRef();
    const $chooseType = useRef();
    const PropertyComponent = PropertyConponents[choosedType];
    const _chooseTypeHandler = (e) => {
        setPropertySetting(null);
        const type = e.target.getAttribute("type");
        setChoosedType(type);
    };
    const updatePropertyHandler = (e) => {
        setPropertySetting(propertySetting);
        createPropertySetting();
        hidePropertySetting(e);
        // const settings = $.makeArray(this.$propertySettingSections.children()).map(setting => $(setting).data('value'));
        //     let referedProperty;
        //     let referPropIndex = -1;
        //     if (settings.length > 1) {
        //       referedProperty = this.$propertySetting.prev().data('property');
        //       referPropIndex = _findIndex(this.token.properties, prop => prop.id === referedProperty.id);
        //       this.token.properties.splice(referPropIndex, 1, ...settings);
        //     } else {
        //     }
        //     this.updateProperty();
    };
    return (React.createElement("div", { id: "property-setting", ref: $settingRef },
        !property ? (React.createElement("div", { id: "property-type-row", className: "setting-row" },
            React.createElement("div", { id: "property-type", className: "btn-group" },
                React.createElement("button", { type: "button", ref: $dropdownBtn, className: "btn btn-border dropdown-toggle", "data-toggle": "dropdown", "aria-expanded": "false", value: choosedType },
                    React.createElement("i", { className: "tmicon tmicon-caret-down" }),
                    React.createElement("span", { ref: $chooseType }, choosedType ? choosedType : initTypeLabel)),
                React.createElement("ul", { className: "dropdown-menu" }, Object.keys(PropertyTypes)
                    .sort()
                    .map((type) => {
                    let isShow = true;
                    // properties.forEach((property: any) => {
                    //   if (
                    //     property.type === PropertyTypes.CORNER_RADIUS ||
                    //     property.type === PropertyTypes.STROKE_WIDTH_ALIGN
                    //   ) isShow = false;
                    // })
                    if (isShow) {
                        return (React.createElement("li", { key: type, className: `property-type-${type}`, onClick: _chooseTypeHandler },
                            React.createElement("a", { href: "#", type: PropertyTypes[type] }, PropertyTypes[type])));
                    }
                }))))) : null,
        React.createElement("div", { id: "property-setting-sections", className: "setting-row" }, PropertyComponent && (React.createElement(PropertyComponent, { value: property, propType: choosedType }))),
        React.createElement("div", { className: "setting-row" },
            React.createElement("button", { id: "property-setting-cancel", type: "button", className: "btn btn-sm btn-border", onClick: hidePropertySetting }, "Cancel"),
            choosedType &&
                React.createElement("button", { type: "button", className: "btn btn-sm btn-primary", onClick: updatePropertyHandler }, !property ? 'Create' : 'Update'))));
};
export default PropertySetting;
