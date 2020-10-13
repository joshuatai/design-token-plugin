import React, { useState, useEffect, useRef } from "react";
import useAPI from 'hooks/useAPI';
import useTokenSetting from 'hooks/useTokenSetting';
import usePropertySetting from "hooks/usePropertySetting";
import useData from 'hooks/useData';
import useGroups from 'hooks/useGroups';
import useTokens from 'hooks/useTokens';
import useProperties from 'hooks/useProperties';
import Token from 'model/Token';
import BackButton from './BackButton';
import PropertyList from './PropertyList';
import PropertyConponents from './property-components';
import InputStatus from 'enums/InputStatus';
import PropertyTypes from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';
import { inputCheck, valChange } from 'utils/inputValidator';
import SelectText from 'utils/SelectText';
SelectText(jQuery);
const PropertySetting = ({ token = null, property = null, cancelHandler = null, createHandler = null }) => {
    const initTypeLabel = 'Choose a type of property';
    const { propertySetting, setPropertySetting, createPropertySetting } = usePropertySetting();
    const [choosedType, setChoosedType] = useState(undefined);
    const $dropdownBtn = useRef();
    const $chooseType = useRef();
    const Property = PropertyConponents[PropertyTypes[choosedType]];
    const _chooseTypeHandler = (e) => {
        const type = e.target.getAttribute('type');
        setChoosedType(type);
    };
    const createPropertyHandler = (e) => {
        propertySetting.parent = token.id;
        setPropertySetting(propertySetting);
        createPropertySetting();
        createHandler(e);
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
    return React.createElement("div", { id: "property-setting" },
        React.createElement("div", { id: "property-type-row", className: "setting-row" },
            React.createElement("div", { id: "property-type", className: "btn-group" },
                React.createElement("button", { type: "button", ref: $dropdownBtn, className: "btn btn-border dropdown-toggle", "data-toggle": "dropdown", "aria-expanded": "false", value: choosedType },
                    React.createElement("i", { className: "tmicon tmicon-caret-down" }),
                    React.createElement("span", { ref: $chooseType }, choosedType ? PropertyTypes[choosedType] : initTypeLabel)),
                React.createElement("ul", { className: "dropdown-menu" }, Object.keys(PropertyTypes)
                    .sort()
                    .map(type => {
                    let isShow = true;
                    // properties.forEach((property: any) => {
                    //   if (
                    //     property.type === PropertyTypes.CORNER_RADIUS || 
                    //     property.type === PropertyTypes.STROKE_WIDTH_ALIGN
                    //   ) isShow = false;
                    // })
                    if (isShow) {
                        return React.createElement("li", { key: type, className: `property-type-${type}`, onClick: _chooseTypeHandler },
                            React.createElement("a", { href: "#", type: type }, PropertyTypes[type]));
                    }
                })))),
        React.createElement("div", { id: "property-setting-sections", className: "setting-row" }, Property && React.createElement(Property, null)),
        React.createElement("div", { className: "setting-row" },
            React.createElement("button", { id: "property-setting-cancel", type: "button", className: "btn btn-sm btn-border", onClick: cancelHandler }, "Cancel"),
            choosedType &&
                React.createElement(React.Fragment, null,
                    !property && React.createElement("button", { id: "property-setting-create", type: "button", className: "btn btn-sm btn-primary", onClick: createPropertyHandler }, "Create"),
                    property && React.createElement("button", { id: "property-setting-update", type: "button", className: "btn btn-sm btn-primary" }, "Update"))));
};
const TokenSetting = () => {
    const { initialSetting, setting, setToken, setTokenSetting } = useTokenSetting();
    const { group, token } = setting;
    const { propertiesSetting, setPropertiesSetting } = usePropertySetting();
    const { saveTokensProperties } = useData();
    const { addGroup } = useGroups();
    const { addToken } = useTokens();
    const { addProperties } = useProperties();
    const [showPropertySetting, setShowPropertySetting] = useState(false);
    const [creatable, setCreatable] = useState(token && token.name ? true : false);
    const { api: { admin } } = useAPI();
    const $name = useRef();
    const $description = useRef();
    const focusHandler = (e) => {
        if (!admin)
            return;
        setCreatable(false);
        $(e.target).selectText();
    };
    const inputHandler = (e) => {
        if (!admin)
            return;
        inputCheck.call(e.target, e);
    };
    const blurHandler = (e) => {
        if (!admin)
            return;
        const $target = e.target;
        const type = $target.getAttribute('prop-type');
        valChange
            .call($target, token[type], (val) => {
            return val;
        })
            .then(res => {
            if (res.status === InputStatus.VALID) {
                setting.token[type] = $target.textContent;
                setToken(setting.token);
                setCreatable(true);
            }
        })
            .catch(res => {
            if (res.status === InputStatus.NO_CHANGE)
                setCreatable(true);
        });
    };
    const showPropertyHandler = () => {
        setShowPropertySetting(true);
    };
    const hidePropertyHandler = () => {
        setShowPropertySetting(false);
    };
    const createPropertyHandler = () => {
        setShowPropertySetting(false);
    };
    const cancelTokenHandler = () => {
        setPropertiesSetting([]);
        setTokenSetting(initialSetting);
    };
    const saveTokenHandler = () => {
        // this.$propertyList.propertyList(this.token.properties);
        saveTokensProperties(addGroup(group), addToken(token), addProperties(propertiesSetting))
            .then(res => {
            console.log(res);
        });
    };
    // $(document).on(BrowserEvents.CLICK, '#add-property, #property-setting-cancel', function () {
    //   hostData.$propertyView.propertyView(hostData.token.properties);
    // });
    useEffect(() => {
        if (!token) {
            const newToken = new Token({ parent: group.id });
            group.tokens.push(newToken.id);
            setTokenSetting({
                group,
                token: newToken
            });
        }
        else if (!token.name) {
            $($name.current).selectText();
        }
    }, [token]);
    useEffect(() => {
        if (setting.token) {
            const properties = [];
            if (propertiesSetting.length > 0) {
                const propertyTypes = Object.keys(propertiesSetting.reduce((calc, property) => {
                    properties.push(property.id);
                    calc[property.type] = property.type;
                    return calc;
                }, {}));
                setting.token.propertyType = propertyTypes.length === 1 ? propertyTypes[0] : Mixed;
            }
            else {
                setting.token.propertyType = '';
            }
            setting.token.properties = properties;
            setToken(setting.token);
        }
    }, [propertiesSetting]);
    return token &&
        React.createElement("div", { id: "token-setting", className: "plugin-panel" },
            React.createElement("div", { className: "setting-row" },
                React.createElement(BackButton, { onClick: cancelTokenHandler }),
                React.createElement("h6", { id: "panel-group-name" }, group.name)),
            React.createElement("div", { className: "setting-row" },
                React.createElement("span", { ref: $name, className: "token-name", "prop-type": "name", placeholder: "Token Name", "is-required": "true", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: inputHandler, onBlur: blurHandler }, token.name)),
            React.createElement("div", { className: "setting-row" },
                React.createElement("span", { ref: $description, className: "token-description", "prop-type": "description", placeholder: "Add Description", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: inputHandler, onBlur: blurHandler }, token.description)),
            React.createElement("div", { id: "property-view", className: "setting-row" }),
            React.createElement(PropertyList, null),
            React.createElement("div", { className: "setting-row" }, token &&
                !showPropertySetting &&
                React.createElement("button", { id: "add-property", type: "button", disabled: !creatable, onClick: showPropertyHandler }, "Create a new property")),
            showPropertySetting && React.createElement(PropertySetting, { token: token, createHandler: createPropertyHandler, cancelHandler: hidePropertyHandler }),
            propertiesSetting.length > 0 &&
                React.createElement("div", { className: "setting-row" },
                    React.createElement("button", { type: "button", className: "btn btn-sm btn-primary", disabled: token.name === '', onClick: saveTokenHandler }, "Save")));
};
export default TokenSetting;
