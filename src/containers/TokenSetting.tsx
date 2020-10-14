import React, { ReactElement, FC, useState, useEffect, useRef, MouseEventHandler } from "react";
import useAPI from 'hooks/useAPI';
import useTokenSetting from 'hooks/useTokenSetting';
import usePropertySetting from "hooks/usePropertySetting";
import useData from 'hooks/useData';
import useGroups from 'hooks/useGroups';
import useTokens from 'hooks/useTokens';
import useProperties from 'hooks/useProperties';
import Token from 'model/Token';
import Property from 'model/Property';
import BackButton from './BackButton';
import PropertyList from './PropertyList';
import PropertyConponents from './property-components';
import InputStatus from 'enums/InputStatus';
import PropertyTypes from 'enums/PropertyTypes';
import { Mixed } from 'symbols/index';
import { inputCheck, valChange } from 'utils/inputValidator';
import SelectText from 'utils/SelectText';

declare var $: any;
SelectText(jQuery);
// import _cloneDeep from 'lodash/cloneDeep';
// import _findIndex from 'lodash/findIndex';
// import BrowserEvents from '../enums/BrowserEvents';
// import { getGroup, getToken, setToken, syncToken, save, syncNode } from '../model/DataManager';
// import PropertyView from './PropertyView';
// 

// PropertyView(jQuery);

// export default function ($) {
  
//   const getPropertySettingSection = (prop) => {
//     return $('<div class="property-setting-section"></div>')
//       .data({
//         token: hostData.token,
//         propertyView: hostData.$propertyView
//       })
//       [PropertyConponents[prop.type]](prop);
//   }

//   var TokenSetting = function (element, { group, token }) {

  
//     this.$element = $(element)
//       .append($propertyView)
//       .append(
//         $propertySetting
//           .append($settingButtonsRow.append($settingCancelBtn.add($settingCreateBtn).add($settingUpdateBtn)))
//       )
//       .show();

//     if (this.token.properties.length > 0) {
//       this.$propertyList.propertyList(this.token.properties);
//       this.$propertyView.propertyView(this.token.properties);
//     }
//   };

  // TokenSetting.prototype.propertyEdit = function (editable: Boolean, property?: any) {
      
    // this.$propertyTypeRow[property? 'hide' : 'show']();
    
  //   this.$propertySettingSections.hide().empty();
  //   this.$propertyTypeDropdowns.children().show();


  //   if (property) {
  //     const properties = [];
      
  //     if (!property.length) properties.push(property);
  //      else properties.push(...property);

  //     this.choosePropertyType(properties);
  //   }
  // };
//   TokenSetting.prototype.choosePropertyType = function (param) {
//     let type = param;
//     let settings;
//     this.$propertySettingSections.empty();
//     if (typeof param === 'object') {
//       type = param[0].type;
//       this.$settingUpdateBtn.show();
//       settings = param.map(prop => getPropertySettingSection(prop));
//       $('.property-item:hover').after(this.$propertySetting);
//     } else {

//     }
//     
//   };

//   TokenSetting.prototype.removeProperty = function (property) {
//     $.each(this.token.properties, (i, prop) => {
//         if (prop && prop.id === property.id) {
//             this.token.properties.splice(i, 1);
//         }
//     });
//     this.updateProperty();
//   };
//   TokenSetting.prototype.updateProperty = function () {
//     if (this.token.properties.length > 0) {
//       this.$propertyList.propertyList(this.token.properties);
//       const propertyTypes = Object.keys(this.token.properties.reduce((calc, property) => {
//         calc[property.type] = property.type;
//         return calc;
//       }, {}));
//       this.token.propertyType = propertyTypes.length === 1 ? propertyTypes[0] : Mixed;
//     } else {
//     }
//     this.propertyEdit(false);
//     this.$propertyView.propertyView(this.token.properties);
//     syncToken(this.token);
//     save();
//     syncNode(this.token);
//   };
//   TokenSetting.prototype.propertyView = function (property) {
//     const tmpProperties = _cloneDeep(this.token.properties);

//     if (property) {
//       const existIndex = _findIndex(tmpProperties, prop => prop.id === property.id);
//       existIndex > -1 ? tmpProperties[existIndex] = property : tmpProperties.push(property);
//     }
//     this.$propertyView.propertyView(tmpProperties);
//   }
//   TokenSetting.prototype.changeThemeMode = function () {
//     this.$propertyView.propertyView('rerender');
//   }
//   TokenSetting.prototype.destroy = function () {
//       return this.$element.empty().removeData().hide();
//   };

