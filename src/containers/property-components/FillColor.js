import React, { useEffect, useRef, useState } from "react";
import PropertyIcon from './PropertyIcon';
import ThemeModes from './ThemeModes';
import PureTokens from "./PureTokens";
import useTokenSetting from 'hooks/useTokenSetting';
import usePropertySetting from 'hooks/usePropertySetting';
import useThemeModes from 'hooks/useThemeModes';
import useTokens from "hooks/useTokens";
import useProperties from 'hooks/useProperties';
import FillColorModel from 'model/FillColor';
import SelectText from 'utils/SelectText';
import { inputCheck } from 'utils/inputValidator';
import BrowserEvents from 'enums/BrowserEvents';
import PropertyTypes from 'enums/PropertyTypes';
import StrokeColorModel from 'model/StrokeFill';
import colorPicker from 'utils/colorPicker';
SelectText(jQuery);
colorPicker(jQuery);
const FillColor = ({ value = null, propType }) => {
    const { defaultMode, themeModes, currentMode } = useThemeModes();
    const { getToken, getPureTokensByProperty } = useTokens();
    const { getProperty } = useProperties();
    const { setting: tokenSetting } = useTokenSetting();
    const { setPropertySetting } = usePropertySetting();
    const newOption = { parent: tokenSetting.token.id, themeMode: defaultMode.id };
    const Model = propType === PropertyTypes.FILL_COLOR ? FillColorModel : StrokeColorModel;
    const [setting, setSetting] = useState(value || new Model(newOption));
    const { color, opacity, useToken } = setting;
    const pureTokens = getPureTokensByProperty(setting);
    const $colorRef = useRef();
    const $opacityRef = useRef();
    const _useToken = getToken(useToken);
    const colorValue = _useToken ? _useToken.name : color;
    const opacityValue = opacity;
    function traversingUseToken(token) {
        const existCurrentMode = token.properties.find(prop => prop.themeMode === currentMode.id);
        const useDefaultMode = token.properties.find(prop => prop.themeMode === defaultMode.id);
        const property = existCurrentMode ? existCurrentMode : useDefaultMode;
        if (property.useToken) {
            return traversingUseToken(getToken(property.useToken));
        }
        else {
            return property;
        }
    }
    const focusHandler = (e) => {
        if (_useToken)
            return;
        const $target = e.target;
        const $valContainer = $target.closest('.val-container');
        $($target).selectText();
        if ($valContainer)
            $valContainer.classList.add('focus');
    };
    const keyUpHandler = (e) => {
        inputCheck.call(e.target, e);
    };
    const blurHandler = (e) => {
        // const $this = $(this);
        // const options: FillColor = hostData.options;
        // let value =  $this.text().replace('#', '');
        // if ($this.is('.color-val')) {
        //   if (!validateHTMLColorHex(`#${value}`) && value.toLowerCase() !== 'transparent' && value.toLowerCase() !== 'null') {
        //     value = options.color;
        //   }
        //   if (value.toLowerCase() === 'transparent' || value.toLowerCase() === 'null') {
        //     value = value.toLowerCase();
        //   } else {
        //     value = Color(`#${value}`).hex().replace('#', '');
        //   }
        //   options.color = value;
        //   $this.text(value);
        // } else {
        //   value = value.replace('%', '');
        //   if (!validator.isInt(value)) value = Math.floor(options.opacity * 100);
        //   value = Math.min(Math.max(0, value), 100);
        //   options.opacity = value / 100;
        //   $this.text(`${value}%`);
        // }
        // hostData.setIcon();
        // $(document).trigger('property-preview', [options]);
        // const $opacity = $opacityRef.current as HTMLSpanElement;
        // $opacity.textContent = $opacity.textContent.replace('%', '');
        // const $target = e.target;
        // const $valContainer = $target.closest('.val-container');
        // const propType = $target.getAttribute('prop-type');
        // const orginVal = setting[propType];
        // valChange
        //   .call($target, orginVal, (val) => {
        //     let _val = val;
        //     _val = Math.max(0, _val);
        //     if (_val === orginVal) return { status: InputStatus.NO_CHANGE };
        //     return { status: InputStatus.VALID, value: _val};
        //   })
        //   .then(res => {
        //     const value = res.value;
        //     if (res.status === InputStatus.VALID) {
        //       if (propType === 'radius') {
        //         if (Validator.int(value)) {
        //           setting.radius = value;
        //           setting.topLeft = value;
        //           setting.topRight = value;
        //           setting.bottomRight = value;
        //           setting.bottomLeft = value;
        //         }
        //       } else {
        //         if (Validator.int(value)) {
        //           setting[propType] = value;
        //           const uniqueValues = [...new Set(
        //             [
        //               setting.topLeft,
        //               setting.topRight,
        //               setting.bottomRight,
        //               setting.bottomLeft
        //             ]
        //           )];
        //           uniqueValues.length === 1 ? setting.radius = value : setting.radius = Mixed;
        //         }
        //       }
        //       setSetting(new Model(setting));
        //     }
        //   })
        //   .catch(res => {
        //     if (res.status === InputStatus.NO_CHANGE) {}
        //   });
        //   if ($valContainer) $valContainer.classList.remove('focus');
    };
    const useThemeHandler = (mode) => {
        setting.themeMode = mode.id;
        setSetting(new Model(setting));
    };
    const useTokenHandler = (usedToken) => {
        const usedProperty = propType === PropertyTypes.FILL_COLOR ? traversingUseToken(usedToken) : traversingUseToken(usedToken);
        setting.useToken = usedToken.id;
        setting.color = usedProperty.color;
        setting.opacity = usedProperty.opacity;
        setting.blendMode = usedProperty.blendMode;
        setting.fillType = usedProperty.fillType;
        setting.visible = usedProperty.visible;
        setSetting(new Model(setting));
    };
    const detachTokenHandler = () => {
        const usedProperties = traversingUseToken(getToken(setting.useToken));
        setting.useToken = '';
        if (usedProperties.length === 1) {
            setSetting(new Model(setting));
        }
        else {
        }
    };
    function colorPicker(e) {
        const $icon = $(this);
        if (!$icon.is('[disabled]')) {
            $icon.colorPicker({
                container: '#react-page',
                color: `#${setting.color}`,
                opacity: setting.opacity
            });
        }
    }
    function colorPickerChange(event, picker) {
        setting.color = picker.color;
        setting.opacity = picker.opacity * 100;
        setSetting(setting);
    }
    const addPicker = () => {
        $(document).on(BrowserEvents.CLICK, `.fill-color-icon, .stroke-fill-icon`, colorPicker);
        $(document).on('color-picker-change', colorPickerChange);
    };
    const removePicker = () => {
        $(document).off(BrowserEvents.CLICK, `.fill-color-icon, .stroke-fill-icon`, colorPicker);
        $(document).off('color-picker-change');
    };
    useEffect(() => {
        addPicker();
        return removePicker();
    }, [setting]);
    return setting ? React.createElement("div", { className: themeModes.length > 1 ? 'property-setting-section hasThemeMode' : 'property-setting-section' },
        React.createElement("div", { className: "custom-val" },
            React.createElement("div", { className: "val-container" },
                React.createElement(PropertyIcon, { options: [setting] }),
                React.createElement("span", { ref: $colorRef, "prop-type": "color", "data-type": "hex", className: 'color-val', title: colorValue, "is-required": "true", contentEditable: false, suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, colorValue),
                React.createElement("span", { ref: $opacityRef, "prop-type": "opacity", "data-type": "int", className: pureTokens.length ? 'opacity-val hasReferenceToken' : 'opacity-val', title: colorValue, "is-required": "true", contentEditable: false, suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, `${Math.floor(opacityValue * 100)}%`),
                React.createElement(ThemeModes, { property: setting, useThemeHandler: useThemeHandler }),
                React.createElement(PureTokens, { property: setting, pureTokens: pureTokens, useTokenHandler: useTokenHandler, detachTokenHandler: detachTokenHandler })))) : React.createElement(React.Fragment, null);
};
export default FillColor;
