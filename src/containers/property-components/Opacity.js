import React, { useEffect, useRef, useState } from "react";
import PropertyIcon from './PropertyIcon';
import ThemeModes from './ThemeModes';
import PureTokens from "./PureTokens";
import usePropertySetting from 'hooks/usePropertySetting';
import useThemeModes from 'hooks/useThemeModes';
import useTokens from "hooks/useTokens";
import useProperties from 'hooks/useProperties';
import InputStatus from "enums/InputStatus";
import Model from 'model/Opacity';
import SelectText from 'utils/SelectText';
import { inputCheck, valChange } from 'utils/inputValidator';
SelectText(jQuery);
const Opacity = ({ value = null }) => {
    const { defaultMode, themeModes } = useThemeModes();
    const { getToken, getPureTokensByProperty } = useTokens();
    const { getProperty } = useProperties();
    const [setting, setSetting] = useState(value || new Model({ themeMode: defaultMode.id }));
    const { setPropertySetting } = usePropertySetting();
    const { opacity, useToken } = setting;
    const pureTokens = getPureTokensByProperty(setting);
    const $opacityRef = useRef();
    const _useToken = getToken(useToken);
    const opacityValue = _useToken ? _useToken.name : `${opacity}%`;
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
        const $opacity = $opacityRef.current;
        $opacity.textContent = $opacity.textContent.replace('%', '');
        valChange
            .call($opacity, opacity, (val) => {
            let _opacity = val;
            _opacity = Math.min(Math.max(0, _opacity), 100);
            if (_opacity === opacity)
                return { status: InputStatus.NO_CHANGE };
            return { status: InputStatus.VALID, value: _opacity };
        })
            .then(res => {
            if (res.status === InputStatus.VALID) {
                setting.opacity = res.value;
                setSetting(new Model(setting));
            }
        })
            .catch(res => {
            if (res.status === InputStatus.NO_CHANGE) {
                $opacity.textContent = `${$opacity.textContent}%`;
            }
        });
        if ($valContainer)
            $valContainer.classList.remove('focus');
    };
    const useThemeHandler = (mode) => {
        setting.themeMode = mode.id;
        setSetting(new Model(setting));
    };
    const useTokenHandler = (token) => {
        const usedToken = getToken(token.id);
        const usedProperty = getProperty(usedToken.properties[0]);
        setting.useToken = token.id;
        setting.opacity = usedProperty.opacity;
        setSetting(new Model(setting));
    };
    const detachTokenHandler = () => {
        setting.useToken = '';
        setSetting(new Model(setting));
    };
    useEffect(() => {
        setPropertySetting(setting);
    }, [setting]);
    return setting ? React.createElement("div", { className: themeModes.length > 1 ? 'property-setting-section hasThemeMode' : 'property-setting-section' },
        React.createElement("div", { className: "custom-val" },
            React.createElement("div", { className: "val-container" },
                React.createElement(PropertyIcon, { options: [setting] }),
                React.createElement("span", { ref: $opacityRef, "data-type": "int", className: pureTokens.length ? 'opacity-val hasReferenceToken' : 'opacity-val', title: opacityValue, "is-required": "true", contentEditable: false, suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, opacityValue),
                React.createElement(ThemeModes, { property: setting, useThemeHandler: useThemeHandler }),
                React.createElement(PureTokens, { property: setting, pureTokens: pureTokens, useTokenHandler: useTokenHandler, detachTokenHandler: detachTokenHandler })))) : React.createElement(React.Fragment, null);
};
export default Opacity;
