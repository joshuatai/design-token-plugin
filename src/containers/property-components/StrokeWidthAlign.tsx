import React, { FC, ReactElement, useEffect, useRef, useState } from "react"; 
import PropertyIcon from './PropertyIcon';
import PureTokens from "./PureTokens";
import useTokenSetting from 'hooks/useTokenSetting';
import usePropertySetting from 'hooks/usePropertySetting';
import useThemeModes from 'hooks/useThemeModes';
import useTokens from "hooks/useTokens";
import useProperties from 'hooks/useProperties';
import Token from 'model/Token';
import Model from 'model/StrokeWidthAlign';
import StrokeAligns from 'enums/StrokeAligns';
import InputStatus from "enums/InputStatus";
import SelectText from 'utils/SelectText';
import { inputCheck, valChange } from 'utils/inputValidator';

declare var $: any;
SelectText(jQuery);

type T_StrokeWidthAlign = {
  value: Model
}
const StrokeWidthAlign: FC<T_StrokeWidthAlign> = ({
  value = null
}: T_StrokeWidthAlign): ReactElement => {
  const { defaultMode, themeModes } = useThemeModes();
  const { getToken, getPureTokensByProperty } = useTokens();
  const { getProperty } = useProperties();
  const { setting: tokenSetting } = useTokenSetting();
  const { setPropertySetting } = usePropertySetting();
  const [ setting, setSetting ] = useState(value || new Model({ parent: tokenSetting.token.id, themeMode: defaultMode.id }));
  const { width, align, useToken } = setting;
  const pureTokens: Array<Token> = getPureTokensByProperty(setting);
  const $widthRef = useRef();
  const _useToken = getToken(useToken) as Token;
  const widthValue: string = _useToken ? _useToken.name : width.toString();

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
    const $width = $widthRef.current as HTMLSpanElement;
    
    valChange
      .call($width, width,(val) => {
        let _width = val;
        _width = Math.max(0, _width);
        if (_width === width) return { status: InputStatus.NO_CHANGE };
        return { status: InputStatus.VALID, value: _width};
      })
      .then(res => {
        if (res.status === InputStatus.VALID) {
          setting.width = res.value;
          setSetting(new Model(setting));
        }
      })
      .catch(res => {
        if (res.status === InputStatus.NO_CHANGE) {
        }
      });
      if ($valContainer) $valContainer.classList.remove('focus');
  }
  const selectAlign = (align, isPreview = false) => (e) => {
    setting.align = align;
    setSetting(new Model(setting));
    // if (isPreview) $(document).trigger('property-preview', [this.options]);
  }
  const useTokenHandler = (token) => {
    const usedToken: Token = getToken(token.id) as Token;
    const usedProperty: Model = getProperty(usedToken.properties[0]) as Model;
    setting.useToken = token.id;
    setting.width = usedProperty.width;
    setting.align = usedProperty.align;
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
        <span ref={$widthRef} data-type="int" className={pureTokens.length ? 'stroke-val hasReferenceToken' : 'stroke-val' } title={widthValue} is-required="true" contentEditable={false} suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={keyUpHandler} onBlur={blurHandler}>{widthValue}</span>
        {/* <ThemeModes property={setting} useThemeHandler={useThemeHandler}></ThemeModes> */}
      </div>
      {
        !setting.useToken && <div className="stroke-align btn-group">
          <button type="button" className="btn btn-border dropdown-toggle" data-toggle="dropdown">
            <span className="tmicon tmicon-caret-down"></span>
            <span>{align}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-multi-select pull-right">
            {
              Object.keys(StrokeAligns).map(item => <li key={item} className={item === align ? 'selected' : ''} onClick={selectAlign(item, true)}><a href="#">{item}</a></li>)
            }
          </ul>
        </div>
      }
      <PureTokens property={setting} pureTokens={pureTokens} useTokenHandler={useTokenHandler} detachTokenHandler={detachTokenHandler}></PureTokens>
    </div>
  </div> : <></>
}

export default StrokeWidthAlign;
