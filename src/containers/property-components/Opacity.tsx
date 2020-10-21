import React, { FC, useEffect, useRef, useState } from "react";
import PropertyIcon from './PropertyIcon';
import ThemeModes from './ThemeModes';
import PureTokens from "./PureTokens";
import useTokenSetting from 'hooks/useTokenSetting';
import usePropertySetting from 'hooks/usePropertySetting';
import useThemeModes from 'hooks/useThemeModes';
import useTokens from "hooks/useTokens";
import useProperties from 'hooks/useProperties';
import InputStatus from "enums/InputStatus";
import Model from 'model/Opacity';
import Token from 'model/Token';
import SelectText from 'utils/SelectText';
import { inputCheck, valChange } from 'utils/inputValidator';

declare var $: any;
SelectText(jQuery);
// function t() {
//   $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .opacity-val[contenteditable="true"]`, function (event) {
//     $(document).trigger('property-preview', [options]);
//   });
// }

type T_Opacity = {
  value: Model
}
const Opacity: FC<T_Opacity> = ({
  value = null
}: T_Opacity) => {
  const { defaultMode, themeModes } = useThemeModes();
  const { getToken, getPureTokensByProperty } = useTokens();
  const { getProperty } = useProperties();
  const { setting: tokenSetting } = useTokenSetting();
  const { setPropertySetting } = usePropertySetting();
  const [ setting, setSetting ] = useState(value || new Model({ parent: tokenSetting.token.id, themeMode: defaultMode.id }));
  const { opacity, useToken } = setting;
  const pureTokens: Array<Token> = getPureTokensByProperty(setting);
  const $opacityRef = useRef();
  const _useToken = getToken(useToken) as Token;
  const opacityValue: string = _useToken ? _useToken.name : `${opacity}%`;

  const focusHandler = (e) => {
    if (_useToken) return;
    const $target = e.target;
    const $valContainer = $target.closest('.val-container');
    $($target).selectText();
    if ($valContainer) $valContainer.classList.add('focus');
  }
  const keyUpHandler = (e) => {
    inputCheck.call(e.target, e);
  }
  const blurHandler = (e) => {
    const $target = e.target;
    const $valContainer = $target.closest('.val-container');
    const $opacity = $opacityRef.current as HTMLSpanElement;
    $opacity.textContent = $opacity.textContent.replace('%', '');
    valChange
      .call($opacity, opacity, (val) => {
        let _opacity = val;
        _opacity = Math.min(Math.max(0, _opacity), 100);
        if (_opacity === opacity) return { status: InputStatus.NO_CHANGE };
        return { status: InputStatus.VALID, value: _opacity};
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
      if ($valContainer) $valContainer.classList.remove('focus');
  }
  const useThemeHandler = (mode) => {
    setting.themeMode = mode.id;
    setSetting(new Model(setting));
  }
  const useTokenHandler = (token) => {
    const usedToken: Token = getToken(token.id) as Token;
    const usedProperty: Model = getProperty(usedToken.properties[0]) as Model;
    setting.useToken = token.id;
    setting.opacity = usedProperty.opacity;
    setSetting(new Model(setting));
  }
  const detachTokenHandler = () => {
    setting.useToken = '';
    setSetting(new Model(setting));
  }

  useEffect(() => {
    setPropertySetting(setting);
  }, [setting]);

  return setting ? <div className={themeModes.length > 1 ? 'property-setting-section hasThemeMode' : 'property-setting-section'}>
    <div className="custom-val">
      <div className="val-container">
        <PropertyIcon options={[setting]}></PropertyIcon>
        <span ref={$opacityRef} data-type="int" className={pureTokens.length ? 'opacity-val hasReferenceToken' : 'opacity-val' } title={opacityValue} is-required="true" contentEditable={false} suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={keyUpHandler} onBlur={blurHandler}>{opacityValue}</span>
        <ThemeModes property={setting} useThemeHandler={useThemeHandler}></ThemeModes>
        <PureTokens property={setting} pureTokens={pureTokens} useTokenHandler={useTokenHandler} detachTokenHandler={detachTokenHandler}></PureTokens>
      </div>
    </div>
  </div> : <></>
}
export default Opacity;