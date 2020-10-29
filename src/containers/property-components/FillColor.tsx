import React, { FC, useEffect, useRef, useState } from "react";
import Color from 'color';
import PropertyIcon from './PropertyIcon';
import ThemeModes from './ThemeModes';
import PureTokens from "./PureTokens";
import useTokenSetting from 'hooks/useTokenSetting';
import usePropertySetting from 'hooks/usePropertySetting';
import useThemeModes from 'hooks/useThemeModes';
import useTokens from "hooks/useTokens";
import useProperties from 'hooks/useProperties';
import InputStatus from "enums/InputStatus";
import FillColorModel from 'model/FillColor';
import Token from 'model/Token';
import SelectText from 'utils/SelectText';
import { inputCheck, valChange } from 'utils/inputValidator';
import BrowserEvents from 'enums/BrowserEvents';
import PropertyTypes from 'enums/PropertyTypes';
import StrokeColorModel from 'model/StrokeFill';
import colorPicker from 'utils/colorPicker';

declare var $: any;
SelectText(jQuery);
colorPicker(jQuery);

// function Fill () {
//   var Fill = function (element, options) {
//     this.setIcon();
//     $(document).trigger('property-preview', [this.options]);
//   }
//   Fill.prototype.setIcon = function () {
//     // const newIcon = PropertyIcon([this.options]).$icon;
//     // hostData.$icon.replaceWith(newIcon);
//     // hostData.$icon = newIcon;
//     // if (this.options.useToken || this.options.color === 'transparent' || this.options.color === 'null') {
//     //   this.$colorOpacity.hide();
//     //   this.$icon.attr('disabled', true);
//     // } else {
//     //   this.$colorOpacity.show();
//     //   this.$icon.attr('disabled', false);
//     // }
//   }
// };

type T_FillColor = {
  value: FillColorModel | StrokeColorModel,
  propType: PropertyTypes
}
const FillColor: FC<T_FillColor> = ({
  value = null,
  propType
}: T_FillColor) => {
  const { defaultMode, themeModes, currentMode } = useThemeModes();
  const { getToken, getPureTokensByProperty } = useTokens();
  const { getProperty } = useProperties();
  const { setting: tokenSetting } = useTokenSetting();
  const { setPropertySetting } = usePropertySetting();
  const newOption = { parent: tokenSetting.token.id, themeMode: defaultMode.id };
  const Model = propType === PropertyTypes.FILL_COLOR ? FillColorModel : StrokeColorModel;
  const [ setting, setSetting ] = useState(value || new Model(newOption));
  const { color, opacity, useToken } = setting;
  const pureTokens: Array<Token> = getPureTokensByProperty(setting);
  const $colorRef = useRef();
  const $opacityRef = useRef();
  const _useToken = getToken(useToken) as Token;
  const colorValue: string = _useToken ? _useToken.name : color;
  const opacityValue = opacity;
  
  function traversingUseToken (token) {
    const existCurrentMode = token.properties.find(prop => prop.themeMode === currentMode.id);
    const useDefaultMode = token.properties.find(prop => prop.themeMode === defaultMode.id);
    const property = existCurrentMode ? existCurrentMode : useDefaultMode;
    if (property.useToken) {
      return traversingUseToken(getToken(property.useToken));
    } else {
      return property;
    }
  }

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
    const propType = $target.getAttribute('prop-type');
    const orginVal = setting[propType];
    
    $target.textContent = $target.textContent.replace(propType === 'color' ? '#' : '%', '');
    
    valChange
      .call($target, orginVal, (val) => {
        if (propType === 'opacity') {
          let _opacity = val;
          _opacity = Math.min(Math.max(0, _opacity), 100);
          if (_opacity === orginVal) return { status: InputStatus.NO_CHANGE };
          return { status: InputStatus.VALID, value: _opacity};
        }
        return val;
      })
      .then(res => {
        if (res.status === InputStatus.VALID) {
          propType === 'color' ? setting.color = Color(`#${res.value}`).hex().replace('#', '') : setting.opacity = res.value;
          setSetting(new Model(setting));
        }
      })
      .catch(res => {
        if (res.status === InputStatus.NO_CHANGE && propType === 'opacity') {
          $target.textContent = `${$target.textContent}%`;
        }
      });
      
      if ($valContainer) $valContainer.classList.remove('focus');
  }

  const useThemeHandler = (mode) => {
    setting.themeMode = mode.id;
    setSetting(new Model(setting));
  }

  const useTokenHandler = (usedToken) => {
    const usedProperty = propType === PropertyTypes.FILL_COLOR ? traversingUseToken(usedToken) as FillColorModel : traversingUseToken(usedToken) as StrokeColorModel;
    setting.useToken = usedToken.id;
    setting.color = usedProperty.color;
    setting.opacity = usedProperty.opacity;
    setting.blendMode = usedProperty.blendMode;
    setting.fillType = usedProperty.fillType;
    setting.visible = usedProperty.visible;
    setSetting(new Model(setting));
  }

  const detachTokenHandler = () => {
    const usedProperties = traversingUseToken(getToken(setting.useToken));
    setting.useToken = '';
    
    if (usedProperties.length === 1) {
      setSetting(new Model(setting));
    } else {

    }
  }

  function colorPicker (e) {
    const $icon = $(this);
    if (!$icon.is('[disabled]')) {
      $icon.colorPicker({
        container: '#react-page',
        color: `#${setting.color}`,
        opacity: setting.opacity
      });
    }
  }

  function colorPickerChange (event, picker) {
    setting.color = picker.color;
    setting.opacity = picker.opacity * 100;
    setSetting(setting);
  }

  const addPicker = () => {
    $(document).on(BrowserEvents.CLICK, `.fill-color-icon, .stroke-fill-icon`, colorPicker);
    $(document).on('color-picker-change', colorPickerChange);
  }
  const removePicker = () => {
    $(document).off(BrowserEvents.CLICK, `.fill-color-icon, .stroke-fill-icon`, colorPicker);
    $(document).off('color-picker-change')
  }
  useEffect(() => {
    addPicker();
    return removePicker();
  }, [setting]);

  return setting ? <div className={themeModes.length > 1 ? 'property-setting-section hasThemeMode' : 'property-setting-section'}>
    <div className="custom-val">
      <div className="val-container">
        <PropertyIcon options={[setting]}></PropertyIcon>
        <span ref={$colorRef} prop-type="color" data-type="hex,transparent" className='color-val' title={colorValue} is-required="true" contentEditable={false} suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={keyUpHandler} onBlur={blurHandler}>{colorValue}</span>
        <span ref={$opacityRef} prop-type="opacity" data-type="int" className={pureTokens.length ? 'opacity-val hasReferenceToken' : 'opacity-val' } title={colorValue} is-required="true" contentEditable={false} suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={keyUpHandler} onBlur={blurHandler}>{`${opacityValue}%`}</span>        
        <ThemeModes property={setting} useThemeHandler={useThemeHandler}></ThemeModes>
        <PureTokens property={setting} pureTokens={pureTokens} useTokenHandler={useTokenHandler} detachTokenHandler={detachTokenHandler}></PureTokens>
      </div>
    </div>
  </div> : <></>
}

export default FillColor;

