import React, { FC, useEffect, useRef, useState } from "react";
import PropertyIcon from './PropertyIcon';
import PureTokens from "./PureTokens";
import useTokens from "hooks/useTokens";
import usePropertySetting from 'hooks/usePropertySetting';
import useProperties from 'hooks/useProperties';


import validator from 'validator';
import Model from 'model/CornerRadius';
import Token from 'model/Token';
import { Mixed } from 'symbols/index';
import { inputCheck, valChange } from 'utils/inputValidator';
import InputStatus from "enums/InputStatus";
import camelize from 'utils/camelize';
import BrowserEvents from 'enums/BrowserEvents';

import { getToken } from 'model/DataManager';
import SelectText from 'utils/SelectText';

declare var $: any;
SelectText(jQuery);


  // var Radius = function (element, options) {
  //   const useToken = getToken(options.useToken);
  //   let radiusValue;
    
    
  //   // this.$token = CommonSettings(this).$token;
  //   const commonSetting = { $token: null } //CommonSettings(this);
  //   this.$token = commonSetting.$token;

  // 


  //   $(document).trigger('property-preview', [this.options]);
  // }
  // Radius.prototype.detachToken = function (token) {

  // }


  // $(document).on(BrowserEvents.CLICK, `[property-component="Name"] [data-separate-type]`, function () {
  //   const separateBtn = $(this);
  //   hostData.$separateIcon.attr('separate-type', separateBtn.data('separate-type'));
  // });

  // $(document).on(`${BrowserEvents.BLUR} `, `[property-component="Radius"] .separator-vals [data-separate-type], [property-component="Radius"] .corner-radius-val[contenteditable="true"]`, function (event) {
  //   const $this = $(this);
  //   const { separateType } = $this.data();
  //   const options = hostData.options;
  //   let value =  $this.text();
  //   let oldVal;
    
  //   if (separateType) {
  //     oldVal = options[camelize(separateType)];
  //     if (validator.isInt(value)) {
  //       value = Math.max(0, Number(value));
  //       options[camelize(separateType)] = value;
  //       const uniqueValues = [...new Set(
  //           separators.map(type => options[camelize(type)])
  //         )
  //       ];
  //       if (uniqueValues.length === 1) {
  //         hostData.$radiusValue.text(value);
  //         options.radius = Number(value);
  //       } else {
  //         hostData.$radiusValue.text('Mixed');
  //         options.radius = Mixed;
  //       }
  //     } else {
  //       $this.text(oldVal);
  //     }
  //   } else {
  //     oldVal = options.radius;
  //     if (validator.isInt(value)) {
  //       value = Math.max(0, Number(value));
  //       options.radius = value;
  //       separators.forEach(type => {
  //         options[camelize(type)] = Number(value);
  //       }); 
  //       hostData.$radiusValue.add(hostData.$separateRadius).text(value);
  //     } else {
  //       if (typeof oldVal === 'symbol') {
  //         $this.text('Mixed');
  //       } else {
  //         $this.text(oldVal);
  //       }
  //     }
  //   }
  //   $(document).trigger('property-preview', [options]);
  // });


