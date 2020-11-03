import React, { useEffect, useRef, useState } from "react";
import PropertyIcon from './PropertyIcon';
import PureTokens from "./PureTokens";
import useThemeModes from 'hooks/useThemeModes';
import useTokenSetting from 'hooks/useTokenSetting';
import usePropertySetting from 'hooks/usePropertySetting';
import useTokens from "hooks/useTokens";
import useProperties from 'hooks/useProperties';
import InputStatus from "enums/InputStatus";
import Model from 'model/Spacing';
import SelectText from 'utils/SelectText';
import { inputCheck, valChange } from 'utils/inputValidator';
SelectText(jQuery);
const Spacing = ({ value = null }) => {
    const { defaultMode } = useThemeModes();
    const { getToken, getPureTokensByProperty } = useTokens();
    const { getProperty } = useProperties();
    const { setting: tokenSetting } = useTokenSetting();
    const { setPropertySetting } = usePropertySetting();
    const [setting, setSetting] = useState(value || new Model({ parent: tokenSetting.token.id, themeMode: defaultMode.id }));
    const { value: spacing, useToken } = setting;
    const pureTokens = getPureTokensByProperty(setting);
    const $spacingRef = useRef();
    const _useToken = getToken(useToken);
    const spacingValue = _useToken ? _useToken.name : spacing.toString();
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
        const $target = e.target;
        const $valContainer = $target.closest('.val-container');
        const $spacing = $spacingRef.current;
        valChange
            .call($spacing, spacing, (val) => {
            let _spacing = val;
            _spacing = Math.max(0, _spacing);
            return { status: InputStatus.VALID, value: _spacing };
        })
            .then(res => {
            if (res.status === InputStatus.VALID) {
                setting.value = res.value;
                setSetting(new Model(setting));
            }
        })
            .catch(res => {
            if (res.status === InputStatus.NO_CHANGE) { }
        });
        if ($valContainer)
            $valContainer.classList.remove('focus');
    };
    const useTokenHandler = (token) => {
        const usedToken = getToken(token.id);
        const usedProperty = getProperty(usedToken.properties[0]);
        setting.useToken = token.id;
        setting.value = usedProperty.value;
        setSetting(new Model(setting));
    };
    const detachTokenHandler = () => {
        setting.useToken = '';
        setSetting(new Model(setting));
    };
    useEffect(() => {
        setPropertySetting(setting);
    }, [setting]);
    return setting ? React.createElement("div", { className: "property-setting-section" },
        React.createElement("div", { className: "custom-val" },
            React.createElement("div", { className: "val-container" },
                React.createElement(PropertyIcon, { options: [setting] }),
                React.createElement("span", { ref: $spacingRef, "data-type": "int", className: pureTokens.length ? 'spacing-val hasReferenceToken' : 'spacing-val', title: spacingValue, "is-required": "true", contentEditable: false, suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, spacingValue),
                React.createElement(PureTokens, { property: setting, pureTokens: pureTokens, useTokenHandler: useTokenHandler, detachTokenHandler: detachTokenHandler })))) : React.createElement(React.Fragment, null);
};
export default Spacing;
