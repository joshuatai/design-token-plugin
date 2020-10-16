import React, { useEffect, useState } from "react";
import PropertyIcon from './PropertyIcon';
import PureTokens from "./PureTokens";
import useTokens from "hooks/useTokens";
import usePropertySetting from 'hooks/usePropertySetting';
import useProperties from 'hooks/useProperties';
import Model from 'model/CornerRadius';
import { Mixed } from 'symbols/index';
import InputStatus from "enums/InputStatus";
import { Validator, inputCheck, valChange } from 'utils/inputValidator';
import SelectText from 'utils/SelectText';
SelectText(jQuery);
const CornerRadius = ({ value = null }) => {
    const { getToken, getPureTokensByProperty } = useTokens();
    const { getProperty } = useProperties();
    const [setting, setSetting] = useState(value || new Model());
    const defaultSeparateType = 'topLeft';
    const [separateType, setSeparateType] = useState(defaultSeparateType);
    const { setPropertySetting } = usePropertySetting();
    const { radius, topLeft, topRight, bottomLeft, bottomRight, useToken } = setting;
    const pureTokens = getPureTokensByProperty(setting);
    const _useToken = getToken(useToken);
    const radiusValue = _useToken ? _useToken.name : radius === Mixed ? 'Mixed' : radius.toString();
    const focusHandler = (e) => {
        if (_useToken)
            return;
        const $target = e.target;
        const $container = $target.closest('.val-container, .btn-group');
        $($target).selectText();
        if ($container) {
            $container.classList.add('focus');
            if ($container.classList.contains('btn-group')) {
                setSeparateType($target.getAttribute('prop-type'));
            }
        }
    };
    const keyUpHandler = (e) => {
        inputCheck.call(e.target, e);
    };
    const blurHandler = (e) => {
        const $target = e.target;
        const $container = $target.closest('.val-container, .btn-group');
        const propType = $target.getAttribute('prop-type');
        const orginVal = setting[propType];
        valChange
            .call($target, orginVal, (val) => {
            let _val = val;
            _val = Math.max(0, _val);
            if (_val === orginVal)
                return { status: InputStatus.NO_CHANGE };
            return { status: InputStatus.VALID, value: _val };
        })
            .then(res => {
            const value = res.value;
            if (res.status === InputStatus.VALID) {
                if (propType === 'radius') {
                    if (Validator.int(value)) {
                        setting.radius = value;
                        setting.topLeft = value;
                        setting.topRight = value;
                        setting.bottomRight = value;
                        setting.bottomLeft = value;
                    }
                }
                else {
                    if (Validator.int(value)) {
                        setting[propType] = value;
                        const uniqueValues = [...new Set([
                                setting.topLeft,
                                setting.topRight,
                                setting.bottomRight,
                                setting.bottomLeft
                            ])];
                        uniqueValues.length === 1 ? setting.radius = value : setting.radius = Mixed;
                    }
                }
                setSetting(new Model(setting));
            }
        })
            .catch(res => {
            if (res.status === InputStatus.NO_CHANGE) { }
        });
        if ($container) {
            $container.classList.remove('focus');
            if ($container.classList.contains('btn-group')) {
                setSeparateType(defaultSeparateType);
            }
        }
    };
    const useTokenHandler = (token) => {
        const usedToken = getToken(token.id);
        const usedProperty = getProperty(usedToken.properties[0]);
        const { radius, topLeft, topRight, bottomRight, bottomLeft } = usedProperty;
        setting.useToken = token.id;
        Object.assign(setting, {
            radius,
            topLeft,
            topRight,
            bottomRight,
            bottomLeft
        });
        setSetting(new Model(setting));
    };
    const detachTokenHandler = () => {
        setting.useToken = '';
        setSetting(new Model(setting));
    };
    useEffect(() => {
        setPropertySetting(setting);
    }, [setting]);
    return setting ? React.createElement("div", { className: "property-setting-section", "property-component": "corner-radius" },
        React.createElement("div", { className: "custom-val" },
            !_useToken && React.createElement("button", { id: "separator-toggle", type: "button", className: "btn separator-icon", "data-toggle": "button", "aria-pressed": "false" },
                React.createElement("svg", { className: "svg", width: "10", height: "10", viewBox: "0 0 10 10", xmlns: "http://www.w3.org/2000/svg" },
                    React.createElement("path", { d: "M0 0h3v1H1v2H0V0zm7 0h3v3H9V1H7V0zM1 9V7H0v3h3V9H1zm9-2v3H7V9h2V7h1z", fillRule: "nonzero", fillOpacity: "1", fill: "#000", stroke: "none" }))),
            React.createElement("div", { className: "val-container" },
                React.createElement(PropertyIcon, { options: [setting] }),
                React.createElement("span", { "data-type": "int, mixed", "prop-type": "radius", className: pureTokens.length ? 'corner-radius-val hasReferenceToken' : 'corner-radius-val', title: radiusValue, "is-required": "true", contentEditable: false, suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, radiusValue),
                React.createElement(PureTokens, { property: setting, pureTokens: pureTokens, useTokenHandler: useTokenHandler, detachTokenHandler: detachTokenHandler })),
            React.createElement("div", { className: "separator-vals" },
                React.createElement("i", { className: "separator-mode-sign", "separate-type": separateType }),
                React.createElement("div", { className: "btn-group" },
                    React.createElement("div", { className: "btn", "data-type": "int", "prop-type": "topLeft", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, topLeft),
                    React.createElement("div", { className: "btn", "data-type": "int", "prop-type": "topRight", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, topRight),
                    React.createElement("div", { className: "btn", "data-type": "int", "prop-type": "bottomRight", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, bottomRight),
                    React.createElement("div", { className: "btn", "data-type": "int", "prop-type": "bottomLeft", contentEditable: "false", suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, bottomLeft))))) : React.createElement(React.Fragment, null);
};
export default CornerRadius;
