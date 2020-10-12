import React, { FC, ReactElement } from "react";
import PropertyTypes from 'enums/PropertyTypes';

const _Icons = {
  [PropertyTypes.CORNER_RADIUS]: ({
    option
  }) => {
    // const isUseToken = options.useToken;
    // if (themeModes.length > 1) {
    //   applyThemeMode = property.themeMode;
    //   applyThemeMode ? thridValue = getThemeMode(applyThemeMode).name : thridValue = defaultMode.name;
    // }
    const value = `${option.opacity}%`;
//     if (isUseToken) {
//       const useToken = getToken(property.useToken);
//       value = useToken.name;
//       secondValue = '';
//       property = traversingUseToken(useToken);
//     }
    const title = `Opacity: ${option.opacity}%`; 

    return <span title={title} className="corner-radius-icon"></span>;
  },
  [PropertyTypes.STROKE_WIDTH_ALIGN]: () => <span className="stroke-width-icon"></span>,
  [PropertyTypes.STROKE_FILL]: () => <div className="stroke-fill-icon"></div>,
  [PropertyTypes.FILL_COLOR]: () => <div className="fill-color-icon"><div className="color-icon-opacity"></div></div>,
  [PropertyTypes.OPACITY]: () => <div className="opacity-icon color-icon-opacity"></div>,
  [PropertyTypes.FONT]: () => <div className="font-icon">A</div>,
  [PropertyTypes.SPACING]: () => 
    <div className="spacing-icon">
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
  option: {
    type
  }
};
const Icon: FC<T_Icon> = ({
  option = null
}: T_Icon): ReactElement => {
  const PropertyIcon = _Icons[option.type];

  return <PropertyIcon option={option}></PropertyIcon>
};

export default Icon;
