import React, { useState, useEffect, useRef } from "react";
import useAPI from "hooks/useAPI";
import useTabs from 'hooks/useTabs';
import useTokenSetting from "hooks/useTokenSetting";
import usePropertySetting from "hooks/usePropertySetting";
import useData from "hooks/useData";
import useGroups from "hooks/useGroups";
import useTokens from "hooks/useTokens";
import useProperties from "hooks/useProperties";
import Token from "model/Token";
import BackButton from "./BackButton";
import PropertyList from "./PropertyList";
import PropertySetting from "./PropertySetting";
import InputStatus from "enums/InputStatus";
import { Mixed } from "symbols/index";
import { inputCheck, valChange } from "utils/inputValidator";
import SelectText from "utils/SelectText";
import Tabs from 'enums/Tabs';
SelectText(jQuery);
// import _cloneDeep from 'lodash/cloneDeep';
// import _findIndex from 'lodash/findIndex';
// import BrowserEvents from '../enums/BrowserEvents';
// import { getGroup, getToken, setToken, syncToken, save, syncNode } from '../model/DataManager';
// import PropertyView from './PropertyView';
//
// PropertyView(jQuery);
// export default function ($) {
//     this.$element = $(element)
//       .append($propertyView)
//     if (this.token.properties.length > 0) {
//       this.$propertyView.propertyView(this.token.properties);
//     }
//   TokenSetting.prototype.choosePropertyType = function (param) {
//     let type = param;
//     let settings;
//     this.$propertySettingSections.empty();
//     if (typeof param === 'object') {
//       type = param[0].type;
//       this.$settingUpdateBtn.show();
//       settings = param.map(prop => getPropertySettingSection(prop));
//       $('.property-item:hover').after(this.$propertySetting);
//     }
//   };
//   TokenSetting.prototype.updateProperty = function () {
//     this.$propertyView.propertyView(this.token.properties);
//     syncToken(this.token);
//     save();
//     syncNode(this.token);
//   };
//   TokenSetting.prototype.propertyView = function (property) {
//     const tmpProperties = _cloneDeep(this.token.properties);
//     if (property) {
//       const existIndex = _findIndex(tmpProperties, prop => prop.id === property.id);
//       existIndex > -1 ? tmpProperties[existIndex] = property : tmpProperties.push(property);
//     }
//     this.$propertyView.propertyView(tmpProperties);
//   }
//   TokenSetting.prototype.changeThemeMode = function () {
//     this.$propertyView.propertyView('rerender');
//   }
//   $(document).on('property-sort', '#property-list', function (event, properties) {
//     hostData.token.properties = properties;
//     hostData.updateProperty();
//   });
//   $(document).on('property-preview', function (event, property) {
//     hostData.propertyView(property);
//   });
// }(jQuery);
const TokenSetting = () => {
    const { api: { admin }, } = useAPI();
    const { tab } = useTabs();
    const { initialSetting, setting, setToken, setTokenSetting, } = useTokenSetting();
    const { group, token } = setting;
    const { propertiesSetting, setPropertiesSetting, setPropertyEdit, } = usePropertySetting();
    const { saveTokensProperties } = useData();
    const { addGroup } = useGroups();
    const { addToken, getToken } = useTokens();
    const { addProperties, referedProperties, getProperty } = useProperties();
    const [showPropertySetting, setShowPropertySetting] = useState(false);
    const [creatable, setCreatable] = useState(token && token.name ? true : false);
    const $name = useRef();
    const $description = useRef();
    const $backButton = useRef();
    const focusHandler = (e) => {
        if (!admin || tab !== Tabs.TOKENS)
            return;
        setCreatable(false);
        $(e.target).selectText();
    };
    const inputHandler = (e) => {
        if (!admin || tab !== Tabs.TOKENS)
            return;
        inputCheck.call(e.target, e);
    };
    const blurHandler = (e) => {
        if (!admin || tab !== Tabs.TOKENS)
            return;
        const $target = e.target;
        const type = $target.getAttribute("prop-type");
        valChange
            .call($target, token[type], (val) => {
            return val;
        })
            .then((res) => {
            if (res.status === InputStatus.VALID) {
                token[type] = $target.textContent;
                setToken(token);
                setCreatable(true);
            }
        })
            .catch((res) => {
            if (res.status === InputStatus.NO_CHANGE)
                setCreatable(true);
        });
    };
    const showPropertySettingHandler = () => {
        setShowPropertySetting(true);
    };
    const hidePropertySettingHandler = () => {
        setShowPropertySetting(false);
    };
    const cancelTokenHandler = () => {
        setPropertyEdit(null);
        setPropertiesSetting([]);
        setTokenSetting(Object.assign({}, initialSetting));
    };
    const traversingUpdate = (id) => {
        // console.log(propertiesSetting, token);//need to check default theme
        referedProperties(id).forEach(property => {
            const referProp = propertiesSetting.filter(prop => prop.themeMode === property.themeMode).pop();
            const referPropSetting = Object.assign({}, referProp);
            delete referPropSetting.id;
            delete referPropSetting.parent;
            delete referPropSetting.themeMode;
            delete referPropSetting.useToken;
            Object.assign(property, referPropSetting);
            traversingUpdate(property.parent);
        });
    };
    const saveTokenHandler = (e) => {
        if (!admin || tab !== Tabs.TOKENS)
            return;
        const exist = group.tokens.find((_token) => _token === token.id);
        if (!exist)
            group.tokens.push(token.id);
        traversingUpdate(token.id);
        saveTokensProperties(addGroup(group), addToken(token), addProperties(propertiesSetting)).then((res) => {
            if (res.success) {
                $backButton.current.click();
            }
        });
    };
    useEffect(() => {
        if (!admin || tab !== Tabs.TOKENS)
            return;
        if (!token) {
            const newToken = new Token({ parent: group.id });
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
        if (!admin || tab !== Tabs.TOKENS)
            return;
        if (token) {
            const properties = [];
            if (propertiesSetting.length > 0) {
                const propertyTypes = Object.keys(propertiesSetting.reduce((calc, property) => {
                    properties.push(property.id);
                    calc[property.type] = property.type;
                    return calc;
                }, {}));
                token.propertyType =
                    propertyTypes.length === 1 ? propertyTypes[0] : Mixed;
            }
            else {
                token.propertyType = "";
            }
            token.properties = properties;
            setToken(token);
        }
    }, [propertiesSetting]);
    return (token && (React.createElement("div", { id: "token-setting", className: "plugin-panel" },
        React.createElement("div", { className: "setting-row" },
            React.createElement(BackButton, { _ref: $backButton, onClick: cancelTokenHandler }),
            React.createElement("h6", { id: "panel-group-name" }, group.name)),
        React.createElement("div", { className: "setting-row" },
            React.createElement("span", { ref: $name, className: "token-name", "prop-type": "name", placeholder: "Token Name", "is-required": "true", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: inputHandler, onBlur: blurHandler }, token.name)),
        React.createElement("div", { className: "setting-row" },
            React.createElement("span", { ref: $description, className: "token-description", "prop-type": "description", placeholder: "Description", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: inputHandler, onBlur: blurHandler }, token.description)),
        React.createElement("div", { id: "property-view", className: "setting-row" }),
        React.createElement(PropertyList, null),
        token && !showPropertySetting && tab === Tabs.TOKENS && (React.createElement("div", { className: "setting-row" },
            React.createElement("button", { id: "add-property", type: "button", disabled: !creatable, onClick: showPropertySettingHandler }, "Create A Property"))),
        showPropertySetting && (React.createElement(PropertySetting, { token: token, hidePropertySetting: hidePropertySettingHandler })),
        tab === Tabs.TOKENS && propertiesSetting.length > 0 && (React.createElement("div", { className: "setting-row" },
            React.createElement("button", { id: "save-button-container", type: "button", className: "btn btn-sm btn-primary", disabled: token.name === "", onClick: saveTokenHandler }, "Save"))))));
};
export default TokenSetting;
