import React, { FC, ReactElement, MouseEventHandler } from "react";
import PropertySetting from "./PropertySetting";
import PropertyIcon from "./property-components/PropertyIcon";
import useTabs from "hooks/useTabs";
import useTokenSetting from "hooks/useTokenSetting";
import usePropertySetting from "hooks/usePropertySetting";
import usePropertyInfo from "hooks/usePropertyInfo";
import useProperties from "hooks/useProperties";
import Token from "model/Token";
import Properties from "model/Properties";
import Property from "model/Property";
import Tabs from "enums/Tabs";

type T_RemoveIcon = {
  referedTokens: Array<Token>;
  removeHandler: MouseEventHandler;
};
const RemoveIcon: FC<T_RemoveIcon> = ({
  referedTokens = [],
  removeHandler = null,
}: T_RemoveIcon): ReactElement => {
  const props =
    referedTokens.length > 0
      ? {
          "data-disabled": true,
          title: `This token has been linked by the tokens: ${referedTokens
            .map((token) => token.name)
            .join(", ")}`,
        }
      : {
          "data-disabled": false,
          onClick: removeHandler,
        };
  return (
    <span className="remove-property" {...props}>
      <svg
        className="svg"
        width="12"
        height="6"
        viewBox="0 0 12 6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5 3.5H.5v-1h11v1z"
          fillRule="nonzero"
          fillOpacity="1"
          fill="#000"
          stroke="none"
        ></path>
      </svg>
    </span>
  );
};

type T_PropertyItem = {
  property: Property;
};
const PropertyItem: FC<T_PropertyItem> = ({
  property,
}: T_PropertyItem): ReactElement => {
  const { tab } = useTabs();
  const { setting } = useTokenSetting();
  const { token } = setting;
  const { title, value, secondValue, thridValue } = usePropertyInfo(property);
  const { referedTokens } = useProperties();
  const {
    resetPropertySetting,
    propertyEdit,
    setPropertyEdit,
  } = usePropertySetting();
  const refereds = referedTokens(property.parent) as Array<Token>;
  const removeHandler = () => {
    if (tab !== Tabs.TOKENS) return;
    resetPropertySetting(property);
  };
  const showPropertySettingHandler = () => {
    if (tab !== Tabs.TOKENS) return;
    setPropertyEdit(new Properties[property.type](property));
  };

  const hidePropertySetting = () => {
    setPropertyEdit(null);
  };
  
  return (
    <>
      <li
        className={tab === Tabs.TOKENS ? 'editable property-item' : 'property-item'}
        data-id={property.id}
        onClick={showPropertySettingHandler}
      >
        <span className="sortable-handler"></span>
        <span className="property-name">{property.type}</span>
        <PropertyIcon options={[property]}></PropertyIcon>
        <span className="property-value" title={title}>
          {value}
        </span>
        {secondValue && (
          <span className="property-second-value" title={title}>
            {secondValue}
          </span>
        )}
        {thridValue && (
          <span className="property-third-value" title={title}>
            {thridValue}
          </span>
        )}
        {tab === Tabs.TOKENS && (
          <RemoveIcon
            referedTokens={refereds}
            removeHandler={removeHandler}
          ></RemoveIcon>
        )}
      </li>
      {propertyEdit && propertyEdit.id === property.id && (
        <PropertySetting
          token={token}
          property={propertyEdit}
          hidePropertySetting={hidePropertySetting}
        ></PropertySetting>
      )}
    </>
  );
};

export default PropertyItem;
