import React, { ReactElement, FC, useState, useEffect, useRef } from "react";
import useAPI from "hooks/useAPI";
import useTokenSetting from "hooks/useTokenSetting";
import usePropertySetting from "hooks/usePropertySetting";
import useData from "hooks/useData";
import useGroups from "hooks/useGroups";
import useTokens from "hooks/useTokens";
import useProperties from "hooks/useProperties";
import Token from "model/Token";
import Property from "model/Property";
import BackButton from "./BackButton";
import PropertyList from "./PropertyList";
import PropertySetting from "./PropertySetting";
import InputStatus from "enums/InputStatus";
import { Mixed } from "symbols/index";
import { inputCheck, valChange } from "utils/inputValidator";
import SelectText from "utils/SelectText";

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
//     this.$element = $(element)
//       .append($propertyView)
//     if (this.token.properties.length > 0) {
//       this.$propertyView.propertyView(this.token.properties);
//     }


// TokenSetting.prototype.propertyEdit = function (editable: Boolean, property?: any) {
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
//     }
//   };

//   TokenSetting.prototype.updateProperty = function () {
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
//   // done
//   $(document).on(BrowserEvents.CLICK, '#token-setting #turn-back-btn', $.debounce(260, function () {
//     const { token } = hostData;
//     hostData.$element.trigger('destroy:TokenSetting', [token]).destroy();
//   }));
//   $(document).on(BrowserEvents.DBCLICK, '.token-name, .token-description', function (e) {
//     $(this).selectText();
//   });

//   $(document).on('property-sort', '#property-list', function (event, properties) {
//     hostData.token.properties = properties;
//     hostData.updateProperty();
//   });
//   $(document).on('property-preview', function (event, property) {
//     hostData.propertyView(property);
//   });

// }(jQuery);

const TokenSetting: FC = (): ReactElement => {
  const {
    api: { admin },
  } = useAPI();
  const {
    initialSetting,
    setting,
    setToken,
    setTokenSetting,
  } = useTokenSetting();
  const { group, token } = setting;
  const {
    propertiesSetting,
    setPropertiesSetting,
    setPropertyEdit,
  } = usePropertySetting();
  const { saveTokensProperties } = useData();
  const { addGroup } = useGroups();
  const { addToken } = useTokens();
  const { addProperties } = useProperties();
  const [showPropertySetting, setShowPropertySetting] = useState(false);
  const [creatable, setCreatable] = useState(
    token && token.name ? true : false
  );
  const $name = useRef();
  const $description = useRef();
  const $backButton = useRef();

  const focusHandler = (e) => {
    if (!admin) return;
    setCreatable(false);
    $(e.target).selectText();
  };
  const inputHandler = (e) => {
    if (!admin) return;
    inputCheck.call(e.target, e);
  };
  const blurHandler = (e) => {
    if (!admin) return;
    const $target = e.target;
    const type = $target.getAttribute("prop-type");
    valChange
      .call($target, token[type], (val) => {
        return val;
      })
      .then((res) => {
        if (res.status === InputStatus.VALID) {
          token[type] = $target.textContent;
          setToken(token);
          setCreatable(true);
        }
      })
      .catch((res) => {
        if (res.status === InputStatus.NO_CHANGE) setCreatable(true);
      });
  };
  const showPropertySettingHandler = () => {
    setShowPropertySetting(true);
  };
  const hidePropertySettingHandler = () => {
    setShowPropertySetting(false);
  };
  const cancelTokenHandler = () => {
    setPropertyEdit(null);
    setPropertiesSetting([]);
    setTokenSetting(Object.assign({}, initialSetting));
  };
  const saveTokenHandler = (e) => {
    const exist = group.tokens.find((_token: string) => _token === token.id);
    if (!exist) group.tokens.push(token.id);
    saveTokensProperties(
      addGroup(group),
      addToken(token),
      addProperties(propertiesSetting)
    ).then((res) => {
      if (res.success) {
        ($backButton.current as HTMLElement).click();
      }
    });
  };

  useEffect(() => {
    if (!token) {
      const newToken = new Token({ parent: group.id });
      setTokenSetting({
        group,
        token: newToken,
      });
    } else if (!token.name) {
      $($name.current).selectText();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const properties = [];
      if (propertiesSetting.length > 0) {
        const propertyTypes = Object.keys(
          propertiesSetting.reduce((calc, property: Property) => {
            properties.push(property.id);
            calc[property.type] = property.type;
            return calc;
          }, {})
        );
        token.propertyType =
          propertyTypes.length === 1 ? propertyTypes[0] : Mixed;
      } else {
        token.propertyType = "";
      }
      token.properties = properties;
      setToken(token);
    }
  }, [propertiesSetting]);

  return (
    token && (
      <div id="token-setting" className="plugin-panel">
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
        <PropertyList></PropertyList>
        <div className="setting-row">
          {token && !showPropertySetting && (
            <button
              id="add-property"
              type="button"
              disabled={!creatable}
              onClick={showPropertySettingHandler}
            >
              Create a new property
            </button>
          )}
        </div>
        {showPropertySetting && (
          <PropertySetting
            token={token}
            hidePropertySetting={hidePropertySettingHandler}
          ></PropertySetting>
        )}
        {propertiesSetting.length > 0 && (
          <div className="setting-row">
            <button
              id="save-button-container"
              type="button"
              className="btn btn-sm btn-primary"
              disabled={token.name === ""}
              onClick={saveTokenHandler}
            >
              Save
            </button>
          </div>
        )}
      </div>
    )
  );
};
export default TokenSetting;
