import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { v4 } from 'uuid';
import MessageTypes from './MessageType';
import PropertyTypes from './PropertyTypes';
import BrowserEvents from './BrowserEvents';
import FillType from './FillType';
import ColorMode from './ColorMode';
import Token from './Token';
import CornerRadius from './property-components/CornerRadius';
import SelectText from './SelectText';
import PropertyList from './PropertyList';
import PluginDestroy from './PluginDestroy';
import './ui.css';

declare var $: any;

CornerRadius(jQuery);
SelectText(jQuery);
PropertyList(jQuery);
PluginDestroy(jQuery);

var Color = require('color');
const { useEffect } = React;
declare function require(path: string): any



let pluginData = [], pluginDataMap = {}, tokenDataMap = {};
let $tokenContainer,$tokenSetting, $groupCreator, $tokenSettingGroupName, $tokenSettingTokenName, $tokenSettingDescription, $propertyList, $addProperty, $propertySetting, $propertyTypeContainer, $propertyType, $propertyChooseType, $propertySettingCancel, $propertySettingCreate, $propertySettingSections, $separatorToggle, $separatorModeSign;
const groupPanel = '<div class="panel panel-default panel-collapse-shown"></div>';
const groupPanelHeading = '<div class="panel-heading" data-toggle="collapse" aria-expanded="true"></div>';
const groupPanelTitle = '<h6 class="panel-title"></h6>';
const groupExpendBtn = '<span class="tmicon tmicon-caret-right tmicon-hoverable"></span>';
const groupName = '<span class="group-name" prop-name="name" contenteditable></span>';
const addTokenBtn = '<button type="button" class="add-token" title="Create a token"><svg class="svg" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5v-5h1v5h5v1h-5v5h-1v-5h-5v-1h5z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>'
const tokenListPanel = '<div class="panel-collapse collapse in" aria-expanded="true"></div>';
const tokenList = '<ul class="token-list"></ul>';
const tokenItem = '<li class="token-item"></li>';
const tokenName = '<span class="token-key"></span>';
const thumbnailsColor = '<span class="token-icon color-token-icon"></span>';
const tokenEditBtn = $('<button type="button" class="token-edit-btn"><svg class="svg" width="12" height="14" viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.05V0h1v7.05c1.141.232 2 1.24 2 2.45 0 1.21-.859 2.218-2 2.45V14H2v-2.05c-1.141-.232-2-1.24-2-2.45 0-1.21.859-2.218 2-2.45zM4 9.5c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5C1 8.672 1.672 8 2.5 8 3.328 8 4 8.672 4 9.5zM9 14h1V6.95c1.141-.232 2-1.24 2-2.45 0-1.21-.859-2.218-2-2.45V0H9v2.05c-1.141.232-2 1.24-2 2.45 0 1.21.859 2.218 2 2.45V14zm2-9.5c0-.828-.672-1.5-1.5-1.5C8.672 3 8 3.672 8 4.5 8 5.328 8.672 6 9.5 6c.828 0 1.5-.672 1.5-1.5z" fill-rule="evenodd" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>');

