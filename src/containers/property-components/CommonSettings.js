import { getToken, getPureToken, getThemeMode } from 'model/DataManager';
import PropertyIcon from './PropertyIcon';
import PropertyTypes from 'enums/PropertyTypes';
const detachIcon = `
  <div class="detach-token">
    <svg class="svg" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M4 0v3h1V0H4zm9.103.896c-1.162-1.161-3.045-1.161-4.207 0l-2.75 2.75.707.708 2.75-2.75c.771-.772 2.022-.772 2.793 0 .771.77.771 2.021 0 2.792l-2.75 2.75.707.708 2.75-2.75c1.162-1.162 1.162-3.046 0-4.208zM.896 13.103c-1.162-1.161-1.162-3.045 0-4.207l2.75-2.75.707.708-2.75 2.75c-.771.77-.771 2.021 0 2.792.771.772 2.022.772 2.793 0l2.75-2.75.707.707-2.75 2.75c-1.162 1.162-3.045 1.162-4.207 0zM14 10h-3V9h3v1zM10 11v3H9v-3h1zM3 4H0v1h3V4z" fill-rule="nonzero" fill-opacity=".9" fill="#000" stroke="none"></path></svg>
  </div>
`;
const useTokenIcon = `
  <div class="dropdown">
    <div class="use-token" data-toggle="dropdown">
      <svg className="svg" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.5 2c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C3.5 1.172 2.828.5 2 .5 1.172.5.5 1.172.5 2zm6 0c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C9.5 1.172 8.828.5 8 .5c-.828 0-1.5.672-1.5 1.5zM8 9.5c-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5 0 .828-.672 1.5-1.5 1.5zM.5 8c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5 0-.828-.672-1.5-1.5-1.5C1.172 6.5.5 7.172.5 8z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg>
    </div>
  </div>
`;
export const themeModeIcon = `
  <div class="themem-mode-list" data-toggle="dropdown">
    <span class="tmicon tmicon-sun"></span>
    <span class="tmicon tmicon-moon"></span>
  </div>
`;
export default (property) => {
    const { $element, options } = property;
    const themeModes = getThemeMode();
    const _token = $element.data('token');
    const tokensMap = getPureToken(options.type === PropertyTypes.STROKE_FILL ? [PropertyTypes.FILL_COLOR, PropertyTypes.STROKE_FILL] : options.type);
    const tokenList = Object.keys(tokensMap)
        .map(key => tokensMap[key])
        .filter(token => token.id !== _token.id);
    const _useToken = getToken(options.useToken);
    const $detachToken = $(detachIcon).data("property", property);
    const $useToken = $(useTokenIcon);
    const $propertyView = $element.data('propertyView');
    const $tokenList = $('<ul class="dropdown-menu dropdown-menu-multi-select pull-right"></ul>').data("property", property);
    const $themeModeIcon = $(themeModeIcon);
    const $themeModeList = $(`<ul class="dropdown-menu dropdown-menu-multi-select pull-right"></ul>`).data("property", property);
    let $themeMode;
    if (options.type === PropertyTypes.OPACITY || options.type === PropertyTypes.FILL_COLOR || options.type === PropertyTypes.STROKE_FILL) {
        $themeMode = $(`<div class="dropdown"></div>`)
            .append($themeModeIcon)
            .append($themeModeList.append(themeModes.map((mode, index) => {
            const $item = $(`
              <li class="mode-item" data-index="${index}" data-id="${mode.id}">
                <a href="#">${mode.name}${mode.isDefault ? ' (Default)' : ''}</a>
              </li>
            `)
                .data('themeMode', mode);
            if ((!options.themeMode && mode.isDefault) || options.themeMode === mode.id) {
                options.themeMode = mode.id;
                $item.addClass('selected');
                $themeModeIcon.attr('title', mode.name);
            }
            return $item;
        })));
        if (themeModes.length === 1)
            $themeMode = null;
    }
    const $icon = PropertyIcon([options]).$icon;
    property.options.parent = _token.id;
    Object.assign(property, {
        tokenList,
        $themeModeList,
        $detachToken,
        $useToken,
        $tokenList,
        $icon,
        $propertyView
    });
    $element.data('value', options).addClass('show');
    _useToken ? $detachToken.data('token', _useToken).css('display', 'flex') : $detachToken.hide();
    return {
        $themeMode,
        $token: tokenList.length ?
            $detachToken.add($useToken.append($tokenList.append(tokenList.map((token, index) => $(`<li class="token-item" data-index="${index}"><a href="#">${token.name}</a></li>`)
                .data('token', token)
                .addClass(_useToken && token.name === _useToken.name ? 'selected' : ''))))) :
            null
    };
};
