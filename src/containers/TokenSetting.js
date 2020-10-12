import React, { useState, useEffect, useRef } from "react";
import useAPI from 'hooks/useAPI';
import useTokenSetting from 'hooks/useTokenSetting';
import InputStatus from 'enums/InputStatus';
import PropertyTypes from 'enums/PropertyTypes';
import Token from 'model/Token';
import { inputCheck, valChange } from 'utils/inputValidator';
import SelectText from 'utils/SelectText';
import PropertyList from './PropertyList';
import PropertyConponents from './property-components';
import usePropertySetting from "hooks/usePropertySetting";
SelectText(jQuery);
// import _cloneDeep from 'lodash/cloneDeep';
// import _findIndex from 'lodash/findIndex';
// import BrowserEvents from '../enums/BrowserEvents';
// import { getGroup, getToken, setToken, syncToken, save, syncNode } from '../model/DataManager';
// import { inputCheck, valChange } from '../utils/inputValidator';
// 
// import PropertyView from './PropertyView';
// import PropertyList from './PropertyList';
// import { Mixed } from 'symbols/index';
// let hostData;
// const backIcon = `
//   <div id="turn-back-btn" class="turn-back-btn">
//     <svg
//       class="svg"
//       width="8"
//       height="13"
//       viewBox="0 0 8 13"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M1 6.5l-.353-.354-.354.354.354.354L1 6.5zM6.647.146l-6 6 .707.708 6-6-.707-.708zm-6 6.708l6 6 .707-.708-6-6-.707.708z"
//         fill-rule="nonzero"
//         fill-opacity="1"
//         fill="inherit"
//         stroke="none"
//       ></path>
//     </svg>
//   </div>
// `;
// const PropertyConponents = propertyConponents(jQuery);
// PropertyView(jQuery);
// PropertyList(jQuery);
// export default function ($) {
//   const NAME = 'TokenSetting';
//   const getPropertySettingSection = (prop) => {
//     return $('<div class="property-setting-section"></div>')
//       .data({
//         token: hostData.token,
//         propertyView: hostData.$propertyView
//       })
//       [PropertyConponents[prop.type]](prop);
//   }
//   var TokenSetting = function (element, { group, token }) {
//     hostData = this;
//     this.group = getGroup(group);
//     this.token = getToken(token) || setToken(new Token({ parent: group }));
//     const $propertyView = $('');
//     const $propertyList = $('');    
//     this.$element = $(element)
//       .append($headerRow)
//       .append($tokenNameRow.append($tokenName.append(this.token.name)))
//       .append($descriptionRow.append($description.append(this.token.description)))
//       .append($propertyView)
//       .append($propertyList)
//       .append($createPropertyRow.append($createProperty))
//       .append(
//         $propertySetting
//           .append(
//             $propertyTypeRow.append(
//               $propertyType
//                 .append(
//                   $propertyTypeBtn
//                 )
//                 .append(
//                   $propertyTypeDropdowns
//                 )
//             )
//           )
//           .append($propertySettingSections)
//           .append($settingButtonsRow.append($settingCancelBtn.add($settingCreateBtn).add($settingUpdateBtn)))
//       )
//       .show();
//     Object.assign(this, {
//       $tokenName,
//       $propertyView,
//       $propertyList,
//       $createProperty,
//       $propertySetting,
//       $propertyTypeRow,
//       $propertyTypeBtn,
//       $propertyTypeDropdowns,
//       $propertySettingSections,
//       $settingCreateBtn,
//       $settingUpdateBtn,
//       $settingCancelBtn
//     });
//     if (!this.token.name) {
//       $tokenName.selectText();
//       $createProperty.attr('disabled', true);
//     }
//     if (this.token.properties.length > 0) {
//       this.$propertyList.propertyList(this.token.properties);
//       this.$propertyView.propertyView(this.token.properties);
//     }
//   };
//   TokenSetting.prototype.canAddProperty = function () {
//     this.$createProperty.add(this.$settingCreateBtn).add(this.$settingUpdateBtn).attr('disabled', !this.$tokenName.text());
//   };
// TokenSetting.prototype.propertyEdit = function (editable: Boolean, property?: any) {
// this.$propertyTypeRow[property? 'hide' : 'show']();
//   this.$propertySettingSections.hide().empty();
//   this.$propertyTypeDropdowns.children().show();
//   if (property) {
//     const properties = [];
//     if (!property.length) properties.push(property);
//      else properties.push(...property);
//     this.choosePropertyType(properties);
//   }
// };
//   TokenSetting.prototype.choosePropertyType = function (param) {
//     let type = param;
//     let settings;
//     this.$propertySettingSections.empty();
//     if (typeof param === 'object') {
//       type = param[0].type;
//       this.$settingUpdateBtn.show();
//       settings = param.map(prop => getPropertySettingSection(prop));
//       $('.property-item:hover').after(this.$propertySetting);
//     } else {
//       this.$settingCreateBtn.show();
//       settings = getPropertySettingSection({ type });
//     }
//     
//   };
//   TokenSetting.prototype.createProperty = function () {
//     const settings = $.makeArray(this.$propertySettingSections.children()).map(setting => $(setting).data('value'));
//     let referedProperty;
//     let referPropIndex = -1;
//     if (settings.length > 1) {
//       referedProperty = this.$propertySetting.prev().data('property');
//       referPropIndex = _findIndex(this.token.properties, prop => prop.id === referedProperty.id);
//       this.token.properties.splice(referPropIndex, 1, ...settings);
//     } else {
//       const existIndex = _findIndex(this.token.properties, prop => prop.id === settings[0].id);
//       existIndex > -1 ? hostData.token.properties.splice(existIndex, 1, settings[0]): this.token.properties.push(settings[0]);
//     }
//     this.updateProperty();
//   };
//   TokenSetting.prototype.removeProperty = function (property) {
//     $.each(this.token.properties, (i, prop) => {
//         if (prop && prop.id === property.id) {
//             this.token.properties.splice(i, 1);
//         }
//     });
//     this.updateProperty();
//   };
//   TokenSetting.prototype.updateProperty = function () {
//     this.$element.append(this.$propertySetting); // prevent remove data once propetyList destroy
//     if (this.token.properties.length > 0) {
//       this.$propertyList.propertyList(this.token.properties);
//       const propertyTypes = Object.keys(this.token.properties.reduce((calc, property) => {
//         calc[property.type] = property.type;
//         return calc;
//       }, {}));
//       this.token.propertyType = propertyTypes.length === 1 ? propertyTypes[0] : Mixed;
//     } else {
//         this.$propertyList.destroy();
//     }
//     this.propertyEdit(false);
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
//   TokenSetting.prototype.destroy = function () {
//       return this.$element.empty().removeData().hide();
//   };
//   function Plugin(option) {
//     return this.each(function () {
//       var $this   = $(this)
//       var data    = $this.data('TokenSetting');
//       var options = typeof option == 'object' && option;
//       if (typeof option === 'string') {
//         data && data[option]();
//       } else if (data) {
//         data.destroy();
//       } else {
//         $this.data('TokenSetting', (data = new TokenSetting(this, options)));
//       }
//     })
//   }
//   var old = $.fn.TokenSetting;
//   $.fn.TokenSetting             = Plugin
//   $.fn.TokenSetting.Constructor = TokenSetting
//   $.fn.TokenSetting.noConflict = function () {
//     $.fn.TokenSetting = old
//     return this
//   }
//   function canAddProperty (callback) {
//     return function (e) {
//       callback.call(this, e);
//       hostData.canAddProperty();
//     }
//   }
//   // done
//   $(document).on(BrowserEvents.CLICK, '#token-setting #turn-back-btn', $.debounce(260, function () {
//     const { token } = hostData;
//     hostData.$element.trigger('destroy:TokenSetting', [token]).destroy();
//   }));
//   $(document).on(BrowserEvents.DBCLICK, '.token-name, .token-description', function (e) {
//     $(this).selectText();
//   });
//   $(document).on(`${BrowserEvents.KEY_UP}`, '.token-name, .token-description', canAddProperty(inputCheck));
//   $(document).on(`${BrowserEvents.BLUR}`, '.token-name, .token-description', canAddProperty(valChange));
//   $(document).on(BrowserEvents.CLICK, '#property-type a', function (event) {
//     hostData.choosePropertyType($(this).text());
//   });
//   $(document).on(BrowserEvents.CLICK, '#property-setting-create, #property-setting-update', function () {
//     hostData.createProperty();
//   });
//   $(document).on('property-remove', '#property-list', function (event, property) {
//     hostData.removeProperty(property);
//   });
//   $(document).on('property-sort', '#property-list', function (event, properties) {
//     hostData.token.properties = properties;
//     hostData.updateProperty();
//   });
//   $(document).on('property-edit', '#property-list', function (event, property) {
//     hostData.propertyEdit(true, property);
//   });
//   $(document).on('property-preview', function (event, property) {
//     hostData.propertyView(property);
//   });
// }(jQuery);
const BackIcon = () => {
    return (React.createElement("div", { id: "turn-back-btn", className: "turn-back-btn" },
        React.createElement("svg", { className: "svg", width: "8", height: "13", viewBox: "0 0 8 13", xmlns: "http://www.w3.org/2000/svg" },
            React.createElement("path", { d: "M1 6.5l-.353-.354-.354.354.354.354L1 6.5zM6.647.146l-6 6 .707.708 6-6-.707-.708zm-6 6.708l6 6 .707-.708-6-6-.707.708z", fillRule: "nonzero", fillOpacity: "1", fill: "inherit", stroke: "none" }))));
};
const PropertySetting = ({ token = null, property = null, cancelHandler = null, createHandler = null }) => {
    const initTypeLabel = 'Choose a type of property';
    const { property: _property, setProperty, createProperty } = usePropertySetting();
    const [choosedType, setChoosedType] = useState(undefined);
    const $dropdownBtn = useRef();
    const $chooseType = useRef();
    const Property = PropertyConponents[PropertyTypes[choosedType]];
    const _chooseTypeHandler = (e) => {
        const type = e.target.getAttribute('type');
        setChoosedType(type);
    };
    const createPropertyHandler = (e) => {
        _property.parent = token.id;
        setProperty(_property);
        createHandler(e);
        createProperty();
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
    const { properties } = usePropertySetting();
    const [showPropertySetting, setShowPropertySetting] = useState(false);
    const { api: { admin } } = useAPI();
    const { setting: tokenSetting, setToken } = useTokenSetting();
    const { groupId, groupName, token } = tokenSetting;
    const $name = useRef();
    const $description = useRef();
    const focusHandler = (e) => {
        if (!admin)
            return;
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
        // creatable(false);
        valChange
            .call($target, token[type], (val) => {
            return val;
        })
            .then(res => {
            if (res.status === InputStatus.VALID) {
                tokenSetting.token[type] = $target.textContent;
                setToken(tokenSetting.token);
                // creatable(true);
            }
        })
            .catch(res => {
            // if (res === InputStatus.NO_CHANGE) creatable(true);
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
    // $(document).on(BrowserEvents.CLICK, '#add-property, #property-setting-cancel', function () {
    //   hostData.$propertyView.propertyView(hostData.token.properties);
    // });
    useEffect(() => {
        if (!token) {
            setToken(new Token({ parent: groupId }));
        }
        else if (!token.name) {
            $($name.current).selectText();
        }
    }, [token]);
    useEffect(() => {
        console.log(properties);
    }, [properties]);
    return token &&
        React.createElement("div", { id: "token-setting", className: "plugin-panel" },
            React.createElement("div", { className: "setting-row" },
                React.createElement(BackIcon, null),
                React.createElement("h6", { id: "panel-group-name" }, groupName)),
            React.createElement("div", { className: "setting-row" },
                React.createElement("span", { ref: $name, className: "token-name", "prop-type": "name", placeholder: "Token Name", "is-required": "true", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: inputHandler, onBlur: blurHandler }, token.name)),
            React.createElement("div", { className: "setting-row" },
                React.createElement("span", { ref: $description, className: "token-description", "prop-type": "description", placeholder: "Add Description", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: inputHandler, onBlur: blurHandler }, token.description)),
            React.createElement("div", { id: "property-view", className: "setting-row" }),
            React.createElement(PropertyList, null),
            React.createElement("div", { className: "setting-row" }, token && !showPropertySetting && React.createElement("button", { id: "add-property", type: "button", disabled: token.name === '', onClick: showPropertyHandler }, "Create a new property")),
            showPropertySetting && React.createElement(PropertySetting, { token: token, createHandler: createPropertyHandler, cancelHandler: hidePropertyHandler }));
};
export default TokenSetting;