function ClearSelect() {
  document.getSelection().removeAllRanges();
}
const percentToHex = (p) => {
  const percent = Math.max(0, Math.min(100, p)); // bound percent from 0 to 100
  const intValue = Math.round(p / 100 * 255); // map percent to nearest integer (0 - 255)
  const hexValue = intValue.toString(16); // get hexadecimal representation
  return hexValue.padStart(2, '0').toUpperCase(); // format with leading 0 and upper case characters
}
function sendMessage (type: MessageTypes | String, message: String | object = "") {
  parent.postMessage({ pluginMessage: {
    type,
    message: JSON.stringify(message)
  } }, '*');
}
function init (data: Array<Object>) {
  console.log(JSON.stringify(data));
  pluginData = pluginData.concat(data);
  pluginData.reduce((a, b) => {
    const { id, name, tokens } = b;
    b.$group = renderGroup(id, name);
    b.$tokens = renderTokens(b.$group, tokens);
    if (tokens.length > 0) b.$group.$expend.show();

    a[id] = b;
    return a;
  }, pluginDataMap);
  $tokenContainer
}
function save () {
  console.log(pluginData);
  sendMessage(MessageTypes.SET_TOKENS, pluginData.map(({ id, name, tokens }) => ({ id, name, tokens })));
}
function getGroup (id) {
  return pluginDataMap[id];
}
function getToken (id?): Token | Object {
  let val;
  if (id) {
    val = tokenDataMap[id];
  } else {
    val = tokenDataMap;
  }
  return val;
}
function countGroupNumber () {
  return $('.group-name')
    .filter((_inde: number, group: any) => {
      const match = $(group).text().match(/^Group \d+$/);
      return match ? true : false;
    })
    .map((index, group) => Number($(group).text().replace('Group ', '')))
    .get()
    .sort()
    .pop();
}
function createGroup (data) {
  const { id, name } = data;
  data.$element = renderGroup(id, name);
  data.$tokens = $.noop();
  data.tokens = [];
  pluginData.push(data);
  pluginDataMap[data.id] = data;
  data.$element.$name.selectText(); 
}
function renderGroup (id: string, name: string) {
  const $group = $(groupPanel);
  const $heading = $(groupPanelHeading).attr('data-target', `#group-${id}`);
  const $title = $(groupPanelTitle);
  const $expend = $(groupExpendBtn).hide();
  const $name = $(groupName).text(name).attr('data-id', id);
  const $addTokenBtn = $(addTokenBtn).attr('data-group', id);
  const $tokenListPanel = $(tokenListPanel).attr('id', `group-${id}`);
  const $tokenList = $(tokenList);

  $group
    .append(
      $heading.append($title.append($expend).append($name)).append($addTokenBtn)
    )
    .append(
      $tokenListPanel.append($tokenList)
    )
    .insertBefore($groupCreator);
  
  $group.$name = $name;
  $group.$tokenList = $tokenList;
  $group.$expend = $expend;

  return $group;
}
function renderToken (token: Token) {
  const $tokenName = $(tokenName).text(token.name);
  let $tokenThumbnails;

  // const thumbnailsCSS = thumbnailsBuilder(token.properties);
  // console.log(token.type, PropertyTypes.FILLS);
  // if (token.type === PropertyTypes.FILLS) {
  //   $tokenThumbnails = $(thumbnailsColor).attr('style', thumbnailsCSS);
  // }
  // if (token.type === PropertyTypes.STROKE) {
    
  // }
  return $(tokenItem)
    .data('token', token)
    .append($tokenThumbnails)
    .append($tokenName);
}
function renderTokens ($group: any, tokens: Token[]) {
  const $tokens = tokens.map(renderToken);
  $group.$tokenList.append($tokens);
  return $tokens;
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

function setToken (token: Token) {
  if (!getToken(token.id)) {
    tokenDataMap[token.id] = token;
    getGroup(token.parent).tokens.push(token);
  }
}
function unsetToken (token: Token) {
  if (getToken(token.id)) {
    delete tokenDataMap[token.id];
    const tokens = getGroup(token.parent).tokens;
    const index = tokens.findIndex(_token => {
      return _token.id === token.id;
    });
    tokens.splice(index, 1);
  }
}
function checkText (editable, data, propName) {
  const orgVal = data[propName];
  const newVal = editable.text();

  if (!newVal || newVal === orgVal) {
    if (!newVal && editable.is('[is-required]')) {
      editable
        .attr('invalid', "true")
        .text('')
        .selectText();
    } else {
      editable.text(orgVal);
    }
  } else {
    data[propName] = newVal;
    editable.text(newVal);
    // console.log(data);
    if (data instanceof Token) {
      if (data.properties.length > 0) {
        getGroup(data.parent).tokens.push(data);
        save();
      }
    } else {
      save();
    }
  }
}
function changeVal () {
  const $target = $(this);
  const id = $target.data('id');
  let data;
  $target.removeAttr('invalid');
  if ($target.is('.group-name')) {
    data = getGroup(id);
  } else {
    data = getToken(id) || $tokenSetting.data('token');
  }
  if (!data) return;
  setTimeout(function () {
    checkText($target, data, $target.attr('prop-name'));
  }, 100);
}
function inputVal (event) {
  const $target = $(event.target);
  const newVal = $target.text();
  const isRequired = $target.attr('is-required');

  if (event.key === 'Enter') {
    $target.trigger('blur');
    return;
  }
  if (isRequired) {
    !newVal ? $target.attr('invalid', "true") && $addProperty.attr('disabled', true) && $propertySettingCreate.attr('disabled', true) : $target.removeAttr('invalid') && $addProperty.removeAttr('disabled') && $propertySettingCreate.removeAttr('disabled', true);
  }
}
function renderProperties () {
  const { token } = $tokenSetting.data();
  $propertyList.propertyList(token.properties);
}
function resetAddProperty () {
  $addProperty.addClass('show');
  $propertySetting.removeClass('show');
  $propertySettingSections.destroy();
}
const Root = () => {
  useEffect(function () {
    $tokenContainer = $('#design-tokens-container');
    $tokenSetting = $('#token-setting');
    $groupCreator = $('#group-creator');
    $tokenSettingGroupName = $('#panel-group-name');
    $tokenSettingTokenName = $('#token-setting .token-name').attr('contenteditable', "true");
    $tokenSettingDescription = $('.token-description').attr('contenteditable', "true");
    $addProperty = $('#add-property');
    $propertyList = $('#property-list');
    $propertySetting = $('#property-setting');
    $propertyTypeContainer = $('#property-type-row');
    $propertyType = $('#property-type');
    $propertyChooseType = $('button', $propertyType);
    $propertySettingCancel = $('#property-setting-cancel');
    $propertySettingCreate = $('#property-setting-create');
    $propertySettingSections = $('.property-setting-section');
    $separatorToggle = $('#separator-toggle');
    $separatorModeSign = $('.separator-mode-sign');
    $(document).on(`${BrowserEvents.CLICK} ${BrowserEvents.MOUSE_OVER} ${BrowserEvents.MOUSE_OUT}`, '#design-tokens-container .token-item',
      $.debounce(20, function (event) {
        const tokenItem = $(event.target).closest('.token-item');
        if (tokenItem.length > 0) {
          if ( event.type === BrowserEvents.CLICK) {
            $('.token-item').removeClass('token-item-selected');
            tokenItem.addClass('token-item-selected');
            sendMessage(MessageTypes.ASSIGN_TOKEN ,tokenItem.data('token'));
          }
          if (event.type === BrowserEvents.MOUSE_OVER) {
            tokenItem.append(tokenEditBtn);
          }
          if (event.type === BrowserEvents.MOUSE_OUT) {
            tokenEditBtn.detach();
          }
        }
      })
    );
    $(document).on(BrowserEvents.CLICK, '.group-name:focus, .add-token', function (event) {
      event.preventDefault();
      event.stopPropagation();
    });
    $(document).on(BrowserEvents.CLICK, '.token-edit-btn, .add-token', function (event) {
      const { group, token } = $(this).data();
      
      ClearSelect();
      $tokenContainer.removeClass('show');
      $tokenSetting
        .data({
          group: getGroup(group),
          token: token ? getToken(token) : undefined
        })
        .addClass('show')
        .trigger('show');
    });
    $(document).on(BrowserEvents.DBCLICK, '.group-name', function (event) {
      const $groupName = $(event.target);
      if (event.type === BrowserEvents.DBCLICK) {
        $groupName.selectText();
      }
      event.preventDefault();
      event.stopPropagation();
    });
    $(document).on(BrowserEvents.CLICK, '.plugin-panel', function (event) {
      const $tokenItem = $(event.target).closest('.token-item');
      const $groupName = $(event.target).closest('.group-name');
      const $radiusSeparateBtns = $(event.target).closest('.separator-vals .btn-group');
      if ($tokenItem.length === 0) {
        if (event.type === BrowserEvents.CLICK) {
          $('.token-item').removeClass('token-item-selected');
        }
      }
      if ($groupName.length === 0 || $groupName.is('[contenteditable=false]')) {
        $('.group-name').attr('contenteditable', "false")
      }
      if ($radiusSeparateBtns.length === 0) {
        $separatorModeSign.attr('separate-type', 'top-left');
      }
    });
    $(document).on(BrowserEvents.CLICK, '.group-create', function (event) {
      const _uuid = v4();
      const _groupIndex = countGroupNumber();
      createGroup({
        id: _uuid,
        name: `Group ${_groupIndex ? _groupIndex + 1 : 1}`
      });
      save();
      event.preventDefault();
      event.stopPropagation();
    });
    $(document).on(BrowserEvents.CLICK, '#turn-back-btn', function (event) {
      $tokenSetting.removeData().removeClass('show');
      $tokenContainer.addClass('show');
    });
    $(document).on(`${BrowserEvents.BLUR}`, '.group-name, .token-name, .token-description', changeVal);
    $(document).on(`${BrowserEvents.KEY_UP}`, '.group-name, .token-name, .token-description', inputVal);
    $(document).on('show', '#token-setting', function () {
      let { group, token } = $tokenSetting.data();
      const _uuid = v4();

      if (!token) {
        token = new Token();
        token.parent = group.id;
        token.id = _uuid;
        $tokenSetting.data('token', token);
      }
      $addProperty.addClass('show');
      token.name ? $addProperty.removeAttr('disabled') : $addProperty.attr('disabled', true);
      $tokenSettingDescription.text(token.description);
      $tokenSettingGroupName.text(group.name);
      $tokenSettingTokenName.text(token.name).removeAttr('invalid').data('id', token.id).selectText();
      $propertyList.destroy();
      $propertySetting.removeClass('show');

    });
    $(document).on(BrowserEvents.CLICK, '#add-property', function (event) {
      $addProperty.removeClass('show');
      $propertySetting.addClass('show');
      $propertyTypeContainer.css('display', 'flex');
      $propertyChooseType.val(0).children('span').text('Choose a type of property');
      $propertySettingCreate.removeClass('show');
      $propertySettingSections.removeClass('show');
    });
    $(document).on(BrowserEvents.CLICK, '#property-type li a', function (event) {
      const $option = $(this);
      const type = $option.text();
      
      $propertyChooseType.val(type).children('span').text(type);
      $propertySettingCreate.addClass('show');
      $propertySettingSections.destroy();

      if (type === PropertyTypes.CORNER_RADIUS) {
        $propertySettingSections.radius();
      }
    });
    $(document).on(BrowserEvents.CLICK, '#property-setting-cancel', resetAddProperty);
    $(document).on(BrowserEvents.CLICK, '#property-setting-create', function () {
      const { token } = $tokenSetting.data();
      const { value } = $propertySettingSections.data();
      value.parent = token.id;
      token.properties.push(value);
      $propertySettingSections.destroy();
      setToken(token);
      resetAddProperty();
      save();
      renderProperties();
    });
    $(document).on('property-remove', '#property-list', function () {
      const { token } = $tokenSetting.data();
      if (token.properties.length === 0) {
        unsetToken(token);
      }
      save();
      renderProperties();
    })
    sendMessage(MessageTypes.GET_TOKENS);
  });
  return <div>
    <div id="design-tokens-container" className="plugin-panel panel-group panel-group-collapse panel-group-collapse-basic show">
      <div id="group-creator" className="group-create">Add new group</div>
    </div>
    <div id="token-setting" className="plugin-panel">
      <div className="property-setting-row">
        <div id="turn-back-btn">
          <svg className="svg" width="8" height="13" viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg"><path d="M1 6.5l-.353-.354-.354.354.354.354L1 6.5zM6.647.146l-6 6 .707.708 6-6-.707-.708zm-6 6.708l6 6 .707-.708-6-6-.707.708z" fillRule="nonzero" fillOpacity="1" fill="inherit" stroke="none"></path></svg>
        </div>
        <h6 id="panel-group-name"></h6>
      </div>
      <div className="property-setting-row">
        <span className="token-name" prop-name="name" placeholder="Token Name" is-required="true"></span>
      </div>
      <div className="property-setting-row">
        <span className="token-description" prop-name="description" placeholder="Add Description"></span>
      </div>
      <div className="property-setting-row preview-area">
        <div className="preview-box"></div>
      </div>
      <div id="property-list" className="property-setting-row"></div>
      <div className="property-setting-row">
        <button id="add-property" type="button">Create New Property</button>
      </div>
      <div id="property-setting">
        <div id="property-type-row" className="property-setting-row">
          <div id="property-type" className="btn-group">
            <button type="button" className="btn btn-border dropdown-toggle" data-toggle="dropdown" aria-expanded="false" value="0">
              <i className="tmicon tmicon-caret-down"></i>
              <span>Choose a type of property</span>
            </button>
            <ul className="dropdown-menu">
              <li><a href="javascript:;">{PropertyTypes.CORNER_RADIUS}</a></li>
              <li><a href="javascript:;">{PropertyTypes.EFFECT}</a></li>
              <li><a href="javascript:;">{PropertyTypes.FILL_COLOR}</a></li>
              <li><a href="javascript:;">{PropertyTypes.OPACITY}</a></li>
              <li><a href="javascript:;">{PropertyTypes.STROKE_COLOR}</a></li>
              <li><a href="javascript:;">{PropertyTypes.STROKE_DASH}</a></li>
              <li><a href="javascript:;">{PropertyTypes.STROKE_WIDTH_ALIGH}</a></li>
            </ul>
          </div>
        </div>
        <div className="property-setting-row property-setting-section"></div>
        <div className="property-setting-row">
          <button id="property-setting-cancel" type="button" className="btn btn-sm btn-border">Cancel</button> <button id="property-setting-create" type="button" className="btn btn-sm btn-primary">Create</button>
        </div>
      </div>
    </div>
  </div>
}
class App extends React.Component {
  render() {
    return <Root></Root>
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'));

window.onmessage = async (event) => {
  const msg = event.data.pluginMessage;
  console.log(msg.message);
  init(msg.message);
}