import React, { FC, ReactElement, useContext } from "react";
import usePropertyInfo from 'hooks/usePropertyInfo';
import Properties from 'model/Properties';
import Icon from './Icon';
import Property from "model/Property";

type T_PropertyIcon = {
  options: Array<Property>,
  disabled?: boolean,
  fromTokenList?: boolean
};

const PropertyIcon: FC<T_PropertyIcon> = ({
  options,
  disabled = false,
  fromTokenList = false
}: T_PropertyIcon): ReactElement => {
  let _property;
  if (options.length === 1) {
    _property = new Properties[options[0].type](options[0]);
  } else if (options.length > 1) {
    _property = options.map(option => new Properties[option.type](option));
  }
  const { type, title, style } = usePropertyInfo(_property, fromTokenList);
  return <Icon type={type} title={title} style={style} disabled={disabled}></Icon>;
}

export default PropertyIcon;