type T_CornerRadius = {
  value: Model
}
const CornerRadius: FC<T_CornerRadius> = ({
  value = null
}: T_CornerRadius) => {
  const { getToken, getPureTokensByProperty } = useTokens();
  const { getProperty } = useProperties();
  const [ setting, setSetting ] = useState(value || new Model());
  const { setPropertySetting } = usePropertySetting();
  const [ focused, setFocused ] = useState(false);
  const { radius, topLeft, topRight, bottomLeft, bottomRight, useToken } = setting;
  const pureTokens: Array<Token> = getPureTokensByProperty(setting);
  const _useToken = getToken(useToken) as Token;
  const $radiusRef = useRef();
  const radiusValue = _useToken ? _useToken.name : radius === Mixed ? 'Mixed' : radius.toString();

  const focusHandler = (e) => {
    if (_useToken) return;
    $(e.target).selectText();
    setFocused(true);
  }
  const keyUpHandler = (e) => {
    // if (e.key === 'Enter') ($radiusRef.current as HTMLSpanElement).blur();
    const input = e.target;
    inputCheck.call(input, e);
      // if (_apiKeyInput.getAttribute('invalid') || _binIDInput.getAttribute('invalid') || _adminPWDInput.getAttribute('invalid')) {
      //   setSavable(false);
      // } else {
      //   if (!_binIDInput.textContent && !_adminPWDInput.textContent) {
      //     setSavable(false);
      //     return 
      //   }
      //   setSavable(true);
      // }
    
    
  }
  const blurHandler = (e) => {
    const $target = e.target;
    const propType = $target.getAttribute('prop-type');
    const orginVal = setting[propType];
    console.log(orginVal)
    // const $opacity = $opacityRef.current as HTMLSpanElement;
    // $opacity.textContent = $opacity.textContent.replace('%', '');
    valChange
      .call($target, orginVal, (val) => {
        let _val = val;
        _val = Math.max(0, _val);
        if (_val === orginVal) return { status: InputStatus.NO_CHANGE };
        return { status: InputStatus.VALID, value: _val};
      })
      .then(res => {
        if (res.status === InputStatus.VALID) {
          setting[propType] = res.value;
          setSetting(new Model(setting));
        }
        setFocused(false);
      })
      .catch(res => {
        if (res.status === InputStatus.NO_CHANGE) {
          // $target.textContent = `${$opacity.textContent}%`;
          setFocused(false);
        }
      });
  }
  const useTokenHandler = (token) => {
    const usedToken: Token = getToken(token.id) as Token;
    const usedProperty: Model = getProperty(usedToken.properties[0]) as Model;
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
  }
  const detachTokenHandler = () => {
    const detachedToken = getToken(setting.useToken);
    setting.useToken = '';
    setSetting(new Model(setting));
      //   const usedProperty = token.properties[0];
  //   this.$radiusValue
  //     .text(typeof usedProperty.radius === 'symbol' ? 'Mixed' : usedProperty.radius)
  //     .attr('contenteditable', true)
  //     .removeAttr('title');
  //   separators.forEach(type => {
  //     $(`[data-separate-type="${type}"]`).text(this.options[camelize(type)]);
  //   });
  }

  // useEffect(() => {
  //   // if (focused) $($opacityRef.current).selectText();
  // }, [focused]);

  useEffect(() => {
    setPropertySetting(setting);
  }, [setting]);

  return setting ? <div className="property-setting-section" property-component="corner-radius">
    <div className="custom-val">
      {
        !_useToken && <button id="separator-toggle" type="button" className="btn separator-icon" data-toggle="button" aria-pressed="false">
          <svg className="svg" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h3v1H1v2H0V0zm7 0h3v3H9V1H7V0zM1 9V7H0v3h3V9H1zm9-2v3H7V9h2V7h1z" fillRule="nonzero" fillOpacity="1" fill="#000" stroke="none"></path>
          </svg>
        </button>
      }
      <div className={ focused ? 'val-container focus' : 'val-container' }>
        <PropertyIcon options={[setting]}></PropertyIcon>
        <span ref={$radiusRef} data-type="number" prop-type="radius" className={pureTokens.length ? 'corner-radius-val hasReferenceToken' : 'corner-radius-val' } title={radiusValue} is-required="true" contentEditable={false} suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={keyUpHandler} onBlur={blurHandler}>{radiusValue}</span>
        <PureTokens property={setting} pureTokens={pureTokens} useTokenHandler={useTokenHandler} detachTokenHandler={detachTokenHandler}></PureTokens>
      </div>
      <div className="separator-vals">
        <i className="separator-mode-sign" separate-type="top-left"></i>
        <div className="btn-group">
          <div className="btn" prop-type="top-left" contentEditable="false" suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={keyUpHandler} onBlur={blurHandler}>{topLeft}</div>
          <div className="btn" prop-type="top-right" contentEditable="false" suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={keyUpHandler} onBlur={blurHandler}>{topRight}</div>
          <div className="btn" prop-type="bottom-right" contentEditable="false" suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={keyUpHandler} onBlur={blurHandler}>{bottomRight}</div>
          <div className="btn" prop-type="bottom-left" contentEditable="false" suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={keyUpHandler} onBlur={blurHandler}>{bottomLeft}</div>
        </div>
      </div>
    </div>
  </div> : <></>
}

export default CornerRadius;