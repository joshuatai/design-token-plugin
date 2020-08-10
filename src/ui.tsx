import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { fetch, getCurrentThemeMode, setCurrentThemeMode, getThemeMode, setThemeMode, removeThemeMode, getGroup, setGroup, getToken, setToken, removeToken, setPureToken, setProperty, save, sendMessage, setFonts, saveThemeMode } from './model/DataManager';
import TokenSetting from './containers/TokenSetting';
import PropertyIcon from './containers/property-components/PropertyIcon';
import BrowserEvents from 'enums/BrowserEvents';
import preventEvent from  'utils/preventEvent';

import ThemeMode from 'model/ThemeMode';
import Group from 'model/Group';
import Token from 'model/Token';
import Properties from 'model/Properties';
import { inputCheck, valChange } from 'utils/inputValidator';
import SelectText from 'utils/selectText';
import PluginDestroy from 'utils/PluginDestroy';
import './ui.css';
import MessageTypes from 'enums/MessageTypes';
import { themeModeIcon } from './containers/property-components/CommonSettings';
import { Mixed } from './symbols';

declare var $: any;

TokenSetting(jQuery);
SelectText(jQuery);
PluginDestroy(jQuery);

const { useEffect } = React;

let $tokenContainer, $desiginSystemTabs, $tokenSetting, $groupCreator, $modeCreator, $themeModeList;

const $tokenEditBtn = $('<button type="button" class="token-edit-btn"><svg class="svg" width="12" height="14" viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.05V0h1v7.05c1.141.232 2 1.24 2 2.45 0 1.21-.859 2.218-2 2.45V14H2v-2.05c-1.141-.232-2-1.24-2-2.45 0-1.21.859-2.218 2-2.45zM4 9.5c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5C1 8.672 1.672 8 2.5 8 3.328 8 4 8.672 4 9.5zM9 14h1V6.95c1.141-.232 2-1.24 2-2.45 0-1.21-.859-2.218-2-2.45V0H9v2.05c-1.141.232-2 1.24-2 2.45 0 1.21.859 2.218 2 2.45V14zm2-9.5c0-.828-.672-1.5-1.5-1.5C8.672 3 8 3.672 8 4.5 8 5.328 8.672 6 9.5 6c.828 0 1.5-.672 1.5-1.5z" fill-rule="evenodd" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>');

const Utils = {
  newGroupName: (): string => {
    const lastNumber = getGroup()
      .filter((group) => (group.name.match(/^Group \d+$/) ? true : false))
      .map(group => (Number(group.name.replace('Group ', ''))))
      .sort()
      .pop();
    return `Group ${lastNumber ? lastNumber + 1 : 1}`;
  },
  clearSelection: () => {
    document.getSelection().removeAllRanges();
  }
};

const Renderer = {
  themeMode: function (mode) {
    let $mode, $name, $remove;

    $themeModeList
      .append(
        (
          $mode = $(`<li id="mode-${mode.id}"></li>`)
            .append($name = $(`<span class="theme-mode-name" prop-name="name" is-required="true" contenteditable>${mode.name}</span>`).data('id', mode.id))
            .append(
              $remove = $(`
                <span class="remove-mode">
                  <svg class="svg" width="12" height="6" viewBox="0 0 12 6" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5 3.5H.5v-1h11v1z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path>
                  </svg>
                </span>
              `).attr('disabled', mode.isDefault)
            )
            .data({
              data: mode,
              $name,
              $remove
            })
        )
      );

    return $mode;
  },
  themeModes: function (modes) {
    const $themeModes = $(`<div class="dropdown theme-modes"></div>`);
    const $themeModeIcon = $(themeModeIcon);
    const $themeModeList = $(`<ul class="dropdown-menu dropdown-menu-multi-select pull-right"></ul>`);

    $desiginSystemTabs.find('theme-modes').remove();
    if (modes.length > 1) {
      $desiginSystemTabs.append(
        $themeModes
          .append($themeModeIcon)
          .append(
            $themeModeList.append(
              modes.map((mode, index) => {
                return `
                  <li class="theme-mode" data-index="${index}" data-id="${mode.id}">
                    <a href="#">${mode.name}${mode.isDefault ? ' (Default)' : ''}</a>
                  </li>
                `;
              })
            )
          )
      );
    }
  },
  group: function (group: Group) {
    const { id, name } = group;
    const $group = $(`<div id="${id}" class="panel panel-default panel-collapse-shown"></div>`);
    const $heading = $('<div class="panel-heading" data-toggle="collapse" aria-expanded="false"></div>').attr('data-target', `#group-${id}`).data('group', id);
    const $title = $('<h6 class="panel-title"></h6>');
    const $expend = $('<span class="tmicon tmicon-caret-right tmicon-hoverable"></span>').hide();
    const $name = $('<span class="group-name" prop-name="name" contenteditable is-required="true"></span>').text(name).data('id', id);
    const $addTokenBtn = $('<button type="button" class="add-token" title="Create a token"><svg class="svg" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5v-5h1v5h5v1h-5v5h-1v-5h-5v-1h5z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>');
    const $tokenListPanel = $('<div class="panel-collapse collapse" aria-expanded="false"></div>').attr('id', `group-${id}`);
    const $tokenList = $('<ul class="token-list"></ul>');
  
    $group
      .append(
        $heading.append($title.append($expend).append($name)).append($addTokenBtn)
      )
      .append(
        $tokenListPanel.append($tokenList)
      )
      .data({
        data: group,
        $heading,
        $name: $name,
        $tokenList,
        $expend
      })
      .insertBefore($groupCreator);
  
    return $group;
  },
  token: function (token: Token) {
    const { $tokenList, $expend } = $(`#${token.parent}`).data();

    let $token = $(`#${token.id}`);
    let $icon;

    if (token.propertyType !== Mixed) {
      $icon = PropertyIcon(token.properties[0]).$icon;
    }
    if ($token.length === 0) {
      $token = $(`<li id="${token.id}" class="token-item"></li>`)
        .data({
          'group': token.parent,
          'token': token.id
        })
        .append($icon)
        .append($('<span class="token-key"></span>'));

      $tokenList.append($token);
    }
    $('.token-key', $token).text(token.name);
    $token.children().not('.token-key').replaceWith($icon);
    $token.data = token;
    $expend.show();
    return $token;
  },
  updateToken: function (token: Token) {
    const { $expend, $heading } = $(`#${token.parent}`).data();
    this.token(token);
    if ($heading.is('[aria-expanded="false"]')) {
      $expend.trigger('click');
    }
  },
  removeToken: function (token: Token) {
    const group = getGroup(token.parent);
    const { $expend } = $(`#${token.parent}`).data();

    $(`#${token.id}`).remove();
    if (group.tokens.length === 1) $expend.hide();
  }
};

