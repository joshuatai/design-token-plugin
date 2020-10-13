import React, { useEffect, FC, useRef, useContext, useState } from "react";
import usePropertySetting from 'hooks/usePropertySetting';
import Model from 'model/Opacity';
import LinkToken from "./LinkToken";
// import CommonSettings from './CommonSettings';
import { ThemeModesContext } from 'hooks/ThemeModeProvider';
import ThemeModes from './ThemeModes';
import PropertyIcon from './PropertyIcon';
import SelectText from 'utils/SelectText';
import { valChange } from 'utils/inputValidator';
import InputStatus from "enums/InputStatus";

declare var $: any;
SelectText(jQuery);


// function t() {
//   var Opacity = function (element, options) {
//     const useToken = getToken(options.useToken);

//     // this.$opacityValue = $('').attr('contenteditable', !useToken);
    
//     const commonSetting = CommonSettings(this);
//     this.$token = commonSetting.$token;
    
//     this.$element
//       .append(
//         this.$customVal
//           .append(
//             this.$valContainer
//               .append(this.$icon)
//               .append(
//                 this.$opacityValue.text(opacityValue).attr('title', opacityValue).addClass(this.tokenList.length ? 'hasReferenceToken' : '')
//               )
//               .append(this.$token)
//           )
//       );
//     $(document).trigger('property-preview', [this.options]);
//   }
//   Opacity.prototype.setIcon = function () {
//     const newIcon = PropertyIcon([this.options]).$icon;
//     this.$icon.replaceWith(newIcon);
//     this.$icon = newIcon;
//     if (this.options.useToken) {
//       this.$icon.attr('disabled', true);
//     } else {
//       this.$icon.attr('disabled', false);
//     }
//   }
//   Opacity.prototype.useToken = function (token) {
//     this.options.opacity = token.properties[0].opacity;
//     this.$opacityValue.text(token.name).attr('contenteditable', false).attr('title', token.name);
//   }
//   Opacity.prototype.detachToken = function (token) {
//     const usedProperty = token.properties[0];
//     this.$opacityValue
//       .text(`${usedProperty.opacity}%`)
//       .attr('contenteditable', true)
//       .removeAttr('title');
//   }


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
  const themeModes = useContext(ThemeModesContext);
  const [ setting, setSetting ] = useState(value || new Model());
  const { setPropertySetting } = usePropertySetting();
  const [ focused, setFocused ] = useState(false);
  const { opacity } = setting;
  const $opacityRef = useRef();
  let opacityValue;
  // const useToken = getToken(options.useToken);
  const useToken = false;
  // useToken ? opacityValue = useToken.name : opacityValue = `${this.options.opacity}%`;
  opacityValue = `${opacity}%`;
  
  const focusHandler = (e) => {
    setFocused(true);
  }
  const keyUpHandler = (e) => {
    if (e.key === 'Enter') ($opacityRef.current as HTMLSpanElement).blur();
  }
  const blurHandler = (e) => {
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
        setFocused(false);
      })
      .catch(res => {
        if (res.status === InputStatus.NO_CHANGE) {
          $opacity.textContent = `${$opacity.textContent}%`;
          setFocused(false);
        }
      });
  }
  useEffect(() => {
    if (focused) $($opacityRef.current).selectText();
  }, [focused]);

  useEffect(() => {
    setPropertySetting(setting);
  }, [setting]);
  
  return setting ? <div className={themeModes.length > 1 ? 'property-setting-section hasThemeMode' : 'property-setting-section'} property-componen="opacity">
    <div className="custom-val">
      <div className={ focused ? 'val-container focus' : 'val-container' }>
        <PropertyIcon options={[setting]}></PropertyIcon>
        <span ref={$opacityRef} data-type="number" className="opacity-val" title={opacityValue} is-required="true" contentEditable={false} suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={keyUpHandler} onBlur={blurHandler}>{opacityValue}</span>
        <ThemeModes property={setting}></ThemeModes>
        <LinkToken property={setting}></LinkToken>
      </div>
    </div>
  </div> : <></>
}
export default Opacity;