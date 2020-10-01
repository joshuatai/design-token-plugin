import React, { useState, useEffect, FC } from "react";
import useThemeModes from 'hooks/useThemeModes';
import ThemeMode from 'model/ThemeMode';
// $themeModeList
//         .append(
//           (
//             $mode = $(``)
//               .append($name = $(`<span class="theme-mode-name" prop-name="name" is-required="true" contenteditable="false">${mode.name}</span>`).data('id', mode.id))
//               .append(
//                 $remove = $(`
//                   <span class="remove-mode">
//                     <svg class="svg" width="12" height="6" viewBox="0 0 12 6" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M11.5 3.5H.5v-1h11v1z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path>
//                     </svg>
//                   </span>
//                 `).attr('disabled', mode.isDefault)
//               )
//               .data({
//                 data: mode,
//                 $name,
//                 $remove
//               })
//           ).data('id', mode.id))
//         );

type IThemeMode = {
  data: {
    id: String,
    name: String,
    isDefault: Boolean
  }
}

const ThemeModeItem:FC<IThemeMode> = ({
  data
}: IThemeMode) => {
  const { getThemeMode, removeThemeMode } = useThemeModes();
  const removeHandler = (e) => {
    const item = e.target.closest('li');
    const removeDisabled = e.target.closest('.remove-mode').dataset['disabled'];
    const id = item.dataset['id'];
    const mode = getThemeMode(id) as ThemeMode;
    if (!removeDisabled) removeThemeMode(mode);
    // removeThemeMode(mode);
    // saveThemeMode();
    // Renderer.themeModes();
    // updateCurrentThemeMode();
    // $modeCreator.attr('disabled', false);
  }

  return <li id={`mode-${data.id}`} data-id={data.id}>
    <span className="theme-mode-name" prop-name="name" is-required="true" contentEditable="false" suppressContentEditableWarning={true}>{data.name}</span>
    <span className="remove-mode" data-disabled={data.isDefault} onClick={removeHandler} >
      <svg className="svg" width="12" height="6" viewBox="0 0 12 6" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5 3.5H.5v-1h11v1z" fillRule="nonzero" fillOpacity="1" fill="#000" stroke="none"></path>
      </svg>
    </span>
  </li>;
}
const ThemeModeList: FC = () => {
  const { themeModes } = useThemeModes();
  
  return (<ul id="mode-list">
    {
      themeModes.map(mode => <ThemeModeItem key={mode.id} data={mode}></ThemeModeItem>)
    }
  </ul>);
};

export default ThemeModeList;