function initThemeMode (modes: Array<ThemeMode>) {
  let hasDefault = true;
  if (!modes.length) {
    hasDefault = false;
    modes.push(new ThemeMode());
  }
  modes.forEach((mode: ThemeMode) => {
    const $themeMode = Renderer.themeMode(new ThemeMode(mode));
    const { data } = $themeMode.data();
    setThemeMode(data);
  });
  if (!hasDefault) {
    saveThemeMode();
  }
  Renderer.themeModes(modes);
}
function init (groups: Array<Object>) {
  let isTokenOpen = false;
  groups.forEach((group: Group) => {
    const $group = Renderer.group(new Group({
      id: group.id,
      name: group.name
    }));
    const { $expend, data } = $group.data();
    setGroup(data);
    if (group.tokens.length > 0) {
      group.tokens.forEach(token => {
        token.properties = token.properties.map((property: any) => {
          const data = new Properties[property._type.replace(/[^A-Za-z]/g, '')](property);
          setProperty(data);
          return data;
        });
        if (token.propertyType === String(Mixed)) token.propertyType = Mixed;
        const $token = Renderer.token(new Token(token));
        setToken($token.data);
        setPureToken($token.data);
      });
      if (!isTokenOpen) {
        isTokenOpen = true;
        $expend.trigger('click');
      }
    }
  });
}

function createMode () {
  const $mode = Renderer.themeMode(new ThemeMode({}));
  const { data, $name } = $mode.data();
  $name.selectText();
  setThemeMode(data);

}

function createGroup () {
  const $group = Renderer.group(new Group({
    name: Utils.newGroupName()
  }));
  const { data, $name } = $group.data();
  $name.selectText();
  setGroup(data);
  save();
}

function updateCurrentThemeMode () {
  const themeMode = getCurrentThemeMode();
  console.log(themeMode);
  $desiginSystemTabs.find('.theme-modes ul')
    .children()
    .removeClass('selected')
    .filter((index, item) => $(item).data('id') === themeMode)
    .addClass('selected');
}

