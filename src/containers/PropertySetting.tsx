import React, {
  ReactElement,
  FC,
  useState,
  useRef,
  MouseEventHandler,
} from "react";
import Token from "model/Token";
import Property from "model/Property";
import PropertyConponents from "./property-components";
import usePropertySetting from "hooks/usePropertySetting";
import PropertyTypes from "enums/PropertyTypes";

type T_PropertySetting = {
  token: Token;
  property?: Property;
  hidePropertySetting?: MouseEventHandler;
};
const PropertySetting: FC<T_PropertySetting> = ({
  token = null,
  property = null,
  hidePropertySetting = null,
}: T_PropertySetting): ReactElement => {
  const initTypeLabel = "Choose a type of property";
  const {
    propertySetting,
    setPropertySetting,
    createPropertySetting,
  } = usePropertySetting();
  const [choosedType, setChoosedType] = useState(
    property ? property.type : undefined
  );
  const $settingRef = useRef();
  const $dropdownBtn = useRef();
  const $chooseType = useRef();
  const PropertyComponent = PropertyConponents[choosedType];
  const _chooseTypeHandler = (e) => {
    setPropertySetting(null);
    const type = e.target.getAttribute("type");
    setChoosedType(type);
  };
  const updatePropertyHandler = (e) => {
    setPropertySetting(propertySetting);
    createPropertySetting();
    hidePropertySetting(e);

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
  };

  return (
    <div id="property-setting" ref={$settingRef}>
      {!property ? (
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
              <span ref={$chooseType}>
                {choosedType ? choosedType : initTypeLabel}
              </span>
            </button>
            <ul className="dropdown-menu">
              {Object.keys(PropertyTypes)
                .sort()
                .map((type) => {
                  let isShow = true;
                  // properties.forEach((property: any) => {
                  //   if (
                  //     property.type === PropertyTypes.CORNER_RADIUS ||
                  //     property.type === PropertyTypes.STROKE_WIDTH_ALIGN
                  //   ) isShow = false;
                  // })
                  if (isShow) {
                    return (
                      <li
                        key={type}
                        className={`property-type-${type}`}
                        onClick={_chooseTypeHandler}
                      >
                        <a href="#" type={PropertyTypes[type]}>
                          {PropertyTypes[type]}
                        </a>
                      </li>
                    );
                  }
                })}
            </ul>
          </div>
        </div>
      ) : null}
      <div id="property-setting-sections" className="setting-row">
        {PropertyComponent && (
          <PropertyComponent value={property} propType={choosedType}></PropertyComponent>
        )}
      </div>
      <div className="setting-row">
        <button
          id="property-setting-cancel"
          type="button"
          className="btn btn-sm btn-border"
          onClick={hidePropertySetting}
        >
          Cancel
        </button>
        {
          choosedType && 
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={updatePropertyHandler}
          >
            {!property ? 'Create' : 'Update'}
          </button>
        }
      </div>
    </div>
  );
};

export default PropertySetting;
