import React, { ReactElement, FC, useState, useEffect, useRef } from "react";
import BackButton from "./BackButton";
import PropertyList from "./PropertyList";
import PropertySetting from "./PropertySetting";
import useAPI from "hooks/useAPI";
import useTabs from 'hooks/useTabs';
import useThemeModes from 'hooks/useThemeModes';
import useTokenSetting from "hooks/useTokenSetting";
import usePropertySetting from "hooks/usePropertySetting";
import useData from "hooks/useData";
import useGroups from "hooks/useGroups";
import useTokens from "hooks/useTokens";
import useProperties from "hooks/useProperties";
import Token from "model/Token";
import Property from "model/Property";
import Tabs from 'enums/Tabs';
import InputStatus from "enums/InputStatus";
import { Mixed } from "symbols/index";
import { inputCheck, valChange } from "utils/inputValidator";
import SelectText from "utils/SelectText";

declare var $: any;
SelectText(jQuery);
// import _cloneDeep from 'lodash/cloneDeep';
// import _findIndex from 'lodash/findIndex';
// import PropertyView from './PropertyView';

//     if (this.token.properties.length > 0) {
//       this.$propertyView.propertyView(this.token.properties);
//     }
//   TokenSetting.prototype.choosePropertyType = function (param) {
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
//   $(document).on('property-preview', function (event, property) {
//     hostData.propertyView(property);
//   });

const TokenSetting: FC = (): ReactElement => {
  const {
    api: { admin },
  } = useAPI();
  const { tab } = useTabs();
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
  const { addToken, syncToken } = useTokens();
  const { addProperties, referedProperties } = useProperties();
  const [showPropertySetting, setShowPropertySetting] = useState(false);
  const [creatable, setCreatable] = useState(
    token && token.name ? true : false
  );
  const $name = useRef();
  const $description = useRef();
  const $backButton = useRef();
  const focusHandler = (e) => {
    if (!admin || tab !== Tabs.TOKENS) return;
    setCreatable(false);
    $(e.target).selectText();
  };
  const inputHandler = (e) => {
    if (!admin || tab !== Tabs.TOKENS) return;
    inputCheck.call(e.target, e);
  };
  const blurHandler = (e) => {
    if (!admin || tab !== Tabs.TOKENS) return;
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
  const traversingUpdate = (id: string) => {
    // console.log(propertiesSetting, token);//need to check default theme
    referedProperties(id).forEach(property => {
      const referProp = propertiesSetting.filter(prop => prop.themeMode === property.themeMode).pop();
      const referPropSetting = Object.assign({}, referProp);
      delete referPropSetting.id;
      delete referPropSetting.parent;
      delete referPropSetting.themeMode;
      delete referPropSetting.useToken;
      Object.assign(property, referPropSetting);
      traversingUpdate(property.parent);
    });
  }
  const saveTokenHandler = (e) => {
    if (!admin || tab !== Tabs.TOKENS) return;

    const exist = group.tokens.find((_token: string) => _token === token.id);
    if (!exist) group.tokens.push(token.id);
    traversingUpdate(token.id);
    saveTokensProperties(
      addGroup(group),
      addToken(token),
      addProperties(propertiesSetting)
    ).then((res) => {
      if (res.success) {
        syncToken(token);
        ($backButton.current as HTMLElement).click();
      }
    });
  };

  useEffect(() => {
    if (!admin || tab !== Tabs.TOKENS) return;
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
    if (!admin || tab !== Tabs.TOKENS) return;
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
            placeholder="Description"
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
        {admin && token && !showPropertySetting && tab === Tabs.TOKENS && (
          <div className="setting-row">
            <button
              id="add-property"
              type="button"
              disabled={!creatable}
              onClick={showPropertySettingHandler}
            >
              Create A Property
            </button>
          </div>
        )}
        {admin && showPropertySetting && (
          <PropertySetting
            token={token}
            hidePropertySetting={hidePropertySettingHandler}
          ></PropertySetting>
        )}
        {admin && tab === Tabs.TOKENS && propertiesSetting.length > 0 && (
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
