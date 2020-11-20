import React, { FC, useEffect, useRef, useState } from "react";
import PureTokens from "./PureTokens";
import PropertyIcon from "./PropertyIcon";
import useTokenSetting from "hooks/useTokenSetting";
import usePropertySetting from "hooks/usePropertySetting";
import useThemeModes from "hooks/useThemeModes";
import useTokens from "hooks/useTokens";
import useProperties from "hooks/useProperties";
import useFonts from "hooks/useFonts";
import Model from "model/FamilyStyle";
import Token from "model/Token";
import SelectText from "utils/SelectText";
import { inputCheck, valChange } from "utils/inputValidator";
import InputStatus from "enums/InputStatus";
import FontStyls from "enums/FontStyles";

declare var $: any;
SelectText(jQuery);

const fontOrders = Object.keys(FontStyls).filter((style) =>
  style.match(/[^0-9]/gi)
);
const getOrder = (styleName) => {
  let order;
  let matched = [];
  let style;
  const shortStyleNames = {
    l: 3,
    m: 11,
    b: 14,
    eb: 15,
  };
  const key = styleName.toLowerCase().replace(/\s/gi, "");
  style = Object.keys(shortStyleNames).find((style) => key === style);

  if (style) {
    order = shortStyleNames[style];
  } else {
    matched = fontOrders.filter((style) => {
      return key.match(style);
    });
    if (matched.length) {
      style = matched[0];
      if (matched.length === 2) {
        matched[0].length > matched[1].length
          ? (style = matched[0])
          : (style = matched[1]);
      }
    }

    if (style === undefined) {
      if (
        styleName === "Italic" ||
        styleName === "Condensed" ||
        styleName === "Oblique"
      ) {
        order = 9;
      } else {
        order = 0;
      }
    } else {
      order = FontStyls[style];
    }
  }
  return order;
};
const styleCompare = (a, b) => {
  const aOrder = getOrder(a);
  const bOrder = getOrder(b);
  if (aOrder > bOrder) return 1;
  if (aOrder < bOrder) return -1;
  return 0;
};

