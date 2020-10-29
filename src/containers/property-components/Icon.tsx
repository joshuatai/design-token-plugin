import React, { FC, ReactElement } from "react";
import PropertyTypes from 'enums/PropertyTypes';

const _Icons = {
  [PropertyTypes.CORNER_RADIUS]: ({ title }) => <span className="corner-radius-icon" title={title}></span>,
  [PropertyTypes.STROKE_WIDTH_ALIGN]: ({ title }) => <span className="stroke-width-icon" title={title}></span>,
  [PropertyTypes.STROKE_FILL]: ({ title }) => <div className="stroke-fill-icon" title={title}></div>,
  [PropertyTypes.FILL_COLOR]: ({ title, style }) => <div className="fill-color-icon" title={title} style={{ background: style.background }}><div className="color-icon-opacity" style={{ opacity: style.opacity, width: style.width }}></div></div>,
  [PropertyTypes.OPACITY]: ({ title }) => <div className="opacity-icon color-icon-opacity" title={title}></div>,
  [PropertyTypes.FONT]: ({ title }) => <div className="font-icon" title={title}>A</div>,
  [PropertyTypes.SPACING]: ({ title }) => 
    <div className="spacing-icon" title={title}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 8.38237L3.71667 5.45318L3.71667 11.3116L1 8.38237Z" fill="black"/>
      <path d="M3 8.5L13 8.5" stroke="black"/>
      <path d="M15 8.38234L12.2833 11.3115V5.45315L15 8.38234Z" fill="black"/>
      <line x1="0.5" y1="2.45985e-08" x2="0.499999" y2="16" stroke="black"/>
      <line x1="15.5" y1="2.63555e-08" x2="15.5" y2="16" stroke="black"/>
      </svg>
    </div>
};

type T_Icon = {
  type,
  title,
  style
};
const Icon: FC<T_Icon> = ({
  type,
  title,
  style
}: T_Icon): ReactElement => {
  const PropertyIcon = _Icons[type];

  return <PropertyIcon title={title} style={style}></PropertyIcon>
};

export default Icon;
