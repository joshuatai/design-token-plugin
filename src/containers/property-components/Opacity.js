import React, { useEffect, useRef, useState } from "react";
import usePropertySetting from 'hooks/usePropertySetting';
import Model from 'model/Opacity';
import LinkToken from "./LinkToken";
// import { getToken } from 'model/DataManager';
// import CommonSettings from './CommonSettings';
import PropertyIcon from './PropertyIcon';
import SelectText from 'utils/SelectText';
import { valChange } from 'utils/inputValidator';
import InputStatus from "enums/InputStatus";
SelectText(jQuery);
const Opacity = ({ value = null }) => {
    const [setting, setSetting] = useState(value || new Model());
    const { setProperty } = usePropertySetting();
    const [focused, setFocused] = useState(false);
    const { opacity } = setting;
    const $opacityRef = useRef();
    // const useToken = getToken(options.useToken);
    const useToken = false;
    // useToken ? opacityValue = useToken.name : opacityValue = `${this.options.opacity}%`;
    //setProperty(value || new Model())
    const focusHandler = (e) => {
        setFocused(true);
    };
    const keyUpHandler = (e) => {
        if (e.key === 'Enter')
            $opacityRef.current.blur();
    };
    const blurHandler = (e) => {
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
            setFocused(false);
        })
            .catch(res => {
            if (res.status === InputStatus.NO_CHANGE) {
                $opacity.textContent = `${$opacity.textContent}%`;
                setFocused(false);
            }
        });
    };
    useEffect(() => {
        if (focused)
            $($opacityRef.current).selectText();
    }, [focused]);
    useEffect(() => {
        setProperty(setting);
    }, [setting]);
    return setting && React.createElement("div", { className: "property-setting-section", "property-componen": "opacity" },
        React.createElement("div", { className: "custom-val" },
            React.createElement("div", { className: focused ? 'val-container focus' : 'val-container' },
                React.createElement(PropertyIcon, { options: [setting] }),
                React.createElement("span", { ref: $opacityRef, "data-type": "number", className: "opacity-val", "is-required": "true", contentEditable: false, suppressContentEditableWarning: true, onClick: focusHandler, onKeyUp: keyUpHandler, onBlur: blurHandler }, `${opacity}%`),
                React.createElement(LinkToken, { property: setting }))));
};
export default Opacity;