type T_Font = {
  value: Model;
};
const Font: FC<T_Font> = ({ value = null }: T_Font) => {
  const { fonts } = useFonts();
  const { defaultMode, themeModes } = useThemeModes();
  const { getToken, getPureTokensByProperty } = useTokens();
  const { getProperty, traversing } = useProperties();
  const { setting: tokenSetting } = useTokenSetting();
  const { setPropertySetting } = usePropertySetting();
  const [setting, setSetting] = useState(
    value ||
      new Model({ parent: tokenSetting.token.id, themeMode: defaultMode.id })
  );
  const { family, style, useToken } = setting;
  const pureTokens: Array<Token> = getPureTokensByProperty(setting);
  const $fontFamilyRef = useRef();
  const _useToken = getToken(useToken) as Token;
  const dotFonts = [];
  let _fonts = Object.keys(fonts).sort(Intl.Collator().compare);
  _fonts = _fonts
    .filter((font) => {
      const match = font.match(/^\./gi);
      if (match) dotFonts.push(font);
      return !match;
    })
    .concat(...dotFonts);
  const getStyle = (_family) => {
    const _styles = fonts[_family];
    const fontStyles = Object.keys(_styles).map((key) => _styles[key].style);
    const italics = [];
    const condenseds = [];
    let defaultStyle = "";
    const weights = fontStyles.filter((style) => {
      const matchItalic = style.match(/italic/gi);
      const matchCondenseds = style.match(/condensed/gi);
      if (matchItalic) italics.push(style);
      if (matchCondenseds) condenseds.push(style);
      if (style.toLowerCase() === "regular" || style.toLowerCase() === "b") {
        defaultStyle = style;
      }
      return !matchItalic && !matchCondenseds;
    });
    condenseds.sort(styleCompare);
    weights.sort(styleCompare);
    italics.sort(styleCompare);
    if (condenseds.length > 0) condenseds.push(undefined);
    if (italics.length > 0) italics.unshift(undefined);

    return {
      styles: [condenseds, weights, italics].flat(),
      default: defaultStyle,
    };
  };
  const _styles = getStyle(family).styles;
  const familyVal: string = _useToken ? _useToken.name : family;

  const familySelect = (_family) => (e) => {
    setting.family = _family;
    setting.style = getStyle(_family).default;
    setSetting(new Model(setting));
  };
  const styleSelect = (_style) => (e) => {
    setting.style = _style;
    setSetting(new Model(setting));
  };
  const focusHandler = (e) => {
    if (_useToken) return;
    const $target = e.target;
    const $valContainer = $target.closest(".val-container");
    $($target).selectText();
    if ($valContainer) $valContainer.classList.add("focus");
  };
  const keyDownHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const keyUpHandler = (e) => {
    const $target: HTMLElement = e.target;
    const value = $target.textContent;
    inputCheck.call($target, e);
    const searchRegx = new RegExp(`^${value}`, "gi");
    const possibleName = _fonts.find((name) => name.search(searchRegx) > -1);
    const range = document.createRange();
    if (e.key === "Delete" || e.key === "Backspace" || e.key === "Enter")
      return;
    if (possibleName) {
      $target.textContent = possibleName;
      range.setStart($target.firstChild, value.length);
      range.setEnd($target.firstChild, possibleName.length);
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(range);
    }
  };
  const blurHandler = (e) => {
    const $target = e.target;
    const value = $target.textContent;
    const $valContainer = $target.closest(".val-container");
    const orginVal = setting.family;

    valChange
      .call($target, orginVal, (val) => {
        if (_fonts.some((name) => name === value)) {
          return { status: InputStatus.VALID, value: val };
        } else {
          return { status: InputStatus.NO_CHANGE };
        }
      })
      .then((res) => {
        if (res.status === InputStatus.VALID) {
          setting.family = res.value;
          setting.style = getStyle(res.value).default;
          setSetting(new Model(setting));
        }
      })
      .catch((res) => {});

    if ($valContainer) $valContainer.classList.remove("focus");
  };
  const useTokenHandler = (token: Token) => {
    const usedToken: Token = getToken(token.id) as Token;
    const usedProperty: Model = getProperty(usedToken.properties[0]) as Model;
    setting.useToken = token.id;
    setting.family = usedProperty.family;
    setting.style = usedProperty.style;
    setSetting(new Model(setting));
  };
  const detachTokenHandler = () => {
    const usedProperties = traversing(getToken(setting.useToken));
    setting.useToken = "";
    setSetting(new Model(setting));
  };

  useEffect(() => {
    setPropertySetting(setting);
  }, [setting]);

  return setting ? (
    <div
      className={
        themeModes.length > 1
          ? "property-setting-section hasThemeMode"
          : "property-setting-section"
      }
    >
      <div className="custom-val">
        <div className="val-container">
          <PropertyIcon options={[setting]}></PropertyIcon>
          <div className="input-group">
            <span
              className={
                pureTokens.length
                  ? "font-family-val hasReferenceToken"
                  : "font-family-val"
              }
              ref={$fontFamilyRef}
              prop-type="family"
              title={family}
              is-required="true"
              placeholder="Font Family"
              contentEditable={false}
              suppressContentEditableWarning={true}
              onClick={focusHandler}
              onKeyUp={keyUpHandler}
              onKeyDown={keyDownHandler}
              onBlur={blurHandler}
            >
              {familyVal}
            </span>
            {!_useToken && (
              <div className="input-group-btn">
                <button
                  type="button"
                  className="btn btn-border dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <i className="tmicon tmicon-caret-down"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-multi-select family-dropdowns">
                  {_fonts.map((fontName, index) => {
                    return (
                      <li
                        key={`font-item-${index}`}
                        data-index={index}
                        className={fontName === family ? "selected" : ""}
                        onClick={familySelect(fontName)}
                      >
                        <a href="#">{fontName}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <PureTokens
            property={setting}
            pureTokens={pureTokens}
            useTokenHandler={useTokenHandler}
            detachTokenHandler={detachTokenHandler}
          ></PureTokens>
        </div>
        {!_useToken && (
          <div className="val-container font-style-container">
            <div className="input-group-btn">
              <button
                type="button"
                className="btn btn-border dropdown-toggle style-dropdown-toggle"
                data-toggle="dropdown"
                disabled={_styles.length === 1}
              >
                <span>{style}</span>
                <i className="tmicon tmicon-caret-down"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-multi-select style-dropdown">
                {_styles.map((_style, index) => {
                  const itemProps = {
                    key: `style-item-${index}`,
                    className: _style === style ? "selected" : "",
                    onClick: styleSelect(_style),
                    "data-index": index,
                  };
                  if (_style)
                    return (
                      <li {...itemProps}>
                        <a href="#">{_style}</a>
                      </li>
                    );
                  else
                    return (
                      <li
                        data-index={index}
                        key={`style-item-${index}`}
                        className="divider"
                      ></li>
                    );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Font;