//   function canAddProperty (callback) {
//     return function (e) {
//       callback.call(this, e);
//       hostData.canAddProperty();
//     }
//   }
//   // done
//   $(document).on(BrowserEvents.CLICK, '#token-setting #turn-back-btn', $.debounce(260, function () {
//     const { token } = hostData;
//     hostData.$element.trigger('destroy:TokenSetting', [token]).destroy();
//   }));
//   $(document).on(BrowserEvents.DBCLICK, '.token-name, .token-description', function (e) {
//     $(this).selectText();
//   });
//   $(document).on(`${BrowserEvents.KEY_UP}`, '.token-name, .token-description', canAddProperty(inputCheck));
//   $(document).on(`${BrowserEvents.BLUR}`, '.token-name, .token-description', canAddProperty(valChange));

//   $(document).on(BrowserEvents.CLICK, '#property-type a', function (event) {
//     hostData.choosePropertyType($(this).text());
//   });
//   $(document).on(BrowserEvents.CLICK, '#property-setting-create, #property-setting-update', function () {
//     hostData.createProperty();
//   });
//   $(document).on('property-remove', '#property-list', function (event, property) {
//     hostData.removeProperty(property);
//   });
//   $(document).on('property-sort', '#property-list', function (event, properties) {
//     hostData.token.properties = properties;
//     hostData.updateProperty();
//   });
//   $(document).on('property-edit', '#property-list', function (event, property) {
//     hostData.propertyEdit(true, property);
//   });
//   $(document).on('property-preview', function (event, property) {
//     hostData.propertyView(property);
//   });
  
// }(jQuery);


