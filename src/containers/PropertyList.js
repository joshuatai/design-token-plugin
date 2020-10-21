import React, { useEffect, useRef } from "react";
import PropertyItem from "./PropertyItem";
import usePropertySetting from "hooks/usePropertySetting";
const PropertyList = () => {
    const { propertiesSetting, getPropertySetting, setPropertiesSetting, } = usePropertySetting();
    const $itemContainerRef = useRef(null);
    useEffect(() => {
        if (propertiesSetting.length > 1) {
            const $container = $itemContainerRef.current;
            $($container)
                .sortable({
                placeholder: "ui-sortable-placeholder",
                handle: ".sortable-handler",
                axis: "y",
            })
                .on("sortupdate", function (event, ui) {
                const sortedProperties = Array.from($container.children).map((item) => getPropertySetting(item.dataset["id"]));
                setPropertiesSetting(sortedProperties);
            });
        }
    }, [propertiesSetting]);
    return propertiesSetting.length > 0 ? (React.createElement("div", { id: "property-list", className: propertiesSetting.length > 1 ? "setting-row ui-sortable" : "setting-row" },
        React.createElement("h6", null, "Properties"),
        React.createElement("ul", { ref: $itemContainerRef, className: "property-item-container" }, propertiesSetting.map((property) => (React.createElement(PropertyItem, { key: property.id, property: property })))))) : null;
};
export default PropertyList;
