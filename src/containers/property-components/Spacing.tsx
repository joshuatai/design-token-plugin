import React, { FC, useEffect, useRef, useState } from "react";
import PropertyIcon from './PropertyIcon';
import PureTokens from "./PureTokens";
import usePropertySetting from 'hooks/usePropertySetting';
import useTokens from "hooks/useTokens";
import useProperties from 'hooks/useProperties';
import InputStatus from "enums/InputStatus";
import validator from 'validator';
import Model from 'model/Spacing';
import Token from 'model/Token';
import SelectText from 'utils/SelectText';
import { inputCheck, valChange } from 'utils/inputValidator';

declare var $: any;
SelectText(jQuery);


//     $(document).trigger('property-preview', [this.options]);
//   }
//   Spacing.prototype.useToken = function (token) {
//     this.options.value = token.properties[0].value;
//     this.$spacingValue.text(token.name).attr('contenteditable', false).attr('title', token.name);
//   }
//   Spacing.prototype.detachToken = function (token) {
//     const usedProperty = token.properties[0];
//     this.$spacingValue
//       .text(usedProperty.value)
//       .attr('contenteditable', true)
//       .removeAttr('title');
//   }

//   $(document).on(`${BrowserEvents.BLUR} ${BrowserEvents.KEY_UP}`, `[property-component="${NAME}"] .spacing-val[contenteditable="true"]`, function (event) {
//     const $this = $(this);
//     if (event.type === BrowserEvents.KEY_UP) {
//       if (event.key === 'Enter') $('.btn-primary').trigger('focus');
//       return;
//     }
//     const options = hostData.options;
//     let value =  $this.text();
    
//     if (!validator.isInt(value)) value = options.value;
//     value = Math.max(0, value);
//     options.value = value;
//     $this.text(value);
//     $(document).trigger('property-preview', [options]);
//   });
//   return NAME;
// }(jQuery);

type T_Spacing = {
  value: Model
}
const Spacing: FC<T_Spacing> = ({
  value = null
}: T_Spacing) => {
  const { getToken, getPureTokensByProperty } = useTokens();
  const { getProperty } = useProperties();
  const [ setting, setSetting ] = useState(value || new Model());
  const { setPropertySetting } = usePropertySetting();
  const { value: spacing, useToken } = setting;
  const pureTokens: Array<Token> = getPureTokensByProperty(setting);
  const $spacingRef = useRef();
  const _useToken = getToken(useToken) as Token;
  const spacingValue = _useToken ? _useToken.name : spacing.toString();

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
    const $spacing = $spacingRef.current as HTMLSpanElement;
    valChange
      .call($spacing, spacing, (val) => {
        let _spacing = val;
        _spacing = Math.max(0, _spacing);
        return { status: InputStatus.VALID, value: _spacing};
      })
      .then(res => {
        if (res.status === InputStatus.VALID) {
          setting.value = res.value;
          setSetting(new Model(setting));
        }
      })
      .catch(res => {
        if (res.status === InputStatus.NO_CHANGE) {}
      });
      if ($valContainer) $valContainer.classList.remove('focus');
  }

  const useTokenHandler = (token) => {
    const usedToken: Token = getToken(token.id) as Token;
    const usedProperty: Model = getProperty(usedToken.properties[0]) as Model;
    setting.useToken = token.id;
    setting.value = usedProperty.value;
    setSetting(new Model(setting));
  }

  const detachTokenHandler = () => {
    setting.useToken = '';
    setSetting(new Model(setting));
  }
  
  useEffect(() => {
    setPropertySetting(setting);
  }, [setting]);

  return setting ? <div className="property-setting-section">
    <div className="custom-val">
      <div className="val-container">
        <PropertyIcon options={[setting]}></PropertyIcon>
        <span ref={$spacingRef} data-type="int" className={pureTokens.length ? 'spacing-val hasReferenceToken' : 'spacing-val' } title={spacingValue} is-required="true" contentEditable={false} suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={keyUpHandler} onBlur={blurHandler}>{spacingValue}</span>
        <PureTokens property={setting} pureTokens={pureTokens} useTokenHandler={useTokenHandler} detachTokenHandler={detachTokenHandler}></PureTokens>
      </div>
    </div>
  </div> : <></>
}
export default Spacing;