const Root = () => {
  useEffect(function () {
    $tokenContainer = $('#design-tokens-container');
    $desiginSystemTabs = $('#desigin-system-tabs');
    $tokenSetting = $('#token-setting');
    $groupCreator = $('#group-creator');
    $modeCreator = $('#mode-creator');
    $themeModeList = $('#mode-list');
    fetch();
  });

    $(document).on(`${BrowserEvents.CLICK}`, '.theme-mode', function () {
      const themeModeId = $(this).data('id');
      setCurrentThemeMode(themeModeId);
      updateCurrentThemeMode();
    });
    //done
    $(document).on(`${BrowserEvents.CLICK} ${BrowserEvents.MOUSE_OVER} ${BrowserEvents.MOUSE_OUT}`, '#design-tokens-container .token-item',
      $.debounce(20, function ({ type }) {
        const $tokenItem = $(this);
        if ( type === BrowserEvents.CLICK) {
          $('.token-item-selected').removeClass('token-item-selected');
          $tokenItem.addClass('token-item-selected');
          sendMessage(MessageTypes.ASSIGN_TOKEN ,getToken($tokenItem.data('token')));
        }
        if (type === BrowserEvents.MOUSE_OVER) {
          $tokenItem.append($tokenEditBtn);
        }
        if (type === BrowserEvents.MOUSE_OUT) {
          $tokenEditBtn.remove();
        }
      })
    );
    // This event listener is to prevent collapse event.
    $(document).on(BrowserEvents.CLICK, '.group-name:focus, .add-token', preventEvent);
    // token setting
    $(document).on(BrowserEvents.CLICK, '.token-edit-btn, .add-token', function () {
      let { group, token } = $(this).parent().data();
      Utils.clearSelection();
      $tokenContainer.removeClass('show');
      $tokenSetting.TokenSetting({ group, token });
    });
    // done
    $(document).on(BrowserEvents.DBCLICK, '.group-name', function (e) {
      $(this).selectText();
      preventEvent(e);
    });
    $(document).on(BrowserEvents.CLICK, '.theme-mode-name', function (e) {
      $(this).selectText();
      preventEvent(e);
    });
    // need to update
    $(document).on(BrowserEvents.CLICK, '#design-tokens-container.plugin-panel', function (event) {
      const $tokenItem = $(event.target).closest('.token-item');
      // const $radiusSeparateBtns = $(event.target).closest('.separator-vals .btn-group');
      if ($tokenItem.length === 0) {
        if (event.type === BrowserEvents.CLICK) {
          $('.token-item').removeClass('token-item-selected');
        }
      }
      // if ($radiusSeparateBtns.length === 0) {
      //   $separatorModeSign.attr('separate-type', 'top-left');
      // }
    });

    // done
    $(document).on(BrowserEvents.CLICK, '.group-create', function (e) {
      createGroup();
      preventEvent(e);
    });
    $(document).on(`${BrowserEvents.BLUR}`, '.group-name, .theme-mode-name', function () {
      valChange.call(this);
      const $this = $(this);
      if ($this.is('.theme-mode-name') && $this.text()) {
        $modeCreator.removeAttr('disabled');
      }
    });
    $(document).on(`${BrowserEvents.KEY_UP}`, '.group-name, .theme-mode-name', inputCheck);
    $(document).on(BrowserEvents.CLICK, '#mode-creator', function (e) {
      if ($(this).is('[disabled]')) return;
      createMode();
      $modeCreator.attr('disabled', true);
      preventEvent(e);
    });
    $(document).on(BrowserEvents.CLICK, '.remove-mode:not([disabled])', function (e) {
      const mode = $(this).parent().data('data');
      $(`#mode-${mode.id}`).remove();
      removeThemeMode(mode);
      saveThemeMode();
    });
    $(document).on('destroy:TokenSetting', (e, token: Token) => {
      if (token.name && token.properties.length > 0) {
        Renderer.updateToken(token);
      } else {
        //need to chaeck if there is a token or component already refer this token
        Renderer.removeToken(token);
        removeToken(token);
      }
      save();
      $tokenContainer.addClass('show');
    });  
  
  return (
    <React.Fragment>
      <ul id="desigin-system-tabs" className="nav nav-tabs" role="tablist">
        <li role="presentation" className="active"><a href="#tokens" aria-controls="tokens" role="tab" data-toggle="tab">Tokens</a></li>
        <li role="presentation"><a href="#modes" aria-controls="modes" role="tab" data-toggle="tab">Theme Modes</a></li>
      </ul>
      <div className="tab-content">
        <div role="tabpanel" className="tab-pane active" id="tokens">
          <div id="design-tokens-container" className="plugin-panel panel-group panel-group-collapse panel-group-collapse-basic show">
            <div id="group-creator" className="group-create">Add a new group</div>
          </div>
          <div id="token-setting" className="plugin-panel"></div>
        </div>
        <div role="tabpanel" className="tab-pane" id="modes">
          <div id="mode-setting" className="plugin-panel show">
            <ul id="mode-list"></ul>
            <div id="mode-creator" className="mode-create">Add a new theme mode</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
class App extends React.Component {
  render() {
    return <Root></Root>;
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'));

window.onmessage = async (event) => {
  const msg = event.data.pluginMessage;
  if (msg.type === MessageTypes.GET_FONTS) {
    setFonts(msg.message);
  }
  if (msg.type === MessageTypes.GET_MODES) {
    initThemeMode(msg.message);
  }
  if (msg.type === MessageTypes.GET_INIT_THEME_MODE) {
    msg.message ? setCurrentThemeMode(msg.message) : setCurrentThemeMode(getThemeMode()[0].id);
    updateCurrentThemeMode();
  }
  if (msg.type === MessageTypes.GET_CURRENT_THEME_MODE) {
    updateCurrentThemeMode();
  }
  if (msg.type === MessageTypes.GET_TOKENS) {
    init(msg.message);
  }
  if (msg.type === MessageTypes.SELECTION_CHANGE) {
    $('#design-tokens-container').trigger('click');
  }
}
