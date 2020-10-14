import React, { useEffect, FC, useRef, useContext, ReactElement } from "react";
import useData from 'hooks/useData';
import useAPI from 'hooks/useAPI';
import { ThemeModesContext } from  'hooks/ThemeModeProvider';
import useThemeModes from 'hooks/useThemeModes';
import ThemeMode from 'model/ThemeMode';
import SelectText from 'utils/SelectText';
import preventEvent from 'utils/preventEvent';
import { inputCheck, valChange } from 'utils/inputValidator';
import InputStatus from 'enums/InputStatus';

declare var $: any;
SelectText(jQuery);
type T_ThemeModeItem = {
  data: {
    id: string,
    name: string,
    isDefault: Boolean
  },
  creatable
}

const ThemeModeItem:FC<T_ThemeModeItem> = ({
  data,
  creatable
}: T_ThemeModeItem) => {
  const { api: { admin } } = useAPI();
  const { saveThemeModes } = useData();
  const { getThemeMode, addThemeMode, removeThemeMode } = useThemeModes();
  const $modeName = useRef();

  const removeHandler = (e) => {
    if (!data.isDefault) {
      removeThemeMode(data as ThemeMode);
      creatable(true);
    }
    // updateCurrentThemeMode();
  }
  const blurHandler = (e) => {
    const $name = $modeName.current as HTMLElement;
    creatable(false);
    valChange
      .call($name, data.name)
      .then(res => {
        if (res.status === InputStatus.VALID) {
          const ThemeMode: ThemeMode = getThemeMode(data.id) as ThemeMode;
          ThemeMode.name = $name.textContent;
          const themeModes = addThemeMode(ThemeMode);
          saveThemeModes(themeModes)
            .then(res => {
              creatable(true);
            });
        }
      })
      .catch(res => {
        if (res.status === InputStatus.NO_CHANGE) creatable(true);
      });
  }
  const focusHandler = (e) => {
    if (!admin) return;
    $($modeName.current).selectText();
    preventEvent(e);
  }
  const inputHandler = (e) => {
    const $name = $modeName.current;
    inputCheck.call($name, e);
  }

  useEffect(() => {
    const $name = $modeName.current as HTMLElement;
    if (admin && $name && !$name.innerHTML) $name.click();
  }, []);

  return <li id={`mode-${data.id}`} data-id={data.id}>
    <span ref={$modeName} className="theme-mode-name" data-id={data.id} is-required="true" contentEditable="false" suppressContentEditableWarning={true} onClick={focusHandler} onKeyUp={inputHandler} onBlur={blurHandler}>{data.name}</span>
    {
      admin && <span className="remove-mode" data-disabled={data.isDefault} onClick={removeHandler} >
        <svg className="svg" width="12" height="6" viewBox="0 0 12 6" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.5 3.5H.5v-1h11v1z" fillRule="nonzero" fillOpacity="1" fill="#000" stroke="none"></path>
        </svg>
      </span>
    }
  </li>;
}

type T_ThemeModeList = {
  creatable
}

const ThemeModeList: FC<T_ThemeModeList> = ({
  creatable
}: T_ThemeModeList) => {
  const themeModes = useContext(ThemeModesContext);

  return (<ul id="mode-list">
    {
      themeModes.map(mode => <ThemeModeItem key={mode.id} data={mode} creatable={creatable}></ThemeModeItem>)
    }
  </ul>);
};

export default ThemeModeList;
