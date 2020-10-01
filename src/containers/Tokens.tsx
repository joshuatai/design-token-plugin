import React, { useEffect, FC } from 'react';
import { v4 } from 'uuid';
import hash from 'hash.js';
import _cloneDeep from 'lodash/cloneDeep';


import useAPI from 'hooks/useAPI';
import useThemeModes from 'hooks/useThemeModes';
import ThemeModeList from './ThemeModeList';


import TokenSetting from './TokenSetting';
import SelectText from 'utils/selectText';
import PluginDestroy from 'utils/PluginDestroy';
import { getSaveData, getVersion, fetchInitial, removeGroup, referByToken, getCurrentThemeMode, setCurrentThemeMode, getThemeMode, setThemeMode, removeThemeMode, getGroup, setGroup, getToken, setToken, removeToken, setPureToken, setProperty, save, sendMessage, setFonts, saveThemeMode, syncPageThemeMode, setVersion, restore } from 'model/DataManager';
import { themeModeIcon } from './property-components/CommonSettings';
import ThemeMode from 'model/ThemeMode';
import Version from 'model/Version';
import Group from 'model/Group';
import Token from 'model/Token';
import Properties from 'model/Properties';
import { Mixed } from 'symbols/index';
import MessageTypes from 'enums/MessageTypes';
import PropertyIcon from './property-components/PropertyIcon';
import BrowserEvents from 'enums/BrowserEvents';
import preventEvent from  'utils/preventEvent';

import { inputCheck, valChange } from 'utils/inputValidator';


declare var $: any;
TokenSetting(jQuery);
SelectText(jQuery);
PluginDestroy(jQuery);

const $groupActionDelete = $(`<li class="delete-group"><a href="#">Delete Group</a></li>`);
const $groupActionDropdown = $(`<ul class="dropdown-menu pull-right "></ul>`).append($groupActionDelete);
const $tokenActionWrapper = $(`<div id="token-action-wrapper" class="dropdown"></div>`);
const $tokenEditBtn = $('<button type="button" class="token-edit-btn"><svg class="svg" width="12" height="14" viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.05V0h1v7.05c1.141.232 2 1.24 2 2.45 0 1.21-.859 2.218-2 2.45V14H2v-2.05c-1.141-.232-2-1.24-2-2.45 0-1.21.859-2.218 2-2.45zM4 9.5c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5C1 8.672 1.672 8 2.5 8 3.328 8 4 8.672 4 9.5zM9 14h1V6.95c1.141-.232 2-1.24 2-2.45 0-1.21-.859-2.218-2-2.45V0H9v2.05c-1.141.232-2 1.24-2 2.45 0 1.21.859 2.218 2 2.45V14zm2-9.5c0-.828-.672-1.5-1.5-1.5C8.672 3 8 3.672 8 4.5 8 5.328 8.672 6 9.5 6c.828 0 1.5-.672 1.5-1.5z" fill-rule="evenodd" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>');
const $tokenActionDropdown = $(`<ul class="dropdown-menu pull-right "></ul>`);
const $tokenActionClone = $(`<li class="clone-token"><a href="#">Clone token</a></li>`);
const $tokenActionDelete = $(`<li class="delete-token"><a href="#">Delete Token</a></li>`);
const $tokenActionUnassign = $(`<li class="unassign-token"><a href="#">Unassign token</a></li>`);
$tokenActionWrapper
  .append($tokenEditBtn)
  .append($tokenActionDropdown
    .append($tokenActionClone)
    .append($tokenActionUnassign)
    .append($tokenActionDelete)
  );