type T_PropertySetting = {
  token: Token,
  property?: any,
  cancelHandler: React.MouseEventHandler,
  createHandler: React.MouseEventHandler
}
const PropertySetting: FC<T_PropertySetting> = ({
  token = null,
  property = null,
  cancelHandler = null,
  createHandler = null
}) => {
  const initTypeLabel = 'Choose a type of property';
  const { propertySetting, setPropertySetting, createPropertySetting } = usePropertySetting();
  const [ choosedType, setChoosedType ] = useState(undefined);
  const $dropdownBtn = useRef();
  const $chooseType = useRef();
  const Property = PropertyConponents[PropertyTypes[choosedType]];
  const _chooseTypeHandler = (e) => {
    const type = e.target.getAttribute('type');
    setChoosedType(type);
  }
  const createPropertyHandler = (e) => {
    propertySetting.parent = token.id;
    setPropertySetting(propertySetting);
    createPropertySetting();
    createHandler(e);

    // const settings = $.makeArray(this.$propertySettingSections.children()).map(setting => $(setting).data('value'));
//     let referedProperty;
//     let referPropIndex = -1;
//     if (settings.length > 1) {
//       referedProperty = this.$propertySetting.prev().data('property');
//       referPropIndex = _findIndex(this.token.properties, prop => prop.id === referedProperty.id);
//       this.token.properties.splice(referPropIndex, 1, ...settings);
//     } else {
//     }
//     this.updateProperty();
  }

  return <div id="property-setting">
    <div id="property-type-row" className="setting-row">
      <div id="property-type" className="btn-group">
        <button
          type="button"
          ref={$dropdownBtn}
          className="btn btn-border dropdown-toggle"
          data-toggle="dropdown"
          aria-expanded="false"
          value={choosedType}
        >
          <i className="tmicon tmicon-caret-down"></i>
          <span ref={$chooseType}>{ choosedType ? PropertyTypes[choosedType] : initTypeLabel }</span>
        </button>
        <ul className="dropdown-menu">
          {
            Object.keys(PropertyTypes)
              .sort()
              .map(type => {
                let isShow = true;
                // properties.forEach((property: any) => {
                //   if (
                //     property.type === PropertyTypes.CORNER_RADIUS || 
                //     property.type === PropertyTypes.STROKE_WIDTH_ALIGN
                //   ) isShow = false;
                // })
                if (isShow) {
                  return <li key={type} className={`property-type-${type}`} onClick={_chooseTypeHandler}>
                    <a href="#" type={type}>{PropertyTypes[type]}</a>
                  </li>
                }
              })
          }
        </ul>
      </div>
    </div>
    <div id="property-setting-sections" className="setting-row">
      {
        Property && <Property></Property>
      }
    </div>
    <div className="setting-row">
      <button id="property-setting-cancel" type="button" className="btn btn-sm btn-border" onClick={cancelHandler}>Cancel</button>
      {
        choosedType &&
        <>
          {
            !property && <button id="property-setting-create" type="button" className="btn btn-sm btn-primary" onClick={createPropertyHandler}>Create</button>
          }
          {
            property && <button id="property-setting-update" type="button" className="btn btn-sm btn-primary">Update</button>
          }
        </>
      } 
    </div>
  </div>
}
const TokenSetting: FC = (): ReactElement => {
  const { api: { admin }} = useAPI();
  const { initialSetting, setting, setToken, setTokenSetting } = useTokenSetting();
  const { group, token } = setting;
  const { propertiesSetting, setPropertiesSetting } = usePropertySetting();
  const { saveTokensProperties } = useData();
  const { addGroup } = useGroups();
  const { addToken } = useTokens();
  const { addProperties } = useProperties();
  const [ showPropertySetting, setShowPropertySetting ] = useState(false);
  const [ creatable, setCreatable ] = useState(token && token.name ? true : false);
  const $name = useRef();
  const $description = useRef();
  const $backButton = useRef();
  
  const focusHandler = (e) => {
    if (!admin) return;
    setCreatable(false);
    $(e.target).selectText();
  }
  const inputHandler = (e) => {
    if (!admin) return;
    inputCheck.call(e.target, e);
  }
  const blurHandler = (e) => {
    if (!admin) return;
    const $target = e.target;
    const type = $target.getAttribute('prop-type');
    valChange
      .call($target, token[type], (val) => {
        return val;
      })
      .then(res => {
        if (res.status === InputStatus.VALID) {
          token[type] = $target.textContent;
          setToken(token);
          setCreatable(true);
        }
      })
      .catch(res => {
        if (res.status === InputStatus.NO_CHANGE) setCreatable(true);
      });
  }
  const showPropertyHandler = () => {
    setShowPropertySetting(true);
  }
  const hidePropertyHandler = () => {
    setShowPropertySetting(false);
  }
  const createPropertyHandler = () => {
    setShowPropertySetting(false);
  }
  const cancelTokenHandler = () => {
    setPropertiesSetting([]);
    setTokenSetting(Object.assign({}, initialSetting));
  }
  const saveTokenHandler = (e) => {
    // this.$propertyList.propertyList(this.token.properties);
    const exist = group.tokens.find((_token: string) => _token === token.id);
    if (!exist) group.tokens.push(token.id);
    saveTokensProperties(addGroup(group), addToken(token), addProperties(propertiesSetting))
      .then(res => {
        if (res.success) {
          ($backButton.current as HTMLElement).click();
        }
      });
  }

  useEffect(() => {
    if (!token) {
      const newToken = new Token({ parent: group.id });
      setTokenSetting({
        group,
        token: newToken
      });
    } else if (!token.name) {
      $($name.current).selectText();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const properties = [];
      if (propertiesSetting.length > 0) {
        const propertyTypes = Object.keys(propertiesSetting.reduce((calc, property: Property) => {
          properties.push(property.id);
          calc[property.type] = property.type;
          return calc;
        }, {}));
        token.propertyType = propertyTypes.length === 1 ? propertyTypes[0] : Mixed;
      } else {
        token.propertyType = '';
      }
      token.properties = properties;
      setToken(token);
    }
  }, [propertiesSetting]);

  return token &&
    <div id="token-setting" className="plugin-panel" >
      <div className="setting-row">
        <BackButton _ref={$backButton} onClick={cancelTokenHandler} />
        <h6 id="panel-group-name">{group.name}</h6>
      </div>
      <div className="setting-row">
        <span
          ref={$name}
          className="token-name"
          prop-type="name"
          placeholder="Token Name"
          is-required="true"
          contentEditable="false"
          suppressContentEditableWarning={true}
          onClick={focusHandler}
          onKeyUp={inputHandler}
          onBlur={blurHandler}
        >
          {token.name}
        </span>
      </div>
      <div className="setting-row">
        <span
          ref={$description}
          className="token-description"
          prop-type="description"
          placeholder="Add Description"
          contentEditable="false"
          suppressContentEditableWarning={true}
          onClick={focusHandler}
          onKeyUp={inputHandler}
          onBlur={blurHandler}
        >
          {token.description}
        </span>
      </div>
      <div id="property-view" className="setting-row"></div>
      <PropertyList ></PropertyList>
      <div className="setting-row">
        {
          token &&
          !showPropertySetting &&
          <button id="add-property" type="button" disabled={!creatable} onClick={showPropertyHandler}>Create a new property</button>
        }
      </div>
      {
        showPropertySetting && <PropertySetting token={token} createHandler={createPropertyHandler} cancelHandler={hidePropertyHandler}></PropertySetting>
      }
      {
        propertiesSetting.length > 0 &&
        <div className="setting-row">
          <button type="button" className="btn btn-sm btn-primary" disabled={token.name === ''} onClick={saveTokenHandler}>Save</button>
        </div>
      }
    </div>
};
export default TokenSetting;