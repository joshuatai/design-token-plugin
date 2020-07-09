import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { fetch, getData, getGroup, setGroup, getToken, setToken, removeToken, save } from './model/DataManager';
import TokenSetting from './containers/TokenSetting';
import PropertyTypes from './enums/PropertyTypes';
import BrowserEvents from './enums/BrowserEvents';
import FillType from './enums/FillType';
import ColorMode from './enums/ColorMode';
import percentToHex from './utils/percentToHex';
import preventEvent from  './utils/preventEvent';
import Group from './model/Group';
import Token from './model/Token';
import { inputCheck, valChange } from './utils/inputValidator';
import CornerRadius from './property-components/CornerRadius';
import SelectText from './SelectText';
import PluginDestroy from './PluginDestroy';
import './ui.css';

declare var $: any;

TokenSetting(jQuery);
CornerRadius(jQuery);
SelectText(jQuery);
PluginDestroy(jQuery);

var Color = require('color');
const { useEffect } = React;
declare function require(path: string): any

let $tokenContainer,$tokenSetting, $groupCreator;

const thumbnailsColor = '<span class="token-icon color-token-icon"></span>';
const $tokenEditBtn = $('<button type="button" class="token-edit-btn"><svg class="svg" width="12" height="14" viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.05V0h1v7.05c1.141.232 2 1.24 2 2.45 0 1.21-.859 2.218-2 2.45V14H2v-2.05c-1.141-.232-2-1.24-2-2.45 0-1.21.859-2.218 2-2.45zM4 9.5c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5C1 8.672 1.672 8 2.5 8 3.328 8 4 8.672 4 9.5zM9 14h1V6.95c1.141-.232 2-1.24 2-2.45 0-1.21-.859-2.218-2-2.45V0H9v2.05c-1.141.232-2 1.24-2 2.45 0 1.21.859 2.218 2 2.45V14zm2-9.5c0-.828-.672-1.5-1.5-1.5C8.672 3 8 3.672 8 4.5 8 5.328 8.672 6 9.5 6c.828 0 1.5-.672 1.5-1.5z" fill-rule="evenodd" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>');

const Utils = {
  newGroupName: (): string => {
    const lastNumber = getData()
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
        $name: $name,
        $tokenList,
        $expend
      })
      .insertBefore($groupCreator);
  
    return $group;
  },
  token: function (token: Token) {
    const { $tokenList } = $(`#${token.parent}`).data();
    const $token = $(`<li id="${token.id}" class="token-item"></li>`)
      .data({
        'group': token.parent,
        'token': token.id
      });
    
    const $tokenName = $('<span class="token-key"></span>').text(token.name);
    let $tokenThumbnails;
    // const thumbnailsCSS = thumbnailsBuilder(token.properties);
    // console.log(token.type, PropertyTypes.FILLS);
    // if (token.type === PropertyTypes.FILLS) {
    //   $tokenThumbnails = $(thumbnailsColor).attr('style', thumbnailsCSS);
    // }
    // if (token.type === PropertyTypes.STROKE) {
      
    // }
    $token.data = token;
    $tokenList.append($token);

    return $token
      .append($tokenThumbnails)
      .append($tokenName);
  },
  updateToken: function (token: Token) {
    const $token = $(`#${token.id}`);
    $('.token-key', $token).text(token.name);

    if ($token.length === 0) {
      this.token(token);
    }
  }
};

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
        const $token = Renderer.token(new Token(token));
        setToken($token.data);
      });
      $expend.show();
      if (!isTokenOpen) {
        isTokenOpen = true;
        $expend.trigger('click');
      }
    }
  });
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

function thumbnailsBuilder (properties) {
  const backgrounds = [];
  properties.forEach(property => {
    const { colorMode, colorCode, opacity } = property.value;
    if (property.propType === PropertyTypes.FILL_COLOR) {
      if (property.type === FillType.SOLID) {
        if (colorMode === ColorMode.HEX) {
          backgrounds.push(`${colorCode}${percentToHex(opacity * 100)}`);
        }
      }
    }
  });

  return `background-color: ${backgrounds.join(',')}`;
}

const Root = () => {
  useEffect(function () {
    $tokenContainer = $('#design-tokens-container');
    $tokenSetting = $('#token-setting');
    $groupCreator = $('#group-creator');

    //done
    $(document).on(`${BrowserEvents.CLICK} ${BrowserEvents.MOUSE_OVER} ${BrowserEvents.MOUSE_OUT}`, '#design-tokens-container .token-item',
      $.debounce(20, function ({ type }) {
        const $tokenItem = $(this);
        if ( type === BrowserEvents.CLICK) {
          $('.token-item-selected').removeClass('token-item-selected');
          $tokenItem.addClass('token-item-selected');
          // DataManager.sendMessage(MessageTypes.ASSIGN_TOKEN ,tokenItem.data('token'));
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

    // need to update
    $(document).on(BrowserEvents.CLICK, '#design-tokens-container.plugin-panel', function (event) {
      const $tokenItem = $(event.target).closest('.token-item');
      const $groupName = $(event.target).closest('.group-name');
      // const $radiusSeparateBtns = $(event.target).closest('.separator-vals .btn-group');
      if ($tokenItem.length === 0) {
        if (event.type === BrowserEvents.CLICK) {
          $('.token-item').removeClass('token-item-selected');
        }
      }
      if ($groupName.length === 0 || $groupName.is('[contenteditable=false]')) {
        $('.group-name').attr('contenteditable', "false")
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

    $(document).on(`${BrowserEvents.BLUR}`, '.group-name', valChange);
    $(document).on(`${BrowserEvents.KEY_UP}`, '.group-name', inputCheck);
    $(document).on('destroy:TokenSetting', (e, token: Token) => {
      if (token.name && token.properties.length > 0) {
        Renderer.updateToken(token);
      } else {
        //need to chaeck if there is a token or component already refer this token
        removeToken(token)
      }
      save();
      $tokenContainer.addClass('show');
    });
    
    
    //
    
    // $(document).on('property-remove', '#property-list', function () {
    //   const { token } = $tokenSetting.data();
    //   if (token.properties.length === 0) {
    //     unsetToken(token);
    //   }
    //   save();
    //   Renderer.properties();
    // });
    fetch();
  });
  return (
    <React.Fragment>
      <div id="design-tokens-container" className="plugin-panel panel-group panel-group-collapse panel-group-collapse-basic show">
        <div id="group-creator" className="group-create">Add new group</div>
      </div>
      <div id="token-setting" className="plugin-panel"></div>
    </React.Fragment>
  );
}
class App extends React.Component {
  render() {
    return <Root></Root>
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'));

window.onmessage = async (event) => {
  const msg = event.data.pluginMessage;
  init(msg.message);
}