type Props = {
  data: {
    themeModes: Array<ThemeMode>
  }
};
const Tokens:FC<Props> = ({
  data = { themeModes: [] }
}: Props) => {
  const { themeModes, setThemeModes} = useThemeModes();
  const { api: { admin }} = useAPI();
  // console.log(admin);
  // const { themeModes } = useThemeModes();
  let $tokenContainer, $desiginSystemTabs, $assignedTokensNodeList, $tokenSetting, $groupCreator, $modeCreator, $themeModeList, $versionCreator, $versionList;

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
              .append($name = $(`<span class="theme-mode-name" prop-name="name" is-required="true" contenteditable="false">${mode.name}</span>`).data('id', mode.id))
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
    themeModes: function () {
      const modes = getThemeMode();
      const $themeModes = $(`<div class="dropdown theme-modes"></div>`);
      const $themeModeIcon = $(themeModeIcon);
      const $themeModeList = $(`<ul class="dropdown-menu dropdown-menu-multi-select pull-right"></ul>`);
  
      $desiginSystemTabs.find('.theme-modes').remove();
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
    version: function (version) {
      let $version, $name, $remove, $load;
  
      $versionList
        .append(
          (
            $version = $(`<li id="version-${version.id}"></li>`)
              .append($name = $(`<span class="version-name" prop-name="name" is-required="true" contenteditable="false">${version.name}</span>`).data('id', version.id))
              .append(
                $load = $(`<span class="version-restore tmicon tmicon-backup"></span>`)
              )
              .append(
                $remove = $(`
                  <span class="remove-version">
                    <svg class="svg" width="12" height="6" viewBox="0 0 12 6" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5 3.5H.5v-1h11v1z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path>
                    </svg>
                  </span>
                `)
              )
              .data({
                data: version,
                $name,
                $remove
              })
          )
        );
  
      return $version;
    },
    group: function (group: Group) {
      const { id, name } = group;
      const $group = $(`<div id="${id}" class="panel panel-default panel-collapse-shown"></div>`);
      const $heading = $('<div class="panel-heading group-item" data-toggle="collapse" aria-expanded="false"></div>').attr('data-target', `#group-${id}`).data('group', id);
      const $title = $('<h6 class="panel-title"></h6>');
      const $expend = $('<span class="tmicon tmicon-caret-right tmicon-hoverable"></span>').hide();
      const $name = $('<span class="group-name" prop-name="name" is-required="true"></span>').text(name).data('id', id);
      const $addTokenBtn = $('<button type="button" class="add-token" title="Create a token"><svg class="svg" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5v-5h1v5h5v1h-5v5h-1v-5h-5v-1h5z" fill-rule="nonzero" fill-opacity="1" fill="#000" stroke="none"></path></svg></button>');
      const $tokenListPanel = $('<div class="panel-collapse collapse" aria-expanded="false"></div>').attr('id', `group-${id}`);
      const $tokenList = $('<ul class="token-list"></ul>');
    
      $group
        .append(
          $heading
            .append(
              $title
                .append($expend)
                .append($name)
            )
            .append($addTokenBtn)
        )
        .append(
          $tokenListPanel
            .append(
              $tokenList
                .addClass('sortable')
                .sortable({
                  containment: "parent",
                  placeholder: 'ui-sortable-placeholder',
                  handle: '.ui-sortable-handle',
                  axis: "y"
                })
            )
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
        $icon = PropertyIcon(token.properties, true).$icon;
      }
      if ($token.length === 0) {
        $token = $(`<li id="${token.id}" class="token-item"></li>`)
          .data({
            'group': token.parent,
            'token': token.id
          })
          .append($(`<span class="ui-sortable-handle"></span>`))
          .append($('<span class="token-key"></span>'));
  
        $tokenList.append($token);
      }
      const $tokenKey = $('.token-key', $token).text(token.name);
      $token.find('[data-role="token-icon"]').remove();
      $icon && $icon.insertBefore($tokenKey);
      $token.data = token;
      $expend.show();
      return $token;
    },
    tokensAssigned: function (nodes) {
      $assignedTokensNodeList.empty();
      if (nodes.length) {
        nodes.forEach(node => {
          let { id, name, useTokens } = node;
          const _id = id.replace(':', '-');
          const $node = $(`<div id="${_id}" class="selected-node panel panel-default panel-collapse-shown"></div>`).data('id', id);
          const $heading = $('<div class="panel-heading node-item" data-toggle="collapse" aria-expanded="true"></div>').attr('data-target', `#node-${_id}`);
          const $title = $('<h6 class="panel-title"></h6>');
          const $expend = $('<span class="tmicon tmicon-caret-right tmicon-hoverable"></span>');
          const $name = $('<span class="node-name"></span>').text(name);
          const $tokenListPanel = $('<div class="panel-collapse collapse in" aria-expanded="true"></div>').attr('id', `node-${_id}`);
          const $tokenList = $('<ul class="token-list"></ul>');
          $assignedTokensNodeList.append(
            $node
              .append($heading.append($title.append($expend).append($name)))
              .append(
                $tokenListPanel.append(
                  $tokenList
                    .addClass('sortable')
                    .sortable({
                      // containment: "parent",
                      placeholder: 'ui-sortable-placeholder',
                      handle: '.ui-sortable-handle',
                      axis: "y"
                    })
                    .append(
                      useTokens.map(_token => {
                        const token = getToken(_token);
                        let $icon;
                        if (token.propertyType !== Mixed) {
                          $icon = PropertyIcon(token.properties, true).$icon;
                        }
                        return $(`<li class="token-item"></li>`)
                          .data({
                            'group': token.parent,
                            'token': token.id
                          })
                          .append($(`<span class="ui-sortable-handle"></span>`))
                          .append($icon ? $icon : null)
                          .append($('<span class="token-key"></span>').text(token.name));
                      })
                    )
                )
              )
          )
        });
      } else {
        $assignedTokensNodeList.append(`<div class="no-node-selected">Please select a node that has assigned at least one token.</div>`)
      }
    },
    updateToken: function (token: Token) {
      const { $expend, $heading } = $(`#${token.parent}`).data();
      getToken().forEach(_token => {
        this.token(_token);
      });
      if ($heading.is('[aria-expanded="false"]')) {
        $expend.trigger('click');
      }
    },
    updateThemeMode: function () {
      $('#design-tokens-container .fill-color-icon').parent().each((index, item) => {
        const { token } = $(item).data();
        this.token(getToken(token));
      });
    },
    removeGroup: function (group: Group) {
      $(`#${group.id}`).remove();
    },
    removeToken: function (token: Token) {
      const group = getGroup(token.parent);
      const { $expend } = $(`#${token.parent}`).data();
  
      $(`#${token.id}`).remove();
      if (group.tokens.length === 1) $expend.hide();
    }
  };

  function initVersion (versions: Array<Version>) {
    versions.forEach((version: Version) => {
      const $version = Renderer.version(new Version(version));
      const { data } = $version.data();
      setVersion(data);
    });
  }
  
  function init () {
    const _themeModes = data.themeModes.map(({ id, name, isDefault }) => new ThemeMode({ id, name, isDefault }));
    setThemeModes(_themeModes);
    // themeModes.forEach((mode: ThemeMode) => Renderer.themeMode(mode));
    //groups: Array<Object>
    // let isTokenOpen = false;
    // groups.forEach((group: Group) => {
    //   const $group = Renderer.group(new Group({
    //     id: group.id,
    //     name: group.name
    //   }));
    //   const { $expend, data } = $group.data();
    //   setGroup(data);
    //   if (group.tokens.length > 0) {
    //     group.tokens.forEach(token => {
    //       token.properties = token.properties.map((property: any) => {
    //         const data = new Properties[property._type.replace(/[^A-Za-z]/g, '')](property);
    //         setProperty(data);
    //         return data;
    //       });
    //       if (token.propertyType === String(Mixed)) token.propertyType = Mixed;
    //       const $token = Renderer.token(new Token(token));
    //       setToken($token.data);
    //       setPureToken($token.data);
    //     });
    //     if (!isTokenOpen) {
    //       isTokenOpen = true;
    //       $expend.trigger('click');
    //     }
    //   }
    // });
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
  function createVersion () {
    const saveData = getSaveData();
    const dataHash = hash.sha256().update(JSON.stringify(saveData)).digest('hex');
    const $version = Renderer.version(new Version({ hash: dataHash, data: saveData }));
    const { data, $name } = $version.data();
    $name.selectText();
    setVersion(data);
  }
  function updateCurrentThemeMode () {
    const themeMode = getCurrentThemeMode();
    $desiginSystemTabs.find('.theme-modes ul')
      .children()
      .removeClass('selected')
      .filter((index, item) => $(item).data('id') === themeMode)
      .addClass('selected');
    
    Renderer.updateThemeMode();
    $tokenSetting.TokenSetting('changeThemeMode');
    syncPageThemeMode();
  }

  const onMessageReceived = (event) => {
    const msg = event.data.pluginMessage;
    // console.log(event);
    if (msg.type === MessageTypes.GET_FONTS) {
      setFonts(msg.message);
    }
    if (msg.type === MessageTypes.GET_VERSIONS) {
      initVersion(msg.message);
    }
    // if (msg.type === MessageTypes.GET_MODES) {
    //   initThemeMode(msg.message);
    // }
    if (msg.type === MessageTypes.GET_INIT_THEME_MODE) {
      msg.message ? setCurrentThemeMode(msg.message) : setCurrentThemeMode(getThemeMode()[0].id);
      updateCurrentThemeMode();
    }
    if (msg.type === MessageTypes.GET_CURRENT_THEME_MODE) {
      updateCurrentThemeMode();
    }
    if (msg.type === MessageTypes.GET_TOKENS) {
      // console.log(JSON.stringify(msg.message));
      // init(msg.message);
    }
    if (msg.type === MessageTypes.SELECTION_CHANGE) {
      Renderer.tokensAssigned(msg.message.filter(selection => selection.useTokens.length));
      $('#design-tokens-container').trigger('click');
    }
  }
  const addPostMessageListener = () => {
    window.addEventListener("message", onMessageReceived, false);
  }
    
  const removePostMessageListener = () => {
    window.removeEventListener("message", onMessageReceived);
  }

  useEffect(() => {
    // if (themeModes.length === 0) return;
    $tokenContainer = $('#design-tokens-container');
    $desiginSystemTabs = $('#desigin-system-tabs');
    $tokenSetting = $('#token-setting');
    $groupCreator = $('#group-creator');
    $modeCreator = $('#mode-creator');
    $themeModeList = $('#mode-list');
    // $tabTokensAssigned = $('[aria-controls="selections"]').parent();
    $assignedTokensNodeList = $('#assigned-tokens-node-list');
    $versionCreator = $('#version-creator');
    $versionList = $('#version-list');
  //   addPostMessageListener();
    init();
    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
      $($(this).attr('href')).append($tokenSetting);
      if ($tokenSetting.prev().is(':visible')) $tokenSetting.hide();
        else $tokenSetting.show();
    })
    $(document).on(`${BrowserEvents.CLICK}`, '.theme-mode', function () {
      const themeModeId = $(this).data('id');
      setCurrentThemeMode(themeModeId);
      updateCurrentThemeMode();
    });
    //done
    $(document).on(`${BrowserEvents.CLICK} ${BrowserEvents.MOUSE_OVER} ${BrowserEvents.MOUSE_OUT}`, '#design-tokens-container .token-item, #assigned-tokens-node-list .token-item, #design-tokens-container .group-item',
      $.debounce(20, function ({ type, target }) {
        const $item = $(this);
        if ($item.is('.token-item')) {
          const editBtn = $(target).closest('.token-edit-btn');
          if (!editBtn.length && $item.is('#design-tokens-container .token-item') &&  type === BrowserEvents.CLICK) {
            $('.token-item-selected').removeClass('token-item-selected');
            $item.addClass('token-item-selected');
            sendMessage(MessageTypes.ASSIGN_TOKEN ,getToken($item.data('token')));
          }
          if (type === BrowserEvents.MOUSE_OVER) {
            if (!$item.is($tokenActionWrapper.data('hoveredItem'))) {
              $tokenActionWrapper.data('hoveredItem', $item);
              $item.append($tokenActionWrapper);
              $('.open').removeClass('open');
            }
          }
        } else {
          if (type === BrowserEvents.MOUSE_OVER) {
            if (!$item.is($groupActionDropdown.data('hoveredItem'))) {
              $groupActionDropdown.data('hoveredItem', $item);
              $('.open').removeClass('open');
            }
          }
        }
      })
    );
    // This event listener is to prevent collapse event.
    $(document).on(BrowserEvents.CLICK, '.group-name:focus, .add-token', preventEvent);
    // token setting
    $(document).on(BrowserEvents.CLICK, '.token-edit-btn, .add-token', function () {
      let { group, token } = $(this).closest('.token-item, .panel-heading').data();
      Utils.clearSelection();
      $tokenSetting.TokenSetting({ group, token });
      $tokenSetting.prev().removeClass('show');
    });
    $(document).on(BrowserEvents.CONTEXTMENU, '.token-edit-btn, #design-tokens-container .panel-heading .panel-title', function (e) {
      const $this = $(this);
      let { group, token } = $this.closest('.token-item, .panel-heading').data();
      const $dropdownContainer = $this.parent();
      $('.dropdown').removeClass('open');
      $dropdownContainer.addClass('open');
      $tokenActionDelete
        .removeClass('disabled')
        .removeAttr('title');
      Utils.clearSelection();
      if (token) {
        if ($this.is('#design-tokens-container .token-edit-btn')) {
          const refers = referByToken(getToken(token));
          if (refers.length > 0) {
            $tokenActionDelete
              .addClass('disabled')
              .attr('title', `This token has been linked by token: ${refers.map(refer => refer.name)}`);
          }
          $tokenActionClone.add($tokenActionDelete).show();
          $tokenActionUnassign.hide();
        } else {
          $tokenActionClone.add($tokenActionDelete).hide();
          $tokenActionUnassign.show();
        }
      } else {
        const _group = getGroup(group);
        const refers = [];
        _group.tokens.forEach(token => { 
          const refer = referByToken(token);
          if (refer.length) refers.push(...refer);
        });
        $dropdownContainer.append($groupActionDropdown);
        if (refers.length) {
          $groupActionDelete
            .addClass('disabled')      
            .attr('title', `The tokens under the group ${_group.name} has been linked by other tokens: ${refers.map(refer => refer.name)}`);
        } else {
          $groupActionDelete
            .removeClass('disabled')      
            .removeAttr('title');
        }
      }
    });
    $(document).on(BrowserEvents.CLICK, '.delete-token:not(".disabled"), .clone-token, .delete-group:not(".disabled"), .unassign-token', function (e) {
      const $this = $(this);
      const { group, token } = $this.closest('.token-item, .panel-heading, .group-item').data();
      const _group = getGroup(group);
      const _token = getToken(token);
      if ($this.is('.delete-group')) {
        Renderer.removeGroup(_group);
        removeGroup(_group);
        save();
      } else if ($this.is('.delete-token')) {
        Renderer.removeToken(_token);
        removeToken(_token);
        save();
      } else if ($this.is('.clone-token')) {
        const _cloneToken = _cloneDeep(_token);
        _cloneToken.id = v4();
        _cloneToken.name = `${_cloneToken.name}-copy`;
        setToken(_cloneToken);
        Utils.clearSelection();
        $tokenContainer.removeClass('show');
        $tokenSetting.TokenSetting({ group, token: _cloneToken.id });
      } else if ($this.is('.unassign-token')) {
        sendMessage(MessageTypes.UNASSIGN_TOKEN , {
          nodeId: $this.closest('.selected-node').data('id'),
          tokenId: token
        });
      }
      preventEvent(e);
    });
    $(document).on(BrowserEvents.CLICK, '.delete-token, .clone-token, .delete-group', function (e) {
      preventEvent(e);
    });
    // done
    $(document).on(BrowserEvents.DBCLICK, '.group-name', function (e) {
      $(this).selectText();
      preventEvent(e);
    });
    $(document).on(BrowserEvents.DBCLICK, '.theme-mode-name, .version-name', function (e) {
      $(this).selectText();
      preventEvent(e);
    });
    // need to update
    $(document).on(`${BrowserEvents.CLICK} ${BrowserEvents.MOUSE_OVER}`, '#design-tokens-container.plugin-panel', function (e) {
      const $target = $(e.target);
      const type = e.type;
      const $tokenItem = $target.closest('.token-item');
      const $groupItem = $target.closest('.group-item');
      // const $radiusSeparateBtns = $(event.target).closest('.separator-vals .btn-group');
      if ( type === BrowserEvents.CLICK) {
        if ($tokenItem.length === 0) {
          $('.token-item').removeClass('token-item-selected');
        }
        $('.open').removeClass('open');
      } else if (type === BrowserEvents.MOUSE_OVER && $tokenItem.length === 0 && $groupItem.length === 0) {
        $('.open').removeClass('open');
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
    // $(document).on(`${BrowserEvents.BLUR}`, '.group-name, .theme-mode-name, .version-name', function () {
    //   valChange.call(this);
    //   const $this = $(this);
    //   setTimeout(() => {
    //     if ($this.is('.theme-mode-name') && $this.text()) {
    //       $modeCreator.removeAttr('disabled');
    //       // setTimeout(function() {
    //         Renderer.themeModes();
    //         updateCurrentThemeMode();
    //       // }, 400);
    //     }
        
    //     if ($this.is('.version-name') && $this.text()) {
    //       $versionCreator.removeAttr('disabled');
    //     }
    //   }, 400);
    // });
    $(document).on(`${BrowserEvents.KEY_UP}`, '.group-name, .theme-mode-name, .version-name', inputCheck);
    $(document).on(BrowserEvents.CLICK, '#mode-creator, #version-creator', function (e) {
      const $this = $(this);
      if ($this.is('[disabled]')) return;
      if ($this.is('#mode-creator')) {
        createMode();
        $modeCreator.attr('disabled', true);
      } else {
        createVersion();
        $versionCreator.attr('disabled', true);
      }
      preventEvent(e);
    });
    $(document).on(BrowserEvents.CLICK, `#token-setting .mode-item`, function (event) {
      const $this = $(this);
      const useMode = $this.data('themeMode');
      const property = $this.parent().data('property');
    
      property.options.themeMode = useMode.id;
      property.$themeModeList
          .children()
          .removeClass('selected')
          .filter((index, item) => $(item).data('id') === useMode.id)
          .addClass('selected');
    });
    
    $(document).on(BrowserEvents.CLICK, '.version-restore', function (e) {
      restore($(this).closest('li').data('data'));
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
      $tokenSetting.prev().addClass('show');
    });  
    $(document).on( "sortupdate", '.token-list', function(event, ui) {
      const $sortedItem = $(ui.item[0]);
      const $sortableContainer = $sortedItem.parent();
      const tokens = $.makeArray($sortableContainer.children()).map($token => {
        const tokenId = $($token).data('token');
        return getToken(tokenId);;
      });
      if ($sortedItem.is('#assigned-tokens-node-list .token-item')) {
        sendMessage(MessageTypes.REORDER_ASSIGN_TOKEN , {
          nodeId: $sortedItem.closest('.selected-node').data('id'),
          tokens: tokens.map(token => token.id)
        });
      } else {
        const group = getGroup($sortedItem.data('group'));
        group.tokens = tokens;
        save();
      }
    });
  }, []);
  console.log('Token', admin);
  return (
    <>
      <ul id="desigin-system-tabs" className="nav nav-tabs" role="tablist">
        <li role="presentation" className="active"><a href="#tokens" aria-controls="tokens" role="tab" data-toggle="tab" aria-expanded="true">Tokens</a></li>
        <li role="presentation"><a href="#tokens-assigned" aria-controls="selections" role="tab" data-toggle="tab">Assigned</a></li>
        {
          admin && (
          <>
            <li role="presentation"><a href="#modes" aria-controls="modes" role="tab" data-toggle="tab">Modes</a></li>
            <li role="presentation"><a href="#io" aria-controls="io" role="tab" data-toggle="tab">I/O</a></li>
          </>
          )
        }
        
        <div id="export" title="Export a JSON file" className="export"><span className="tmicon tmicon-export"></span></div>
      </ul>
      <div className="tab-content">
        <div role="tabpanel" className="tab-pane active" id="tokens">
          <div id="design-tokens-container" className="plugin-panel panel-group panel-group-collapse panel-group-collapse-basic show">
            {
              admin && <div id="group-creator" className="group-create">Add a new group</div>
            }
          </div>
          <div id="token-setting" className="plugin-panel"></div>
        </div>
        <div role="tabpanel" className="tab-pane" id="tokens-assigned">
          <div id="assigned-tokens-node-list" className="plugin-panel panel-group panel-group-collapse panel-group-collapse-basic show"></div>     
        </div>
        {
          admin && (
            <>
              <div role="tabpanel" className="tab-pane" id="modes">
                <div id="mode-setting" className="plugin-panel show">
                  <ThemeModeList></ThemeModeList>
                  <div id="mode-creator" className="mode-create">Add a new theme mode</div>
                </div>
              </div>
              <div role="tabpanel" className="tab-pane" id="io">
                <div className="plugin-panel panel-group panel-group-collapse panel-group-collapse-basic show">
                  <div className="setting-row">
                    <label>Versions:</label>
                    <ul id="version-list"></ul>
                    <div id="version-creator" className="version-create">Save as a new version</div>
                  </div>
                  <div className="setting-row">
                    <label htmlFor="import-setting">Import:</label>
                    <textarea id="import-setting"></textarea>
                    <button id="import-btn" className="btn btn-primary btn-sm">Import</button>
                  </div>
                </div>    
              </div>
            </>
          )
        }
      </div>
    </>
  );
};

export default Tokens;